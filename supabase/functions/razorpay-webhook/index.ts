import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac } from "https://deno.land/std@0.190.0/crypto/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-razorpay-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[RAZORPAY-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Razorpay webhook received");

    const razorpaySecret = Deno.env.get("RAZORPAY_SECRET");
    if (!razorpaySecret) {
      throw new Error("Missing Razorpay webhook secret");
    }

    // Create Supabase client with service role key to bypass RLS
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify webhook signature
    const signature = req.headers.get("x-razorpay-signature");
    const body = await req.text();
    
    if (!signature) {
      throw new Error("Missing Razorpay signature header");
    }

    // Generate expected signature
    const expectedSignature = createHmac("sha256", razorpaySecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      logStep("Webhook signature verification failed");
      throw new Error("Invalid webhook signature");
    }

    const webhookData = JSON.parse(body);
    const event = webhookData.event;
    const payload = webhookData.payload.payment.entity || webhookData.payload.order.entity;

    logStep("Webhook verified", { event, entityId: payload.id });

    switch (event) {
      case "payment.captured":
        // Payment was successful
        await supabaseService
          .from("payments")
          .update({
            razorpay_payment_id: payload.id,
            status: "paid",
            paid_at: new Date(payload.created_at * 1000).toISOString(),
            payment_method: payload.method,
            customer_email: payload.email,
            customer_phone: payload.contact,
            notes: {
              ...payload.notes,
              webhook_processed: true,
              webhook_event: event,
              processed_at: new Date().toISOString()
            }
          })
          .eq("razorpay_order_id", payload.order_id);

        logStep("Payment marked as paid", { paymentId: payload.id });

        // Update premium status if it's a subscription
        const { data: payment } = await supabaseService
          .from("payments")
          .select("user_id, plan_type")
          .eq("razorpay_order_id", payload.order_id)
          .single();

        if (payment?.plan_type === 'subscription' && payment?.user_id) {
          const premiumExpiresAt = new Date();
          premiumExpiresAt.setMonth(premiumExpiresAt.getMonth() + 1);

          await supabaseService
            .from("profiles")
            .update({
              is_premium: true,
              premium_expires_at: premiumExpiresAt.toISOString()
            })
            .eq("user_id", payment.user_id);

          logStep("Premium status activated", { userId: payment.user_id });
        }
        break;

      case "payment.failed":
        // Payment failed
        await supabaseService
          .from("payments")
          .update({
            razorpay_payment_id: payload.id,
            status: "failed",
            failed_at: new Date(payload.created_at * 1000).toISOString(),
            notes: {
              error_code: payload.error_code,
              error_description: payload.error_description,
              error_reason: payload.error_reason,
              webhook_processed: true,
              webhook_event: event,
              processed_at: new Date().toISOString()
            }
          })
          .eq("razorpay_order_id", payload.order_id);

        logStep("Payment marked as failed", { paymentId: payload.id, errorCode: payload.error_code });
        break;

      case "order.paid":
        // Order completed successfully
        await supabaseService
          .from("payments")
          .update({
            status: "paid",
            notes: {
              order_paid: true,
              webhook_processed: true,
              webhook_event: event,
              processed_at: new Date().toISOString()
            }
          })
          .eq("razorpay_order_id", payload.id);

        logStep("Order marked as paid", { orderId: payload.id });
        break;

      default:
        logStep("Unhandled webhook event", { event });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Webhook processed successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook processing", { message: errorMessage });
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
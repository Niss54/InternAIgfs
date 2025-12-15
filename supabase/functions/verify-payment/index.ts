import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac } from "https://deno.land/std@0.190.0/crypto/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

interface PaymentVerificationRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  amount?: number;
  payment_method?: string;
  customer_contact?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Payment verification started");

    const razorpaySecret = Deno.env.get("RAZORPAY_SECRET");
    if (!razorpaySecret) {
      throw new Error("Missing Razorpay secret key");
    }

    // Create Supabase client with service role key to bypass RLS
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, payment_method, customer_contact }: PaymentVerificationRequest = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      throw new Error("Missing required payment verification parameters");
    }

    // Verify Razorpay signature
    const generatedSignature = createHmac("sha256", razorpaySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isSignatureValid = generatedSignature === razorpay_signature;
    logStep("Signature verification", { isValid: isSignatureValid });

    if (!isSignatureValid) {
      // Update payment as failed
      await supabaseService
        .from("payments")
        .update({
          status: "failed",
          failed_at: new Date().toISOString(),
          notes: { error: "Invalid signature", verification_failed: true }
        })
        .eq("razorpay_order_id", razorpay_order_id);

      throw new Error("Payment signature verification failed");
    }

    // Update payment as successful
    const { data: updatedPayment, error: updateError } = await supabaseService
      .from("payments")
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: "paid",
        paid_at: new Date().toISOString(),
        payment_method: payment_method || null,
        customer_phone: customer_contact || null,
        notes: { verification_success: true, verified_at: new Date().toISOString() }
      })
      .eq("razorpay_order_id", razorpay_order_id)
      .select()
      .single();

    if (updateError) {
      logStep("Error updating payment", updateError);
      throw new Error(`Failed to update payment: ${updateError.message}`);
    }

    // If this is a premium subscription, update user's premium status
    if (updatedPayment?.plan_type === 'subscription' && updatedPayment?.user_id) {
      const premiumExpiresAt = new Date();
      premiumExpiresAt.setMonth(premiumExpiresAt.getMonth() + 1); // 1 month premium

      const { error: profileError } = await supabaseService
        .from("profiles")
        .update({
          is_premium: true,
          premium_expires_at: premiumExpiresAt.toISOString()
        })
        .eq("user_id", updatedPayment.user_id);

      if (profileError) {
        logStep("Warning: Could not update premium status", profileError);
      } else {
        logStep("Premium status updated successfully", { userId: updatedPayment.user_id });
      }
    }

    logStep("Payment verification completed successfully", { paymentId: razorpay_payment_id });

    return new Response(JSON.stringify({
      success: true,
      verified: true,
      payment: updatedPayment,
      message: "Payment verified successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in payment verification", { message: errorMessage });
    
    return new Response(JSON.stringify({
      success: false,
      verified: false,
      error: errorMessage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
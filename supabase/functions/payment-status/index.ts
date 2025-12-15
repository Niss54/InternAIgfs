import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PAYMENT-STATUS] ${step}${detailsStr}`);
};

interface PaymentStatusRequest {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  payment_id?: string; // Our internal payment ID
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Payment status check started");

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpaySecret = Deno.env.get("RAZORPAY_SECRET");

    if (!razorpayKeyId || !razorpaySecret) {
      throw new Error("Missing Razorpay credentials");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { razorpay_order_id, razorpay_payment_id, payment_id }: PaymentStatusRequest = await req.json();

    if (!razorpay_order_id && !razorpay_payment_id && !payment_id) {
      throw new Error("Missing payment identifier");
    }

    // Query our database for payment record
    let query = supabaseClient
      .from("payments")
      .select("*")
      .eq("user_id", user.id);

    if (payment_id) {
      query = query.eq("id", payment_id);
    } else if (razorpay_order_id) {
      query = query.eq("razorpay_order_id", razorpay_order_id);
    } else if (razorpay_payment_id) {
      query = query.eq("razorpay_payment_id", razorpay_payment_id);
    }

    const { data: payment, error: paymentError } = await query.maybeSingle();

    if (paymentError) {
      throw new Error(`Database error: ${paymentError.message}`);
    }

    if (!payment) {
      return new Response(JSON.stringify({
        success: false,
        error: "Payment not found"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    // If payment is still pending and we have a Razorpay order ID, check with Razorpay
    let razorpayPaymentData = null;
    if (payment.status === 'created' && payment.razorpay_order_id) {
      try {
        const razorpayAuth = btoa(`${razorpayKeyId}:${razorpaySecret}`);
        
        // Check order status with Razorpay
        const orderResponse = await fetch(`https://api.razorpay.com/v1/orders/${payment.razorpay_order_id}`, {
          headers: {
            "Authorization": `Basic ${razorpayAuth}`,
            "Content-Type": "application/json",
          },
        });

        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          logStep("Razorpay order data retrieved", { orderId: orderData.id, status: orderData.status });
          
          // If order has payments, get the payment details
          if (orderData.status === 'paid') {
            const paymentsResponse = await fetch(`https://api.razorpay.com/v1/orders/${payment.razorpay_order_id}/payments`, {
              headers: {
                "Authorization": `Basic ${razorpayAuth}`,
                "Content-Type": "application/json",
              },
            });
            
            if (paymentsResponse.ok) {
              const paymentsData = await paymentsResponse.json();
              if (paymentsData.items && paymentsData.items.length > 0) {
                razorpayPaymentData = paymentsData.items[0]; // Get the first payment
              }
            }
          }
        }
      } catch (razorpayError) {
        logStep("Warning: Could not fetch Razorpay status", { error: razorpayError });
      }
    }

    logStep("Payment status retrieved", { 
      paymentId: payment.id, 
      status: payment.status,
      hasRazorpayData: !!razorpayPaymentData 
    });

    return new Response(JSON.stringify({
      success: true,
      payment: {
        id: payment.id,
        razorpay_order_id: payment.razorpay_order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        plan_type: payment.plan_type,
        plan_name: payment.plan_name,
        payment_method: payment.payment_method,
        created_at: payment.created_at,
        paid_at: payment.paid_at,
        failed_at: payment.failed_at,
        notes: payment.notes
      },
      razorpay_data: razorpayPaymentData
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in payment status check", { message: errorMessage });
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
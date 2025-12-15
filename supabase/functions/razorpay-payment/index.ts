import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[RAZORPAY] ${step}${detailsStr}`);
};

interface PaymentRequest {
  amount: number; // in paise (e.g., 50000 for ₹500)
  currency: string; // INR
  planType: 'one-time' | 'subscription';
  planName: string;
  description?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Razorpay payment function started");

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpaySecret = Deno.env.get("RAZORPAY_SECRET");

    if (!razorpayKeyId || !razorpaySecret) {
      throw new Error("Missing Razorpay credentials");
    }

    // Create Supabase client with anon key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization") ?? "",
          },
        },
        auth: {
          persistSession: false,
        },
      }
    );

    // Get the authenticated user
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { amount, currency, planType, planName, description }: PaymentRequest = await req.json();

    if (!amount || !currency || !planType || !planName) {
      throw new Error("Missing required fields: amount, currency, planType, and planName");
    }

    // Create Razorpay order
    const razorpayOrderData = {
      amount: amount, // Amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        user_id: user.id,
        user_email: user.email,
        plan_type: planType,
        plan_name: planName,
      },
    };

    logStep("Creating Razorpay order", razorpayOrderData);

    const razorpayAuth = btoa(`${razorpayKeyId}:${razorpaySecret}`);
    
    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${razorpayAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(razorpayOrderData),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      logStep("Razorpay order creation failed", { status: orderResponse.status, error: errorText });
      throw new Error(`Razorpay API error: ${orderResponse.status} - ${errorText}`);
    }

    const order = await orderResponse.json();
    logStep("Razorpay order created successfully", { orderId: order.id });

    // Store payment record in database for tracking
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create payment record
    try {
      const { error: paymentError } = await supabaseService.from("payments").insert({
        user_id: user.id,
        razorpay_order_id: order.id,
        amount: amount,
        currency: currency,
        status: "created",
        plan_type: planType,
        plan_name: planName,
        customer_email: user.email,
        notes: {
          description: description || `Payment for ${planName}`,
          created_via: "razorpay-payment-function",
          order_created_at: new Date().toISOString()
        }
      });
      
      if (paymentError) {
        logStep("Warning: Could not create payment record", { error: paymentError });
      } else {
        logStep("Payment record created successfully", { orderId: order.id });
      }
    } catch (dbError) {
      logStep("Warning: Database error creating payment record", { error: dbError });
    }

    // Return order details for frontend to initiate payment
    return new Response(JSON.stringify({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: razorpayKeyId, // Frontend needs this to initialize payment
      },
      user: {
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
        email: user.email,
      },
      planDetails: {
        name: planName,
        type: planType,
        description: description || `Payment for ${planName}`,
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in razorpay-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
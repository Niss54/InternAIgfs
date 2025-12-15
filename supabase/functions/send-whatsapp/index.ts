import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WhatsAppMessage {
  to: string;
  message: string;
  mediaUrl?: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[WHATSAPP] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("WhatsApp function started");

    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    
    if (!accountSid || !authToken) {
      throw new Error("Missing Twilio credentials");
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
    
    logStep("User authenticated", { userId: user.id });

    const { to, message, mediaUrl }: WhatsAppMessage = await req.json();
    
    if (!to || !message) {
      throw new Error("Missing required fields: to and message");
    }

    // Format phone number for WhatsApp (must include country code)
    const formattedTo = to.startsWith("+") ? `whatsapp:${to}` : `whatsapp:+${to}`;
    
    // Prepare Twilio request
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const credentials = btoa(`${accountSid}:${authToken}`);
    
    const body = new URLSearchParams({
      From: "whatsapp:+14155238886", // Twilio WhatsApp Sandbox number
      To: formattedTo,
      Body: message,
    });

    if (mediaUrl) {
      body.append("MediaUrl", mediaUrl);
    }

    logStep("Sending WhatsApp message", { to: formattedTo, message });

    const twilioResponse = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!twilioResponse.ok) {
      const errorText = await twilioResponse.text();
      logStep("Twilio API Error", { status: twilioResponse.status, error: errorText });
      throw new Error(`Twilio API error: ${twilioResponse.status} - ${errorText}`);
    }

    const result = await twilioResponse.json();
    logStep("WhatsApp message sent successfully", { messageSid: result.sid });

    return new Response(JSON.stringify({ 
      success: true, 
      messageSid: result.sid,
      status: result.status 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in send-whatsapp", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
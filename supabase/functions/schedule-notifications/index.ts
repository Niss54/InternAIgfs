import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Checking for scheduled notifications...');
    const now = new Date();
    
    // Check for premium notifications to send
    const { data: premiumNotifications, error: premiumError } = await supabase
      .from('internship_notifications')
      .select('*')
      .eq('premium_sent', false)
      .lte('premium_release_time', now.toISOString());

    if (premiumError) {
      console.error('Error fetching premium notifications:', premiumError);
    }

    // Check for general notifications to send
    const { data: generalNotifications, error: generalError } = await supabase
      .from('internship_notifications')
      .select('*')
      .eq('general_sent', false)
      .lte('general_release_time', now.toISOString());

    if (generalError) {
      console.error('Error fetching general notifications:', generalError);
    }

    const results = [];

    // Send premium notifications
    if (premiumNotifications && premiumNotifications.length > 0) {
      console.log(`Found ${premiumNotifications.length} premium notifications to send`);
      
      const { data: premiumResult, error: premiumSendError } = await supabase.functions.invoke(
        'send-push-notifications',
        {
          body: {
            notificationType: 'internship_alert',
            userType: 'premium'
          }
        }
      );

      if (premiumSendError) {
        console.error('Error sending premium notifications:', premiumSendError);
      } else {
        results.push({ type: 'premium', result: premiumResult });
      }
    }

    // Send general notifications
    if (generalNotifications && generalNotifications.length > 0) {
      console.log(`Found ${generalNotifications.length} general notifications to send`);
      
      const { data: generalResult, error: generalSendError } = await supabase.functions.invoke(
        'send-push-notifications',
        {
          body: {
            notificationType: 'internship_alert',
            userType: 'general'
          }
        }
      );

      if (generalSendError) {
        console.error('Error sending general notifications:', generalSendError);
      } else {
        results.push({ type: 'general', result: generalResult });
      }
    }

    // Clean up old notifications (older than 7 days)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const { error: cleanupError } = await supabase
      .from('internship_notifications')
      .delete()
      .lt('created_at', weekAgo.toISOString())
      .eq('premium_sent', true)
      .eq('general_sent', true);

    if (cleanupError) {
      console.error('Error cleaning up old notifications:', cleanupError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: now.toISOString(),
        premiumCount: premiumNotifications?.length || 0,
        generalCount: generalNotifications?.length || 0,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in schedule-notifications function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
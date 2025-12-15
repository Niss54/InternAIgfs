import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { internship_id, user_profile, internship_details } = await req.json();

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    // Check if already applied
    const { data: existingApplication } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('internship_id', internship_id)
      .single();

    if (existingApplication) {
      return new Response(
        JSON.stringify({ error: 'Already applied to this internship' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create application with auto-filled data
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .insert({
        user_id: user.id,
        internship_id: internship_id,
        status: 'applied',
        notes: 'Applied via 1-Click Apply with auto-filled profile data'
      })
      .select()
      .single();

    if (applicationError) {
      throw applicationError;
    }

    // Create notification for the user
    await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'application',
        title: 'Application Submitted Successfully',
        message: `Your application for ${internship_details.role} at ${internship_details.company} has been submitted.`,
        data: {
          internship_id,
          application_id: application.id,
          company: internship_details.company,
          role: internship_details.role
        }
      });

    // Send multi-channel notifications if enabled
    try {
      await supabase.functions.invoke('send-multi-channel-notification', {
        body: {
          user_id: user.id,
          notification_type: 'application_success',
          data: {
            company: internship_details.company,
            role: internship_details.role,
            application_id: application.id
          }
        }
      });
    } catch (notificationError) {
      console.error('Failed to send multi-channel notification:', notificationError);
      // Don't fail the whole request if notification fails
    }

    console.log(`One-click application submitted: User ${user.id} applied to ${internship_details.company}`);

    return new Response(
      JSON.stringify({
        success: true,
        application_id: application.id,
        message: 'Application submitted successfully!'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in one-click-apply function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
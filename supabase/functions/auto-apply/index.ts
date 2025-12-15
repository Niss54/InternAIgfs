import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AutoApplyRequest {
  internship_ids: string[];
  cover_letter_template?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user from the auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    const { internship_ids, cover_letter_template = '' }: AutoApplyRequest = await req.json();

    if (!internship_ids || internship_ids.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No internship IDs provided' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    console.log(`Processing auto-apply for user ${user.id} to ${internship_ids.length} internships`);

    // Get user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      return new Response(
        JSON.stringify({ error: 'User profile not found. Please complete your profile first.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Get internship details
    const { data: internships, error: internshipsError } = await supabaseClient
      .from('internships')
      .select('*')
      .in('id', internship_ids)
      .eq('is_active', true);

    if (internshipsError) {
      console.error('Internships error:', internshipsError);
      throw internshipsError;
    }

    if (!internships || internships.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid internships found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const results = {
      successful_applications: [],
      failed_applications: [],
      already_applied: []
    };

    // Process each internship application
    for (const internship of internships) {
      try {
        // Check if already applied
        const { data: existingApplication } = await supabaseClient
          .from('applications')
          .select('id')
          .eq('user_id', user.id)
          .eq('internship_id', internship.id)
          .single();

        if (existingApplication) {
          results.already_applied.push({
            internship_id: internship.id,
            company_name: internship.company_name,
            title: internship.title
          });
          continue;
        }

        // Create application record
        const { data: application, error: applicationError } = await supabaseClient
          .from('applications')
          .insert({
            user_id: user.id,
            internship_id: internship.id,
            status: 'applied',
            notes: cover_letter_template || `Auto-applied using profile preferences. Skills: ${profile.skills?.join(', ')}`
          })
          .select()
          .single();

        if (applicationError) {
          console.error('Application error:', applicationError);
          results.failed_applications.push({
            internship_id: internship.id,
            company_name: internship.company_name,
            title: internship.title,
            error: applicationError.message
          });
          continue;
        }

        results.successful_applications.push({
          internship_id: internship.id,
          company_name: internship.company_name,
          title: internship.title,
          application_id: application.id
        });

        console.log(`Successfully applied to ${internship.company_name} - ${internship.title}`);

        // Here you could add external API calls to actually submit applications
        // to the company's application system if they provide APIs
        // For now, we're just tracking the intent to apply

      } catch (error) {
        console.error(`Error applying to ${internship.company_name}:`, error);
        results.failed_applications.push({
          internship_id: internship.id,
          company_name: internship.company_name,
          title: internship.title,
          error: error.message
        });
      }
    }

    // Send confirmation email using the existing Gemini chat function for now
    // In a real implementation, you'd use a dedicated email service
    if (results.successful_applications.length > 0) {
      try {
        const emailContent = `
          🎉 Auto-Application Success Report
          
          Hi ${profile.full_name},
          
          Your auto-apply process has completed! Here's the summary:
          
          ✅ Successfully Applied (${results.successful_applications.length}):
          ${results.successful_applications.map(app => 
            `• ${app.company_name} - ${app.title}`
          ).join('\n')}
          
          ${results.already_applied.length > 0 ? `
          ⚠️ Already Applied (${results.already_applied.length}):
          ${results.already_applied.map(app => 
            `• ${app.company_name} - ${app.title}`
          ).join('\n')}
          ` : ''}
          
          ${results.failed_applications.length > 0 ? `
          ❌ Failed Applications (${results.failed_applications.length}):
          ${results.failed_applications.map(app => 
            `• ${app.company_name} - ${app.title}`
          ).join('\n')}
          ` : ''}
          
          Next Steps:
          - Monitor your applications in the dashboard
          - Prepare for potential interview calls
          - Keep your profile updated
          
          Good luck with your internship search!
          
          Best regards,
          InternAI Team
        `;

        console.log('Application summary prepared for user:', profile.email);
        // Email sending would be implemented here with a proper email service
        
      } catch (emailError) {
        console.error('Email notification error:', emailError);
        // Don't fail the whole process if email fails
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Auto-apply process completed',
        summary: {
          total_attempts: internship_ids.length,
          successful: results.successful_applications.length,
          already_applied: results.already_applied.length,
          failed: results.failed_applications.length
        },
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in auto-apply function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process auto-apply request',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
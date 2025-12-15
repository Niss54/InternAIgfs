import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
          headers: { Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` },
        },
      }
    );

    console.log('Starting interview reminder check...');

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStart = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    const tomorrowEnd = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate() + 1);

    // Find interviews scheduled for tomorrow that haven't had reminders sent
    const { data: upcomingInterviews, error: interviewsError } = await supabaseClient
      .from('interviews')
      .select(`
        id,
        interview_date,
        interview_type,
        meeting_link,
        interviewer_name,
        interviewer_email,
        application_id,
        applications!inner (
          user_id,
          internship_id,
          internships!inner (
            title,
            company_name
          )
        )
      `)
      .gte('interview_date', tomorrowStart.toISOString())
      .lt('interview_date', tomorrowEnd.toISOString())
      .eq('reminder_sent', false);

    if (interviewsError) {
      console.error('Error fetching interviews:', interviewsError);
      throw interviewsError;
    }

    if (!upcomingInterviews || upcomingInterviews.length === 0) {
      console.log('No upcoming interviews found for tomorrow');
      return new Response(
        JSON.stringify({ message: 'No upcoming interviews found', count: 0 }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    console.log(`Found ${upcomingInterviews.length} interviews for tomorrow`);

    const reminderResults = {
      successful_reminders: [],
      failed_reminders: []
    };

    // Process each interview
    for (const interview of upcomingInterviews) {
      try {
        // Get user profile for contact information
        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('user_id', interview.applications.user_id)
          .single();

        if (profileError || !profile) {
          console.error('Profile not found for user:', interview.applications.user_id);
          reminderResults.failed_reminders.push({
            interview_id: interview.id,
            error: 'User profile not found'
          });
          continue;
        }

        const interviewDate = new Date(interview.interview_date);
        const internship = interview.applications.internships;

        // Prepare reminder content
        const emailContent = `
          🚀 Interview Reminder - Tomorrow!
          
          Hi ${profile.full_name},
          
          This is a friendly reminder that you have an interview scheduled for tomorrow:
          
          📅 Date: ${interviewDate.toLocaleDateString()}
          ⏰ Time: ${interviewDate.toLocaleTimeString()}
          🏢 Company: ${internship.company_name}
          💼 Position: ${internship.title}
          📋 Interview Type: ${interview.interview_type}
          
          ${interview.meeting_link ? `🔗 Meeting Link: ${interview.meeting_link}` : ''}
          ${interview.interviewer_name ? `👤 Interviewer: ${interview.interviewer_name}` : ''}
          
          📝 Preparation Tips:
          • Review the job description and company information
          • Prepare examples of your relevant experience
          • Test your tech setup if it's a virtual interview
          • Prepare thoughtful questions about the role
          • Get a good night's sleep!
          
          💡 Common Interview Questions to Review:
          • Tell me about yourself
          • Why are you interested in this position?
          • What are your strengths and weaknesses?
          • Describe a challenging project you've worked on
          
          Good luck with your interview! You've got this! 🌟
          
          Best regards,
          InternAI Team
        `;

        // WhatsApp message content (shorter format)
        const whatsappContent = `
🚀 Interview Reminder - Tomorrow!

Hi ${profile.full_name}!

Your interview is tomorrow:
📅 ${interviewDate.toLocaleDateString()} at ${interviewDate.toLocaleTimeString()}
🏢 ${internship.company_name} - ${internship.title}

${interview.meeting_link ? `🔗 Link: ${interview.meeting_link}` : ''}

Good luck! 🌟
        `;

        console.log(`Sending reminder for interview ${interview.id} to ${profile.email}`);
        
        // Here you would integrate with actual email and WhatsApp services
        // For now, we'll just log the content and mark as sent
        
        // In a real implementation, you would:
        // 1. Send email using Resend, SendGrid, or similar
        // 2. Send WhatsApp using Twilio, WhatsApp Business API, or similar
        
        console.log('Email content prepared:', emailContent.substring(0, 100) + '...');
        console.log('WhatsApp content prepared:', whatsappContent.substring(0, 100) + '...');

        // Mark reminder as sent
        const { error: updateError } = await supabaseClient
          .from('interviews')
          .update({ reminder_sent: true })
          .eq('id', interview.id);

        if (updateError) {
          console.error('Error updating reminder status:', updateError);
          reminderResults.failed_reminders.push({
            interview_id: interview.id,
            error: 'Failed to update reminder status'
          });
          continue;
        }

        reminderResults.successful_reminders.push({
          interview_id: interview.id,
          user_email: profile.email,
          user_phone: profile.phone,
          company_name: internship.company_name,
          position: internship.title,
          interview_date: interview.interview_date
        });

        console.log(`Successfully processed reminder for interview ${interview.id}`);

      } catch (error) {
        console.error(`Error processing interview ${interview.id}:`, error);
        reminderResults.failed_reminders.push({
          interview_id: interview.id,
          error: error.message
        });
      }
    }

    console.log(`Reminder processing complete. Success: ${reminderResults.successful_reminders.length}, Failed: ${reminderResults.failed_reminders.length}`);

    return new Response(
      JSON.stringify({
        message: 'Interview reminder process completed',
        summary: {
          total_interviews: upcomingInterviews.length,
          successful_reminders: reminderResults.successful_reminders.length,
          failed_reminders: reminderResults.failed_reminders.length
        },
        results: reminderResults
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in interview-reminders function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process interview reminders',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
      }
    );
  }
});
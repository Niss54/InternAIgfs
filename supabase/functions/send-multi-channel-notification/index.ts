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

    const { user_id, notification_type, data } = await req.json();

    // Get user preferences
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('notification_preferences, email, phone')
      .eq('user_id', user_id)
      .single();

    if (profileError) {
      throw profileError;
    }

    const preferences = profile.notification_preferences || { email: true, inApp: true, whatsapp: false, browser: true };
    const results = [];

    // Email notification
    if (preferences.email && profile.email) {
      try {
        const emailContent = getEmailContent(notification_type, data);
        // Using a hypothetical email service - replace with your actual email service
        const emailResult = await sendEmail(profile.email, emailContent);
        results.push({ channel: 'email', success: true, result: emailResult });
      } catch (error) {
        results.push({ channel: 'email', success: false, error: error.message });
      }
    }

    // WhatsApp notification
    if (preferences.whatsapp && profile.phone) {
      try {
        const whatsappContent = getWhatsAppContent(notification_type, data);
        const whatsappResult = await sendWhatsApp(profile.phone, whatsappContent);
        results.push({ channel: 'whatsapp', success: true, result: whatsappResult });
      } catch (error) {
        results.push({ channel: 'whatsapp', success: false, error: error.message });
      }
    }

    // Browser push notification
    if (preferences.browser) {
      try {
        const pushContent = getPushContent(notification_type, data);
        await supabase.functions.invoke('send-push-notifications', {
          body: {
            user_ids: [user_id],
            notification: pushContent
          }
        });
        results.push({ channel: 'browser', success: true });
      } catch (error) {
        results.push({ channel: 'browser', success: false, error: error.message });
      }
    }

    console.log(`Multi-channel notification sent for user ${user_id}, type: ${notification_type}`);

    return new Response(
      JSON.stringify({
        success: true,
        results,
        channels_sent: results.filter(r => r.success).length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-multi-channel-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function getEmailContent(type: string, data: any) {
  switch (type) {
    case 'application_success':
      return {
        subject: `Application Submitted - ${data.role} at ${data.company}`,
        html: `
          <h2>Application Submitted Successfully!</h2>
          <p>Your application for <strong>${data.role}</strong> at <strong>${data.company}</strong> has been submitted successfully.</p>
          <p>Application ID: ${data.application_id}</p>
          <p>We'll notify you about any updates on your application status.</p>
        `
      };
    case 'interview_scheduled':
      return {
        subject: `Interview Scheduled - ${data.role} at ${data.company}`,
        html: `
          <h2>Interview Scheduled!</h2>
          <p>Your interview for <strong>${data.role}</strong> at <strong>${data.company}</strong> has been scheduled.</p>
          <p>Date: ${data.date}</p>
          <p>Time: ${data.time}</p>
          <p>Good luck!</p>
        `
      };
    default:
      return {
        subject: 'InternAI Notification',
        html: '<p>You have a new notification from InternAI.</p>'
      };
  }
}

function getWhatsAppContent(type: string, data: any) {
  switch (type) {
    case 'application_success':
      return `🎉 Application Submitted Successfully!\n\nYour application for *${data.role}* at *${data.company}* has been submitted.\n\nApplication ID: ${data.application_id}\n\nWe'll keep you updated!`;
    case 'interview_scheduled':
      return `📅 Interview Scheduled!\n\nInterview for *${data.role}* at *${data.company}*\nDate: ${data.date}\nTime: ${data.time}\n\nGood luck! 🍀`;
    default:
      return 'You have a new notification from InternAI.';
  }
}

function getPushContent(type: string, data: any) {
  switch (type) {
    case 'application_success':
      return {
        title: 'Application Submitted! 🎉',
        body: `Your application for ${data.role} at ${data.company} was submitted successfully.`,
        icon: '/favicon.ico',
        data: { application_id: data.application_id }
      };
    case 'interview_scheduled':
      return {
        title: 'Interview Scheduled! 📅',
        body: `Interview for ${data.role} at ${data.company} on ${data.date}`,
        icon: '/favicon.ico',
        data: { interview_id: data.interview_id }
      };
    default:
      return {
        title: 'InternAI Notification',
        body: 'You have a new notification',
        icon: '/favicon.ico'
      };
  }
}

async function sendEmail(email: string, content: any) {
  // Placeholder for email service integration
  // Replace with actual email service like SendGrid, Resend, etc.
  console.log(`Sending email to ${email}:`, content);
  return { sent: true, recipient: email };
}

async function sendWhatsApp(phone: string, message: string) {
  // Placeholder for WhatsApp integration using Twilio or Meta API
  const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  
  if (!twilioAccountSid || !twilioAuthToken) {
    throw new Error('WhatsApp credentials not configured');
  }
  
  console.log(`Sending WhatsApp to ${phone}:`, message);
  // Implement actual Twilio WhatsApp API call here
  return { sent: true, recipient: phone };
}
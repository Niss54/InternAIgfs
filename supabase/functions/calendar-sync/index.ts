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

    const { action, interview_data, calendar_type = 'google' } = await req.json();

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    let result;

    switch (action) {
      case 'create_event':
        result = await createCalendarEvent(interview_data, calendar_type);
        break;
      case 'update_event':
        result = await updateCalendarEvent(interview_data, calendar_type);
        break;
      case 'delete_event':
        result = await deleteCalendarEvent(interview_data, calendar_type);
        break;
      default:
        throw new Error('Invalid action');
    }

    // Log the calendar action
    await supabase
      .from('calendar_sync_logs')
      .insert({
        user_id: user.id,
        action,
        calendar_type,
        interview_id: interview_data.interview_id,
        event_id: result.event_id,
        status: 'success'
      });

    console.log(`Calendar sync ${action} completed for user ${user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        event_id: result.event_id,
        calendar_url: result.calendar_url
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in calendar-sync function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function createCalendarEvent(interviewData: any, calendarType: string) {
  const { 
    title, 
    description, 
    start_time, 
    end_time, 
    meeting_link,
    company,
    role 
  } = interviewData;

  if (calendarType === 'google') {
    return await createGoogleCalendarEvent({
      summary: `${title || 'Interview'} - ${role} at ${company}`,
      description: `${description || ''}\n\nMeeting Link: ${meeting_link || 'TBD'}`,
      start: { dateTime: start_time },
      end: { dateTime: end_time },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 15 }
        ]
      }
    });
  } else if (calendarType === 'outlook') {
    return await createOutlookEvent({
      subject: `${title || 'Interview'} - ${role} at ${company}`,
      body: {
        content: `${description || ''}\n\nMeeting Link: ${meeting_link || 'TBD'}`,
        contentType: 'text'
      },
      start: { dateTime: start_time, timeZone: 'UTC' },
      end: { dateTime: end_time, timeZone: 'UTC' },
      isReminderOn: true,
      reminderMinutesBeforeStart: 15
    });
  }

  throw new Error('Unsupported calendar type');
}

async function createGoogleCalendarEvent(eventData: any) {
  // Placeholder for Google Calendar API integration
  // In a real implementation, you would:
  // 1. Use OAuth2 to authenticate with Google Calendar API
  // 2. Make a POST request to Google Calendar API to create event
  
  console.log('Creating Google Calendar event:', eventData);
  
  // Generate a placeholder calendar URL for demonstration
  const eventId = `google_${Date.now()}`;
  const calendarUrl = generateGoogleCalendarUrl(eventData);
  
  return {
    event_id: eventId,
    calendar_url: calendarUrl
  };
}

async function createOutlookEvent(eventData: any) {
  // Placeholder for Microsoft Graph API integration
  // In a real implementation, you would:
  // 1. Use OAuth2 to authenticate with Microsoft Graph API
  // 2. Make a POST request to Graph API to create event
  
  console.log('Creating Outlook event:', eventData);
  
  const eventId = `outlook_${Date.now()}`;
  const calendarUrl = generateOutlookCalendarUrl(eventData);
  
  return {
    event_id: eventId,
    calendar_url: calendarUrl
  };
}

async function updateCalendarEvent(interviewData: any, calendarType: string) {
  // Similar to create but for updating existing events
  console.log(`Updating ${calendarType} calendar event:`, interviewData);
  return { event_id: interviewData.event_id, updated: true };
}

async function deleteCalendarEvent(interviewData: any, calendarType: string) {
  // Implementation for deleting calendar events
  console.log(`Deleting ${calendarType} calendar event:`, interviewData);
  return { event_id: interviewData.event_id, deleted: true };
}

function generateGoogleCalendarUrl(eventData: any) {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const startDate = new Date(eventData.start.dateTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDate = new Date(eventData.end.dateTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  const params = new URLSearchParams({
    text: eventData.summary,
    dates: `${startDate}/${endDate}`,
    details: eventData.description || '',
    location: 'Online',
    sf: 'true',
    output: 'xml'
  });
  
  return `${baseUrl}&${params.toString()}`;
}

function generateOutlookCalendarUrl(eventData: any) {
  const baseUrl = 'https://outlook.office.com/calendar/0/deeplink/compose';
  const startDate = new Date(eventData.start.dateTime).toISOString();
  const endDate = new Date(eventData.end.dateTime).toISOString();
  
  const params = new URLSearchParams({
    subject: eventData.subject,
    startdt: startDate,
    enddt: endDate,
    body: eventData.body.content || '',
    location: 'Online'
  });
  
  return `${baseUrl}?${params.toString()}`;
}
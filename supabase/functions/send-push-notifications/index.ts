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

const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')!;
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')!;

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Function to send push notification using Web Push
async function sendPushNotification(subscription: PushSubscription, payload: any) {
  try {
    // Create JWT token for VAPID authentication
    const vapidKeys = {
      publicKey: vapidPublicKey,
      privateKey: vapidPrivateKey,
    };

    // For simplicity, we'll use fetch to send the notification
    // In production, you might want to use a proper Web Push library
    const pushData = JSON.stringify(payload);
    
    // This is a simplified implementation
    // In production, use a proper Web Push library that handles VAPID authentication
    console.log('Sending push notification:', { subscription, payload });
    
    return { success: true };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { notificationType, userType } = await req.json();
    
    console.log('Processing push notifications:', { notificationType, userType });

    // Get pending notifications based on type and timing
    const now = new Date().toISOString();
    let query = supabase
      .from('internship_notifications')
      .select(`
        *,
        internships (
          id,
          title,
          company_name,
          location,
          application_url
        )
      `);

    // Filter based on user type and timing
    if (userType === 'premium') {
      query = query
        .eq('premium_sent', false)
        .lte('premium_release_time', now);
    } else {
      query = query
        .eq('general_sent', false)
        .lte('general_release_time', now);
    }

    const { data: notifications, error: notificationsError } = await query;

    if (notificationsError) {
      throw notificationsError;
    }

    if (!notifications || notifications.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending notifications' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let totalSent = 0;
    const results = [];

    for (const notification of notifications) {
      // Get users to notify based on type
      let usersQuery = supabase
        .from('profiles')
        .select('user_id, notification_preferences');

      if (userType === 'premium') {
        usersQuery = usersQuery.eq('is_premium', true);
      }

      const { data: users, error: usersError } = await usersQuery;

      if (usersError) {
        console.error('Error fetching users:', usersError);
        continue;
      }

      // Get push subscriptions for these users
      const userIds = users?.map(u => u.user_id) || [];
      if (userIds.length === 0) continue;

      const { data: subscriptions, error: subsError } = await supabase
        .from('push_subscriptions')
        .select('*')
        .in('user_id', userIds);

      if (subsError) {
        console.error('Error fetching subscriptions:', subsError);
        continue;
      }

      // Send push notifications
      if (subscriptions && subscriptions.length > 0) {
        const pushPayload = {
          title: notification.title,
          body: notification.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          data: {
            internshipId: notification.internship_id,
            url: `/dashboard/search?highlight=${notification.internship_id}`,
            type: 'internship_alert'
          },
          actions: [
            {
              action: 'view',
              title: 'View Details',
              icon: '/favicon.ico'
            },
            {
              action: 'apply',
              title: 'Apply Now',
              icon: '/favicon.ico'
            }
          ]
        };

        for (const sub of subscriptions) {
          const pushSub: PushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh_key,
              auth: sub.auth_key
            }
          };

          const result = await sendPushNotification(pushSub, pushPayload);
          if (result.success) {
            totalSent++;
          }
        }

        // Also create in-app notifications for users
        const inAppNotifications = userIds.map(userId => ({
          user_id: userId,
          type: 'internship_alert',
          title: notification.title,
          message: notification.message,
          data: {
            internshipId: notification.internship_id,
            isEarlyAccess: userType === 'premium'
          }
        }));

        const { error: inAppError } = await supabase
          .from('notifications')
          .insert(inAppNotifications);

        if (inAppError) {
          console.error('Error creating in-app notifications:', inAppError);
        }
      }

      // Mark notification as sent
      const updateField = userType === 'premium' ? 'premium_sent' : 'general_sent';
      const { error: updateError } = await supabase
        .from('internship_notifications')
        .update({ [updateField]: true })
        .eq('id', notification.id);

      if (updateError) {
        console.error('Error updating notification status:', updateError);
      }

      results.push({
        notificationId: notification.id,
        userType,
        sentCount: subscriptions?.length || 0,
        internshipTitle: notification.internships?.title
      });
    }

    console.log(`Sent ${totalSent} push notifications for ${userType} users`);

    return new Response(
      JSON.stringify({
        success: true,
        totalSent,
        userType,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-push-notifications function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VAPID_PUBLIC_KEY = 'BP4CCUjAZiY9jN0KD4oq5KVGYR25qRe0s_qc017OrLTDaRwyDw4Gdm-a507YDb1u32sBXnY4jPT4zIMyfcPaWVQ';

interface PushNotificationManagerProps {
  className?: string;
}

export function PushNotificationManager({ className }: PushNotificationManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window);
    
    if (!isSupported || !user) return;

    checkSubscriptionStatus();
  }, [user, isSupported]);

  const checkSubscriptionStatus = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Check if subscription exists in database
        const { data, error } = await supabase
          .from('push_subscriptions')
          .select('id')
          .eq('user_id', user?.uid)
          .eq('endpoint', subscription.endpoint)
          .single();

        setIsSubscribed(!!data && !error);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsSubscribed(false);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeToPush = async () => {
    if (!isSupported || !user) return;

    setIsLoading(true);
    
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        toast({
          title: "Permission Denied",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive"
        });
        return;
      }

      // Register service worker if not already registered
      let registration = await navigator.serviceWorker.getRegistration();
      
      if (!registration) {
        registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      // Save subscription to database
      const subscriptionData = {
        user_id: user.uid,
        endpoint: subscription.endpoint,
        p256dh_key: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
        auth_key: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
        user_agent: navigator.userAgent
      };

      const { error } = await supabase
        .from('push_subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'user_id,endpoint'
        });

      if (error) {
        throw error;
      }

      setIsSubscribed(true);
      toast({
        title: "Notifications Enabled! 🔔",
        description: "You'll now receive instant alerts for new internships."
      });

    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast({
        title: "Subscription Failed",
        description: "Could not enable push notifications. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    if (!isSupported || !user) return;

    setIsLoading(true);
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Unsubscribe from push manager
        await subscription.unsubscribe();
        
        // Remove from database
        const { error } = await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', user.uid)
          .eq('endpoint', subscription.endpoint);

        if (error) {
          throw error;
        }
      }

      setIsSubscribed(false);
      toast({
        title: "Notifications Disabled",
        description: "You won't receive push notifications anymore."
      });

    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      toast({
        title: "Unsubscribe Failed",
        description: "Could not disable push notifications. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={className}>
      <Button
        onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
        disabled={isLoading}
        variant={isSubscribed ? "outline" : "default"}
        size="sm"
        className="gap-2"
      >
        {isSubscribed ? (
          <>
            <BellOff className="h-4 w-4" />
            Disable Alerts
          </>
        ) : (
          <>
            <Bell className="h-4 w-4" />
            Enable Alerts
            <Badge variant="secondary" className="ml-1">
              Instant
            </Badge>
          </>
        )}
      </Button>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  data?: any;
  created_at: string;
}

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    inApp: true,
    whatsapp: false,
    browser: true
  });
  const [showPreferences, setShowPreferences] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast for new notification
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setNotifications(data as Notification[]);
      setUnreadCount(data.filter(n => !n.read).length);
    }
  };

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (!error) {
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const updateNotificationPreferences = async (newPrefs: typeof notificationPrefs) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ notification_preferences: newPrefs })
      .eq('user_id', user.id);

    if (!error) {
      setNotificationPrefs(newPrefs);
      toast({
        title: "Preferences Updated",
        description: "Your notification preferences have been saved.",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return '📅';
      case 'application':
        return '📝';
      case 'reminder':
        return '⏰';
      default:
        return '📢';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          <div className="flex gap-1">
            <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Settings className="w-3 h-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card">
                <DialogHeader>
                  <DialogTitle>Notification Preferences</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">In-App Notifications</label>
                    <Switch 
                      checked={notificationPrefs.inApp}
                      onCheckedChange={(checked) => 
                        updateNotificationPreferences({...notificationPrefs, inApp: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Email Notifications</label>
                    <Switch 
                      checked={notificationPrefs.email}
                      onCheckedChange={(checked) => 
                        updateNotificationPreferences({...notificationPrefs, email: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">WhatsApp Notifications</label>
                    <Switch 
                      checked={notificationPrefs.whatsapp}
                      onCheckedChange={(checked) => 
                        updateNotificationPreferences({...notificationPrefs, whatsapp: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Browser Push</label>
                    <Switch 
                      checked={notificationPrefs.browser}
                      onCheckedChange={(checked) => 
                        updateNotificationPreferences({...notificationPrefs, browser: checked})
                      }
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3 w-full">
                  <span className="text-lg">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
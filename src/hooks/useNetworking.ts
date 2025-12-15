import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NetworkingChannel {
  id: string;
  name: string;
  description: string | null;
  channel_type: 'discussion' | 'qa' | 'mentor' | 'private';
  is_premium_only: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  participant_limit: number | null;
  tags: string[] | null;
  metadata: any;
  participant_count?: number;
  unread_count?: number;
}

export interface ChannelMessage {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  message_type: 'text' | 'file' | 'image' | 'video_call_invite';
  reply_to_id: string | null;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  is_deleted: boolean;
  metadata: any;
  user?: {
    full_name: string;
    email: string;
  };
}

export interface VideoCallSession {
  id: string;
  channel_id: string;
  host_id: string;
  title: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  max_participants: number;
  meeting_url: string | null;
  recording_url: string | null;
  created_at: string;
  metadata: any;
}

export const useNetworking = () => {
  const [channels, setChannels] = useState<NetworkingChannel[]>([]);
  const [activeChannel, setActiveChannel] = useState<NetworkingChannel | null>(null);
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const { toast } = useToast();

  // Fetch all accessible channels
  const fetchChannels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('networking_channels')
        .select(`
          id,
          name,
          description,
          channel_type,
          is_premium_only,
          created_by,
          created_at,
          updated_at,
          is_active,
          participant_limit,
          tags,
          metadata
        `)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Get participant counts separately
      const channelsWithCounts = await Promise.all(
        (data || []).map(async (channel) => {
          const { count } = await supabase
            .from('channel_participants')
            .select('*', { count: 'exact' })
            .eq('channel_id', channel.id);
          
          return {
            ...channel,
            participant_count: count || 0
          } as NetworkingChannel;
        })
      );

      setChannels(channelsWithCounts);
    } catch (error: any) {
      console.error('Error fetching channels:', error);
      toast({
        title: "Error",
        description: "Failed to load channels",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific channel
  const fetchMessages = async (channelId: string) => {
    try {
      setMessagesLoading(true);
      
      // First, ensure user is a participant of the channel
      await joinChannel(channelId);

      const { data, error } = await supabase
        .from('channel_messages')
        .select(`
          id,
          channel_id,
          user_id,
          content,
          message_type,
          reply_to_id,
          created_at,
          updated_at,
          is_edited,
          is_deleted,
          metadata
        `)
        .eq('channel_id', channelId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get user profiles separately to avoid relation issues
      const messagesWithUser = await Promise.all(
        (data || []).map(async (msg) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', msg.user_id)
            .single();
          
          return {
            ...msg,
            user: profile
          } as ChannelMessage;
        })
      );

      setMessages(messagesWithUser);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setMessagesLoading(false);
    }
  };

  // Create a new channel
  const createChannel = async (channelData: {
    name: string;
    description?: string;
    channel_type: 'discussion' | 'qa' | 'mentor' | 'private';
    is_premium_only?: boolean;
    tags?: string[];
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('networking_channels')
        .insert({
          ...channelData,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-join the creator as admin
      await supabase
        .from('channel_participants')
        .insert({
          channel_id: data.id,
          user_id: user.id,
          role: 'admin'
        });

      toast({
        title: "Success",
        description: "Channel created successfully",
      });

      await fetchChannels();
      return data;
    } catch (error: any) {
      console.error('Error creating channel:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create channel",
        variant: "destructive"
      });
      return null;
    }
  };

  // Join a channel
  const joinChannel = async (channelId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('channel_participants')
        .upsert({
          channel_id: channelId,
          user_id: user.id,
          role: 'member'
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Error joining channel:', error);
      return false;
    }
  };

  // Send a message to a channel
  const sendMessage = async (channelId: string, content: string, messageType: 'text' | 'file' | 'image' = 'text') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('channel_messages')
        .insert({
          channel_id: channelId,
          user_id: user.id,
          content,
          message_type: messageType
        });

      if (error) throw error;

      // Update channel's updated_at timestamp
      await supabase
        .from('networking_channels')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', channelId);

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  // Report content for moderation
  const reportContent = async (contentType: 'message' | 'channel' | 'user', contentId: string, reason: string, description?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('moderation_reports')
        .insert({
          reporter_id: user.id,
          reported_content_type: contentType,
          reported_content_id: contentId,
          reason,
          description
        });

      if (error) throw error;

      toast({
        title: "Report Submitted",
        description: "Thank you for reporting. We'll review it soon.",
      });

    } catch (error: any) {
      console.error('Error reporting content:', error);
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive"
      });
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    const channelsSubscription = supabase
      .channel('networking-channels-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'networking_channels' },
        () => {
          fetchChannels();
        }
      )
      .subscribe();

    if (activeChannel) {
      const messagesSubscription = supabase
        .channel(`channel-${activeChannel.id}-messages`)
        .on('postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'channel_messages',
            filter: `channel_id=eq.${activeChannel.id}`
          },
          () => {
            fetchMessages(activeChannel.id);
          }
        )
        .subscribe();

      return () => {
        channelsSubscription.unsubscribe();
        messagesSubscription.unsubscribe();
      };
    }

    return () => {
      channelsSubscription.unsubscribe();
    };
  }, [activeChannel]);

  // Initial load
  useEffect(() => {
    fetchChannels();
  }, []);

  return {
    channels,
    activeChannel,
    setActiveChannel,
    messages,
    loading,
    messagesLoading,
    createChannel,
    joinChannel,
    sendMessage,
    reportContent,
    fetchMessages,
    refetch: fetchChannels
  };
};
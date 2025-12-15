-- Create networking channels table for discussion boards and Q&A
CREATE TABLE public.networking_channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  channel_type TEXT NOT NULL CHECK (channel_type IN ('discussion', 'qa', 'mentor', 'private')),
  is_premium_only BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  participant_limit INTEGER DEFAULT NULL,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create channel messages table
CREATE TABLE public.channel_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES public.networking_channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'video_call_invite')),
  reply_to_id UUID REFERENCES public.channel_messages(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create channel participants table
CREATE TABLE public.channel_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES public.networking_channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_muted BOOLEAN DEFAULT false,
  UNIQUE(channel_id, user_id)
);

-- Create moderation reports table
CREATE TABLE public.moderation_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL,
  reported_content_type TEXT NOT NULL CHECK (reported_content_type IN ('message', 'channel', 'user')),
  reported_content_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create video call sessions for premium mentor feature
CREATE TABLE public.video_call_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES public.networking_channels(id) ON DELETE CASCADE,
  host_id UUID NOT NULL,
  title TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  max_participants INTEGER DEFAULT 10,
  meeting_url TEXT,
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE public.networking_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_call_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for networking_channels
CREATE POLICY "Users can view active channels" 
ON public.networking_channels 
FOR SELECT 
USING (is_active = true AND (
  NOT is_premium_only OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_premium = true)
));

CREATE POLICY "Authenticated users can create channels" 
ON public.networking_channels 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Channel creators can update their channels" 
ON public.networking_channels 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Create policies for channel_messages
CREATE POLICY "Users can view messages in channels they participate in" 
ON public.channel_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.channel_participants 
    WHERE channel_id = channel_messages.channel_id 
    AND user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.networking_channels 
    WHERE id = channel_messages.channel_id 
    AND NOT is_premium_only
  )
);

CREATE POLICY "Users can create messages in channels they participate in" 
ON public.channel_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.channel_participants 
    WHERE channel_id = channel_messages.channel_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own messages" 
ON public.channel_messages 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for channel_participants
CREATE POLICY "Users can view participants in channels they participate in" 
ON public.channel_participants 
FOR SELECT 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.channel_participants cp 
    WHERE cp.channel_id = channel_participants.channel_id 
    AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can join channels" 
ON public.channel_participants 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation" 
ON public.channel_participants 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for moderation_reports
CREATE POLICY "Users can create reports" 
ON public.moderation_reports 
FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" 
ON public.moderation_reports 
FOR SELECT 
USING (auth.uid() = reporter_id);

-- Create policies for video_call_sessions
CREATE POLICY "Users can view video calls in channels they participate in" 
ON public.video_call_sessions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.channel_participants 
    WHERE channel_id = video_call_sessions.channel_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Premium users can create video calls in mentor channels" 
ON public.video_call_sessions 
FOR INSERT 
WITH CHECK (
  auth.uid() = host_id AND
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_premium = true) AND
  EXISTS (
    SELECT 1 FROM public.networking_channels 
    WHERE id = video_call_sessions.channel_id 
    AND channel_type = 'mentor'
  )
);

-- Create indexes for better performance
CREATE INDEX idx_networking_channels_type ON public.networking_channels(channel_type);
CREATE INDEX idx_networking_channels_premium ON public.networking_channels(is_premium_only);
CREATE INDEX idx_channel_messages_channel_id ON public.channel_messages(channel_id);
CREATE INDEX idx_channel_messages_created_at ON public.channel_messages(created_at DESC);
CREATE INDEX idx_channel_participants_channel_id ON public.channel_participants(channel_id);
CREATE INDEX idx_channel_participants_user_id ON public.channel_participants(user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_networking_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_networking_channels_updated_at
BEFORE UPDATE ON public.networking_channels
FOR EACH ROW
EXECUTE FUNCTION public.update_networking_updated_at_column();

CREATE TRIGGER update_channel_messages_updated_at
BEFORE UPDATE ON public.channel_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_networking_updated_at_column();

CREATE TRIGGER update_video_call_sessions_updated_at
BEFORE UPDATE ON public.video_call_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_networking_updated_at_column();
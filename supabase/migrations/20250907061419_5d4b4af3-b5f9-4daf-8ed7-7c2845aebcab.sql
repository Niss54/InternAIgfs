-- Create push subscriptions table for storing user notification subscriptions
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own push subscriptions" 
ON public.push_subscriptions 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create internship notifications table for scheduled notifications
CREATE TABLE public.internship_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL DEFAULT 'new_internship',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  premium_release_time TIMESTAMP WITH TIME ZONE NOT NULL,
  general_release_time TIMESTAMP WITH TIME ZONE NOT NULL,
  premium_sent BOOLEAN DEFAULT FALSE,
  general_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.internship_notifications ENABLE ROW LEVEL SECURITY;

-- Admin only access policy
CREATE POLICY "Only system can manage internship notifications" 
ON public.internship_notifications 
FOR ALL 
USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_push_subscriptions_updated_at
BEFORE UPDATE ON public.push_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_internship_notifications_updated_at
BEFORE UPDATE ON public.internship_notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create notifications when internships are added
CREATE OR REPLACE FUNCTION public.create_internship_notification()
RETURNS TRIGGER AS $$
DECLARE
  premium_time TIMESTAMP WITH TIME ZONE;
  general_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate release times (premium gets 30 min early access)
  premium_time := NEW.created_at;
  general_time := NEW.created_at + INTERVAL '30 minutes';
  
  -- Create notification entry
  INSERT INTO public.internship_notifications (
    internship_id,
    notification_type,
    title,
    message,
    premium_release_time,
    general_release_time
  ) VALUES (
    NEW.id,
    'new_internship',
    '🚀 New Internship Alert',
    'New ' || NEW.title || ' internship at ' || NEW.company_name || ' is now available!',
    premium_time,
    general_time
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new internships
CREATE TRIGGER on_internship_created
  AFTER INSERT ON public.internships
  FOR EACH ROW 
  EXECUTE FUNCTION public.create_internship_notification();
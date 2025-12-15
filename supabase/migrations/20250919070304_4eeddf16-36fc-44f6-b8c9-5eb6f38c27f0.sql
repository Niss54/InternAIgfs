-- Create alumni_stories table
CREATE TABLE public.alumni_stories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  author_name text NOT NULL,
  author_avatar text,
  author_current_company text NOT NULL,
  author_current_role text NOT NULL,
  author_location text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  journey_timeline jsonb DEFAULT '[]'::jsonb,
  skills_gained text[] DEFAULT '{}',
  advice_tags text[] DEFAULT '{}',
  story_type text NOT NULL CHECK (story_type IN ('career_transition', 'first_job', 'startup_journey', 'skill_development')),
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_verified_alumni boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create story_interactions table
CREATE TABLE public.story_interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id uuid NOT NULL REFERENCES public.alumni_stories(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  interaction_type text NOT NULL CHECK (interaction_type IN ('like', 'comment', 'share')),
  content text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(story_id, user_id, interaction_type)
);

-- Create mentors table
CREATE TABLE public.mentors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  avatar_url text,
  title text NOT NULL,
  company text NOT NULL,
  experience_years integer NOT NULL,
  hourly_rate integer NOT NULL,
  rating numeric DEFAULT 5.0,
  total_sessions integer DEFAULT 0,
  specialties text[] NOT NULL,
  bio text NOT NULL,
  linkedin_url text,
  availability_hours jsonb DEFAULT '{}',
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create mentor_sessions table
CREATE TABLE public.mentor_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id uuid NOT NULL REFERENCES public.mentors(id),
  student_id uuid NOT NULL REFERENCES auth.users(id),
  payment_id uuid REFERENCES public.payments(id),
  scheduled_at timestamp with time zone NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  amount integer NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  meeting_link text,
  session_notes text,
  student_rating integer CHECK (student_rating >= 1 AND student_rating <= 5),
  mentor_rating integer CHECK (mentor_rating >= 1 AND mentor_rating <= 5),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.alumni_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alumni_stories
CREATE POLICY "Anyone can view active alumni stories" ON public.alumni_stories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create their own stories" ON public.alumni_stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stories" ON public.alumni_stories
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for story_interactions
CREATE POLICY "Users can view all story interactions" ON public.story_interactions
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own interactions" ON public.story_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions" ON public.story_interactions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for mentors
CREATE POLICY "Anyone can view active mentors" ON public.mentors
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create their own mentor profile" ON public.mentors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mentor profile" ON public.mentors
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for mentor_sessions
CREATE POLICY "Users can view their own sessions" ON public.mentor_sessions
  FOR SELECT USING (auth.uid() = student_id OR auth.uid() IN (SELECT user_id FROM mentors WHERE id = mentor_id));

CREATE POLICY "Students can create sessions" ON public.mentor_sessions
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update their own sessions" ON public.mentor_sessions
  FOR UPDATE USING (auth.uid() = student_id OR auth.uid() IN (SELECT user_id FROM mentors WHERE id = mentor_id));

-- Add triggers for updated_at
CREATE TRIGGER update_alumni_stories_updated_at
  BEFORE UPDATE ON public.alumni_stories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentors_updated_at
  BEFORE UPDATE ON public.mentors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentor_sessions_updated_at
  BEFORE UPDATE ON public.mentor_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
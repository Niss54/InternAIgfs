-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  location_preference TEXT,
  role_preference TEXT,
  expected_stipend INTEGER,
  skills TEXT[],
  resume_url TEXT,
  bio TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create internships table
CREATE TABLE public.internships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  location TEXT,
  remote_allowed BOOLEAN DEFAULT false,
  stipend_min INTEGER,
  stipend_max INTEGER,
  duration_months INTEGER,
  description TEXT,
  requirements TEXT[],
  skills_required TEXT[],
  application_url TEXT,
  posted_date DATE,
  deadline_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table to track user applications
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'reviewing', 'interview_scheduled', 'rejected', 'accepted')),
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  interview_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  UNIQUE(user_id, internship_id)
);

-- Create interviews table for tracking interviews
CREATE TABLE public.interviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  interview_date TIMESTAMP WITH TIME ZONE NOT NULL,
  interview_type TEXT DEFAULT 'technical' CHECK (interview_type IN ('hr', 'technical', 'final', 'group')),
  meeting_link TEXT,
  interviewer_name TEXT,
  interviewer_email TEXT,
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for internships (public read)
CREATE POLICY "Anyone can view active internships" 
ON public.internships FOR SELECT 
USING (is_active = true);

-- Admin policy for managing internships (you can create admin users later)
CREATE POLICY "Authenticated users can insert internships" 
ON public.internships FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- RLS Policies for applications
CREATE POLICY "Users can view their own applications" 
ON public.applications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications" 
ON public.applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.applications FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for interviews
CREATE POLICY "Users can view interviews for their applications" 
ON public.interviews FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.applications 
    WHERE applications.id = interviews.application_id 
    AND applications.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_internships_updated_at
  BEFORE UPDATE ON public.internships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_internships_active ON public.internships(is_active);
CREATE INDEX idx_internships_location ON public.internships(location);
CREATE INDEX idx_internships_skills ON public.internships USING GIN(skills_required);
CREATE INDEX idx_applications_user_id ON public.applications(user_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_interviews_date ON public.interviews(interview_date);
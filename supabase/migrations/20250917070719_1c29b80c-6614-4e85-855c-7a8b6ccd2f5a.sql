-- Create daily recommendations table for AI Internship Matcher Pro
CREATE TABLE IF NOT EXISTS public.daily_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  internship_id UUID NOT NULL,
  match_score INTEGER NOT NULL,
  recommendation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reasons TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skill gap analysis table
CREATE TABLE IF NOT EXISTS public.skill_gap_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_skills TEXT[] NOT NULL DEFAULT '{}',
  market_skills TEXT[] NOT NULL DEFAULT '{}',
  gap_skills TEXT[] NOT NULL DEFAULT '{}',
  recommendations TEXT[] NOT NULL DEFAULT '{}',
  analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interview simulations table
CREATE TABLE IF NOT EXISTS public.interview_simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_type TEXT NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]',
  answers JSONB NOT NULL DEFAULT '[]',
  feedback JSONB NOT NULL DEFAULT '{}',
  score INTEGER,
  duration_minutes INTEGER,
  simulation_type TEXT NOT NULL DEFAULT 'technical', -- technical, behavioral, final
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resume customizations table for AI Resume Tailor
CREATE TABLE IF NOT EXISTS public.resume_customizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  internship_id UUID NOT NULL,
  customized_content JSONB NOT NULL DEFAULT '{}',
  cover_letter TEXT,
  linkedin_summary TEXT,
  template_id TEXT NOT NULL DEFAULT 'modern',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gap_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_customizations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own daily recommendations" 
ON public.daily_recommendations FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own daily recommendations" 
ON public.daily_recommendations FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own skill analysis" 
ON public.skill_gap_analysis FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own skill analysis" 
ON public.skill_gap_analysis FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own skill analysis" 
ON public.skill_gap_analysis FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can view their own interview simulations" 
ON public.interview_simulations FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own interview simulations" 
ON public.interview_simulations FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own interview simulations" 
ON public.interview_simulations FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can view their own resume customizations" 
ON public.resume_customizations FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own resume customizations" 
ON public.resume_customizations FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own resume customizations" 
ON public.resume_customizations FOR UPDATE 
USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_recommendations_user_date ON public.daily_recommendations(user_id, recommendation_date);
CREATE INDEX IF NOT EXISTS idx_skill_gap_user_date ON public.skill_gap_analysis(user_id, analysis_date);
CREATE INDEX IF NOT EXISTS idx_interview_simulations_user ON public.interview_simulations(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_customizations_user ON public.resume_customizations(user_id);
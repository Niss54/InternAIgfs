-- Create skill_certifications table
CREATE TABLE public.skill_certifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes integer NOT NULL,
  price integer NOT NULL,
  mcq_questions jsonb DEFAULT '[]'::jsonb,
  coding_challenges jsonb DEFAULT '[]'::jsonb,
  skills_tested text[] DEFAULT '{}',
  certificate_template text NOT NULL DEFAULT 'standard',
  pass_percentage integer NOT NULL DEFAULT 70,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create guarantee_packs table
CREATE TABLE public.guarantee_packs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  duration_months integer NOT NULL,
  features text[] NOT NULL,
  application_limit integer NOT NULL,
  guarantee_details text NOT NULL,
  success_rate_percentage integer DEFAULT 90,
  total_enrollments integer DEFAULT 0,
  testimonials jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create upsell_service_orders table  
CREATE TABLE public.upsell_service_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  service_id uuid NOT NULL REFERENCES public.upsell_services(id),
  payment_id uuid REFERENCES public.payments(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  requirements text,
  delivered_files jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.skill_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guarantee_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upsell_service_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skill_certifications
CREATE POLICY "Anyone can view active certifications" ON public.skill_certifications
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage certifications" ON public.skill_certifications
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for guarantee_packs
CREATE POLICY "Anyone can view active guarantee packs" ON public.guarantee_packs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage guarantee packs" ON public.guarantee_packs
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for upsell_service_orders
CREATE POLICY "Users can view their own service orders" ON public.upsell_service_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own service orders" ON public.upsell_service_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own service orders" ON public.upsell_service_orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_skill_certifications_updated_at
  BEFORE UPDATE ON public.skill_certifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guarantee_packs_updated_at
  BEFORE UPDATE ON public.guarantee_packs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_upsell_service_orders_updated_at
  BEFORE UPDATE ON public.upsell_service_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
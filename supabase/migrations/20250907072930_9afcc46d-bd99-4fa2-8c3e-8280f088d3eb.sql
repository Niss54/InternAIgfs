-- Create referrals table for tracking referral relationships
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id uuid NOT NULL,
  referee_id uuid NOT NULL,
  referral_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reward_claimed boolean DEFAULT false,
  referrer_reward_claimed boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  UNIQUE(referee_id),
  UNIQUE(referral_code)
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Create policies for referrals
CREATE POLICY "Users can view referrals they're involved in" 
ON public.referrals 
FOR SELECT 
USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

CREATE POLICY "Users can create referrals" 
ON public.referrals 
FOR INSERT 
WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Users can update their referrals" 
ON public.referrals 
FOR UPDATE 
USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

-- Add referral_code to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by text;

-- Create function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  code text;
  exists_check boolean;
BEGIN
  LOOP
    -- Generate a random 8-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists_check;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Create function to handle referral signup
CREATE OR REPLACE FUNCTION public.handle_referral_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  referrer_user_id uuid;
  new_referral_code text;
BEGIN
  -- Generate referral code for new user
  new_referral_code := public.generate_referral_code();
  
  -- Update the profile with referral code
  UPDATE public.profiles 
  SET referral_code = new_referral_code
  WHERE user_id = NEW.user_id;
  
  -- If user was referred by someone
  IF NEW.referred_by IS NOT NULL AND NEW.referred_by != '' THEN
    -- Find the referrer
    SELECT user_id INTO referrer_user_id 
    FROM public.profiles 
    WHERE referral_code = NEW.referred_by;
    
    IF referrer_user_id IS NOT NULL THEN
      -- Create referral record
      INSERT INTO public.referrals (referrer_id, referee_id, referral_code, status)
      VALUES (referrer_user_id, NEW.user_id, NEW.referred_by, 'completed');
      
      -- Award referee reward (3 day premium trial + 50 AI tokens)
      INSERT INTO public.user_rewards (user_id, reward_type, reward_value, description, metadata)
      VALUES (
        NEW.user_id, 
        'premium_trial', 
        3, 
        'Welcome bonus: 3-day premium trial for joining via referral',
        '{"referral_bonus": true, "referrer_id": "' || referrer_user_id || '"}'::jsonb
      );
      
      INSERT INTO public.user_rewards (user_id, reward_type, reward_value, description, metadata)
      VALUES (
        NEW.user_id, 
        'ai_tokens', 
        50, 
        'Welcome bonus: 50 AI tokens for joining via referral',
        '{"referral_bonus": true, "referrer_id": "' || referrer_user_id || '"}'::jsonb
      );
      
      -- Award referrer reward (5 day premium trial + 100 AI tokens)
      INSERT INTO public.user_rewards (user_id, reward_type, reward_value, description, metadata)
      VALUES (
        referrer_user_id, 
        'premium_trial', 
        5, 
        'Referral bonus: 5-day premium trial for successful referral',
        '{"referral_reward": true, "referee_id": "' || NEW.user_id || '"}'::jsonb
      );
      
      INSERT INTO public.user_rewards (user_id, reward_type, reward_value, description, metadata)
      VALUES (
        referrer_user_id, 
        'ai_tokens', 
        100, 
        'Referral bonus: 100 AI tokens for successful referral',
        '{"referral_reward": true, "referee_id": "' || NEW.user_id || '"}'::jsonb
      );
      
      -- Update referral as rewarded
      UPDATE public.referrals 
      SET reward_claimed = true, 
          referrer_reward_claimed = true,
          completed_at = now()
      WHERE referrer_id = referrer_user_id AND referee_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user referral handling
DROP TRIGGER IF EXISTS on_profile_referral_signup ON public.profiles;
CREATE TRIGGER on_profile_referral_signup
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_referral_signup();

-- Create function to get referral stats
CREATE OR REPLACE FUNCTION public.get_referral_stats(user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stats jsonb;
  total_referrals integer;
  successful_referrals integer;
  pending_referrals integer;
  total_rewards integer;
  referral_code_val text;
BEGIN
  -- Get user's referral code
  SELECT referral_code INTO referral_code_val 
  FROM public.profiles 
  WHERE user_id = user_id_param;
  
  -- Count referrals
  SELECT 
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE status = 'completed') as successful,
    COUNT(*) FILTER (WHERE status = 'pending') as pending
  INTO total_referrals, successful_referrals, pending_referrals
  FROM public.referrals 
  WHERE referrer_id = user_id_param;
  
  -- Count rewards from referrals
  SELECT COALESCE(SUM(reward_value), 0)
  INTO total_rewards
  FROM public.user_rewards
  WHERE user_id = user_id_param 
  AND (metadata->>'referral_reward' = 'true' OR metadata->>'referral_bonus' = 'true');
  
  stats := jsonb_build_object(
    'referral_code', referral_code_val,
    'total_referrals', total_referrals,
    'successful_referrals', successful_referrals,
    'pending_referrals', pending_referrals,
    'total_rewards', total_rewards
  );
  
  RETURN stats;
END;
$$;
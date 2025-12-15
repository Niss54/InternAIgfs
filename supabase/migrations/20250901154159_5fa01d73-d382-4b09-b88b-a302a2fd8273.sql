-- Fix failing trigger on auth.users causing OTP 500 by safely casting raw_user_meta_data to JSONB
-- and making the insert resilient. We only update the function (no changes to reserved schemas).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or do nothing if the profile already exists
  INSERT INTO public.profiles (
    user_id,
    full_name,
    email,
    role_preference,
    location_preference,
    skills
  )
  VALUES (
    NEW.id,
    COALESCE(
      (NEW.raw_user_meta_data::jsonb ->> 'full_name'),
      CONCAT_WS(' ', NEW.raw_user_meta_data::jsonb ->> 'first_name', NEW.raw_user_meta_data::jsonb ->> 'last_name')
    ),
    NEW.email,
    NEW.raw_user_meta_data::jsonb ->> 'role',
    NEW.raw_user_meta_data::jsonb ->> 'location',
    CASE 
      WHEN (NEW.raw_user_meta_data::jsonb ->> 'skills') IS NOT NULL AND (NEW.raw_user_meta_data::jsonb ->> 'skills') <> ''
      THEN string_to_array(NEW.raw_user_meta_data::jsonb ->> 'skills', ',')
      ELSE NULL
    END
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;
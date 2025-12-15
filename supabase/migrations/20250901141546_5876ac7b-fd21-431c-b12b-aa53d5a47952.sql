-- Create function to handle new user signups (only if it doesn't exist)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'first_name' || ' ' || NEW.raw_user_meta_data ->> 'last_name'),
    NEW.email,
    NEW.raw_user_meta_data ->> 'role',
    NEW.raw_user_meta_data ->> 'location',
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'skills' IS NOT NULL 
      THEN string_to_array(NEW.raw_user_meta_data ->> 'skills', ',')
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-create profile on user signup (only if it doesn't exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
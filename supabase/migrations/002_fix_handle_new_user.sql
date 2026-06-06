-- Run in Supabase SQL Editor if auth user exists but profiles row is missing
-- or if creating users in Dashboard fails with "Database error creating new user".

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, employee_code, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'employee_code', 'EMP-' || LEFT(NEW.id::text, 8)),
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'ADMIN'::public.user_role)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profile for an existing auth user (replace email):
-- INSERT INTO public.profiles (id, employee_code, name, email, role)
-- SELECT id, 'EMP001', 'Surasane', email, 'ADMIN'::public.user_role
-- FROM auth.users WHERE email = 'surasane.tho@gmail.com'
-- ON CONFLICT (id) DO NOTHING;

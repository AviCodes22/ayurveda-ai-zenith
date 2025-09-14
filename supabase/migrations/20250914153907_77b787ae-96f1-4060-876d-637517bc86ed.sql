-- RPC to map unique_id -> email for login
CREATE OR REPLACE FUNCTION public.get_email_by_unique_id(p_unique_id TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_email TEXT;
BEGIN
  SELECT u.email INTO v_email
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.user_id
  WHERE p.unique_id = p_unique_id
  LIMIT 1;
  RETURN v_email;
END;
$$;
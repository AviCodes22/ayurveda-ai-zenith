-- Enable RLS on notifications table (it was missing RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for notifications
CREATE POLICY "Users can manage their own notifications" 
ON public.notifications 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Update existing functions to set search_path
CREATE OR REPLACE FUNCTION public.generate_unique_id(role_type app_role)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  prefix TEXT;
  sequence_num INTEGER;
  unique_id TEXT;
BEGIN
  -- Set prefix based on role
  CASE role_type
    WHEN 'patient' THEN prefix := 'PAT';
    WHEN 'doctor' THEN prefix := 'DOC';
    WHEN 'therapist' THEN prefix := 'THR';
  END CASE;
  
  -- Get next sequence number with fully qualified column name
  SELECT COALESCE(MAX(CAST(SUBSTRING(p.unique_id FROM 4) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.profiles p
  WHERE p.unique_id LIKE prefix || '%';
  
  -- Format with leading zeros
  unique_id := prefix || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN unique_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_email_by_unique_id(p_unique_id text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE v_email TEXT;
BEGIN
  SELECT u.email INTO v_email
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.user_id
  WHERE p.unique_id = p_unique_id
  LIMIT 1;
  RETURN v_email;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql SET search_path TO 'public';
-- Fix the generate_unique_id function to resolve ambiguous column reference
CREATE OR REPLACE FUNCTION public.generate_unique_id(role_type app_role)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  sequence_num INTEGER;
  unique_id TEXT;
BEGIN
  -- Set prefix based on role
  CASE role_type
    WHEN 'patient' THEN prefix := 'PAT';
    WHEN 'doctor' THEN prefix := 'DOC';
    WHEN 'administrator' THEN prefix := 'ADM';
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
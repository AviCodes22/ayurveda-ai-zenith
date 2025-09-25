-- Clean all existing data from tables
DELETE FROM wellness_tracking;
DELETE FROM feedback;
DELETE FROM payments;
DELETE FROM appointments;
DELETE FROM patient_details;
DELETE FROM doctor_verification;
DELETE FROM notification_preferences;
DELETE FROM profiles;
DELETE FROM administrator_workers;

-- Drop administrator_workers table completely
DROP TABLE IF EXISTS administrator_workers;

-- Create therapist table linked to doctors
CREATE TABLE public.therapist_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id TEXT NOT NULL UNIQUE,
  doctor_id UUID NOT NULL,
  therapist_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on therapist_assignments
ALTER TABLE public.therapist_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for therapist_assignments
CREATE POLICY "Doctors can view their assigned therapists" 
ON public.therapist_assignments 
FOR SELECT 
USING (auth.uid() = doctor_id);

CREATE POLICY "Authenticated users can view therapists for registration" 
ON public.therapist_assignments 
FOR SELECT 
USING (true);

-- Insert sample therapist data for testing
INSERT INTO public.therapist_assignments (therapist_id, doctor_id, therapist_name, specialization, is_active)
VALUES ('THR001', '00000000-0000-0000-0000-000000000001'::UUID, 'Sample Therapist', 'Panchakarma Specialist', true);

-- Drop the function first to remove dependency
DROP FUNCTION IF EXISTS public.generate_unique_id(app_role);

-- Update app_role enum to replace administrator with therapist
ALTER TYPE public.app_role RENAME TO app_role_old;
CREATE TYPE public.app_role AS ENUM ('patient', 'doctor', 'therapist');

-- Update profiles table to use new enum
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE public.profiles ALTER COLUMN role TYPE public.app_role USING 
  CASE 
    WHEN role::text = 'administrator' THEN 'therapist'::public.app_role
    ELSE role::text::public.app_role
  END;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'patient'::public.app_role;

-- Drop old enum
DROP TYPE public.app_role_old;

-- Recreate the generate_unique_id function with new enum
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
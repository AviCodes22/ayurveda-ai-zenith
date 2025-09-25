-- Make doctor_id nullable in therapist_assignments to allow standalone therapist records
ALTER TABLE public.therapist_assignments 
ALTER COLUMN doctor_id DROP NOT NULL;

-- Now add therapist THR0002 for registration
INSERT INTO public.therapist_assignments (
  therapist_id,
  therapist_name,
  specialization,
  doctor_id,
  is_active
) VALUES (
  'THR0002',
  'Dr. Sarah Johnson',
  'Ayurvedic Therapy',
  NULL,
  true
);
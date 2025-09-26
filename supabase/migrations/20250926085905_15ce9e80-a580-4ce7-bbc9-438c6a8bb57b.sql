-- Add practitioner_id column to feedback table to link feedback with doctors/therapists
ALTER TABLE public.feedback 
ADD COLUMN practitioner_id UUID;

-- Create index for better query performance
CREATE INDEX idx_feedback_practitioner_id ON public.feedback(practitioner_id);

-- Update RLS policies to allow practitioners to view feedback for their appointments
CREATE POLICY "Practitioners can view feedback for their appointments" 
ON public.feedback 
FOR SELECT 
USING (
  auth.uid() = practitioner_id OR 
  EXISTS (
    SELECT 1 FROM appointments 
    WHERE appointments.id = feedback.appointment_id 
    AND appointments.practitioner_id = auth.uid()
  )
);
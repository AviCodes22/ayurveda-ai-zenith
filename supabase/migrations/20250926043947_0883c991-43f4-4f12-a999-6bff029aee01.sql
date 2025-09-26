-- Allow patients to view doctor and therapist profiles for scheduling
CREATE POLICY "Users can view doctor and therapist profiles" 
ON public.profiles 
FOR SELECT 
USING (role IN ('doctor', 'therapist'));
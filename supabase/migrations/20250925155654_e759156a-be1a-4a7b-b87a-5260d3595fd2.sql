-- Fix duplicate profiles issue for PAT2005
-- Remove the duplicate PAT2004 record (which seems to be a placeholder)
DELETE FROM public.profiles 
WHERE unique_id = 'PAT2004' 
AND user_id = '3f383af1-893a-41bc-bcb6-5ffe85885229';

-- Ensure PAT2005 has the correct information
UPDATE public.profiles 
SET 
  full_name = 'Avdhoot',
  role = 'patient'
WHERE unique_id = 'PAT2005' 
AND user_id = '3f383af1-893a-41bc-bcb6-5ffe85885229';
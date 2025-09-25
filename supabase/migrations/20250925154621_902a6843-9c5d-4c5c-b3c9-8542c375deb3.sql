-- Fix duplicate profile issue for THR0002
-- First, let's see what profiles exist for the user
-- Remove duplicate profiles keeping only the correct one for THR0002
DELETE FROM public.profiles 
WHERE user_id = 'd3b3202a-4b92-497d-969d-dfbd64504d78' 
AND unique_id != 'THR0002';

-- Ensure the remaining profile has the correct data
UPDATE public.profiles 
SET 
  unique_id = 'THR0002',
  role = 'therapist'
WHERE user_id = 'd3b3202a-4b92-497d-969d-dfbd64504d78';
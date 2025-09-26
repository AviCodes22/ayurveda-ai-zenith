-- Clean up duplicate profiles (remove "Unknown User" entries)
DELETE FROM profiles 
WHERE full_name = 'Unknown User' AND user_id IN (
    SELECT user_id 
    FROM profiles 
    GROUP BY user_id 
    HAVING COUNT(*) > 1
);

-- Disable the trigger that creates duplicate profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the problematic function as we're using the register edge function instead
DROP FUNCTION IF EXISTS public.handle_new_user();
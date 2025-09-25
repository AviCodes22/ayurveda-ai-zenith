-- Delete user bassi34@gmail.com and related data
-- First delete from profiles table
DELETE FROM public.profiles WHERE user_id = 'ccc11753-1399-4229-8db8-d82e95c3573f';

-- Delete any related data
DELETE FROM public.patient_details WHERE user_id = 'ccc11753-1399-4229-8db8-d82e95c3573f';
DELETE FROM public.doctor_verification WHERE user_id = 'ccc11753-1399-4229-8db8-d82e95c3573f';
DELETE FROM public.notification_preferences WHERE user_id = 'ccc11753-1399-4229-8db8-d82e95c3573f';
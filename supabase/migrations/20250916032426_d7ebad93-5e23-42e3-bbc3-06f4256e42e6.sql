-- Update payments table to support Razorpay instead of Stripe
ALTER TABLE public.payments 
DROP COLUMN IF EXISTS stripe_payment_intent_id,
ADD COLUMN razorpay_order_id text,
ADD COLUMN razorpay_payment_id text;

-- Add some sample therapies data if the table is empty
INSERT INTO public.therapies (name, description, duration_minutes, price, category, benefits, image_url) VALUES
('Panchakarma Detox', 'Complete detoxification therapy to cleanse the body', 90, 5000.00, 'Detoxification', ARRAY['Deep cleansing', 'Toxin removal', 'Improved immunity'], 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'),
('Abhyanga Massage', 'Full body oil massage with herbal oils', 60, 2500.00, 'Massage Therapy', ARRAY['Stress relief', 'Better circulation', 'Muscle relaxation'], 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'),
('Shirodhara Therapy', 'Continuous pouring of warm oil on forehead', 45, 3000.00, 'Mental Wellness', ARRAY['Mental clarity', 'Stress reduction', 'Better sleep'], 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'),
('Basti Treatment', 'Therapeutic enema with herbal decoctions', 75, 4000.00, 'Cleansing', ARRAY['Digestive health', 'Toxin elimination', 'Colon cleansing'], 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'),
('Nasya Therapy', 'Nasal administration of medicinal oils', 30, 1500.00, 'Respiratory', ARRAY['Sinus relief', 'Better breathing', 'Mental clarity'], 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80')
ON CONFLICT (name) DO NOTHING;

-- Add some sample time slots
INSERT INTO public.time_slots (start_time, end_time, is_available) VALUES
('09:00', '10:00', true),
('10:00', '11:00', true),
('11:00', '12:00', true),
('14:00', '15:00', true),
('15:00', '16:00', true),
('16:00', '17:00', true),
('17:00', '18:00', true)
ON CONFLICT DO NOTHING;
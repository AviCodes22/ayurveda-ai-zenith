-- Add sample appointment data with correct payment_status values
INSERT INTO appointments (
  patient_id,
  practitioner_id, 
  therapy_id,
  time_slot_id,
  appointment_date,
  total_amount,
  status,
  payment_status,
  notes
) VALUES 
-- Appointments with DOC0003 (Doctor)
(
  (SELECT user_id FROM profiles WHERE unique_id = 'PAT2033'),
  (SELECT user_id FROM profiles WHERE unique_id = 'DOC0003'),
  '3fe35e68-2aa5-489a-ba2c-96df8ee5635a', -- Panchakarma Detox
  'e108c2f7-dfb7-4c3e-9508-3086e3ac6cde', -- 09:00-10:30
  CURRENT_DATE + INTERVAL '1 day',
  1500.00,
  'scheduled',
  'pending',
  'Initial consultation for chronic fatigue'
),
(
  (SELECT user_id FROM profiles WHERE unique_id = 'PAT2033'),
  (SELECT user_id FROM profiles WHERE unique_id = 'DOC0003'),
  'ef06623f-2c4d-433b-9060-2119d1331bf2', -- Abhyanga Massage
  'a05b8480-1558-4a18-a644-39679db44262', -- 11:00-12:30
  CURRENT_DATE + INTERVAL '3 days',
  2000.00,
  'confirmed',
  'pending',
  'Follow-up consultation and treatment plan'
),
-- Appointments with THR0001 (Therapist)
(
  (SELECT user_id FROM profiles WHERE unique_id = 'PAT2033'),
  (SELECT user_id FROM profiles WHERE unique_id = 'THR0001'),
  'e171d0d3-a8a8-4be4-9ab6-4044fec96a87', -- Shirodhara Treatment
  '8819211b-0e92-4d4e-948a-daf74f275956', -- 14:00-15:30
  CURRENT_DATE + INTERVAL '2 days',
  1800.00,
  'scheduled',
  'pending',
  'Shirodhara relaxation therapy session'
),
(
  (SELECT user_id FROM profiles WHERE unique_id = 'PAT2033'),
  (SELECT user_id FROM profiles WHERE unique_id = 'THR0001'),
  '1ab8cf5f-7518-4a0e-9475-fec19bde0fa6', -- Basti Therapy
  '0654d3c1-7f06-48d2-8cd5-e207f9e9a919', -- 16:00-17:30
  CURRENT_DATE + INTERVAL '5 days',
  2200.00,
  'confirmed',
  'pending',
  'Basti therapy for digestive wellness'
),
-- More appointments for variety
(
  (SELECT user_id FROM profiles WHERE unique_id = 'PAT2033'),
  (SELECT user_id FROM profiles WHERE unique_id = 'DOC0003'),
  'ef06623f-2c4d-433b-9060-2119d1331bf2', -- Abhyanga Massage
  '9b15f9e4-4894-495e-a06b-898e4441d646', -- 18:00-19:30
  CURRENT_DATE + INTERVAL '7 days',
  1600.00,
  'scheduled',
  'pending',
  'Treatment progress review'
),
(
  (SELECT user_id FROM profiles WHERE unique_id = 'PAT2033'),
  (SELECT user_id FROM profiles WHERE unique_id = 'THR0001'),
  '3fe35e68-2aa5-489a-ba2c-96df8ee5635a', -- Panchakarma Detox
  'a05b8480-1558-4a18-a644-39679db44262', -- 11:00-12:30
  CURRENT_DATE + INTERVAL '10 days',
  1900.00,
  'confirmed',
  'pending',
  'Advanced Panchakarma therapy'
);

-- Add some completed appointments with pending payment status for the PreviousPatients component
INSERT INTO appointments (
  patient_id,
  practitioner_id, 
  therapy_id,
  time_slot_id,
  appointment_date,
  total_amount,
  status,
  payment_status,
  notes
) VALUES 
(
  (SELECT user_id FROM profiles WHERE unique_id = 'PAT2033'),
  (SELECT user_id FROM profiles WHERE unique_id = 'DOC0003'),
  '3fe35e68-2aa5-489a-ba2c-96df8ee5635a', -- Panchakarma Detox
  'e108c2f7-dfb7-4c3e-9508-3086e3ac6cde', -- 09:00-10:30
  CURRENT_DATE - INTERVAL '15 days',
  1500.00,
  'completed',
  'pending',
  'Initial assessment - successful treatment'
),
(
  (SELECT user_id FROM profiles WHERE unique_id = 'PAT2033'),
  (SELECT user_id FROM profiles WHERE unique_id = 'THR0001'),
  'ef06623f-2c4d-433b-9060-2119d1331bf2', -- Abhyanga Massage
  '8819211b-0e92-4d4e-948a-daf74f275956', -- 14:00-15:30
  CURRENT_DATE - INTERVAL '10 days',
  1800.00,
  'completed',
  'pending',
  'Excellent response to massage therapy'
),
(
  (SELECT user_id FROM profiles WHERE unique_id = 'PAT2033'),
  (SELECT user_id FROM profiles WHERE unique_id = 'DOC0003'),
  'e171d0d3-a8a8-4be4-9ab6-4044fec96a87', -- Shirodhara Treatment
  '0654d3c1-7f06-48d2-8cd5-e207f9e9a919', -- 16:00-17:30
  CURRENT_DATE - INTERVAL '8 days',
  2100.00,
  'completed',
  'pending',
  'Stress relief treatment completed successfully'
);
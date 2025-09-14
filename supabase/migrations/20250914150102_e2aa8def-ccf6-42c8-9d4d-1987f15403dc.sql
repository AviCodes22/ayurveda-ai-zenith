-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('patient', 'doctor', 'administrator');

-- Create profiles table for user authentication
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  unique_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  aadhar_number TEXT UNIQUE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patient details table for Panchakarma information
CREATE TABLE public.patient_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  medical_history TEXT,
  current_medications TEXT,
  allergies TEXT,
  body_constitution TEXT, -- Vata, Pitta, Kapha
  pulse_rate INTEGER,
  blood_pressure TEXT,
  dietary_preferences TEXT,
  lifestyle_habits TEXT,
  chief_complaint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctor verification table
CREATE TABLE public.doctor_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ayush_registration_number TEXT UNIQUE NOT NULL,
  specialization TEXT NOT NULL,
  qualification TEXT NOT NULL,
  years_of_experience INTEGER,
  clinic_address TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create administrator workers table for verification
CREATE TABLE public.administrator_workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  position TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample administrator worker IDs
INSERT INTO public.administrator_workers (worker_id, department, position) VALUES
('ADM001', 'IT Administration', 'System Administrator'),
('ADM002', 'Medical Administration', 'Chief Medical Officer'),
('ADM003', 'Operations', 'Operations Manager');

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrator_workers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for patient details
CREATE POLICY "Patients can view their own details" ON public.patient_details
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Patients can update their own details" ON public.patient_details
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Patients can insert their own details" ON public.patient_details
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for doctor verification
CREATE POLICY "Doctors can view their own verification" ON public.doctor_verification
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Doctors can update their own verification" ON public.doctor_verification
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Doctors can insert their own verification" ON public.doctor_verification
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for administrator workers (read-only for verification)
CREATE POLICY "Public can read administrator workers for verification" ON public.administrator_workers
  FOR SELECT USING (true);

-- Create function to generate unique user IDs
CREATE OR REPLACE FUNCTION public.generate_unique_id(role_type app_role)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  sequence_num INTEGER;
  unique_id TEXT;
BEGIN
  -- Set prefix based on role
  CASE role_type
    WHEN 'patient' THEN prefix := 'PAT';
    WHEN 'doctor' THEN prefix := 'DOC';
    WHEN 'administrator' THEN prefix := 'ADM';
  END CASE;
  
  -- Get next sequence number
  SELECT COALESCE(MAX(CAST(SUBSTRING(unique_id FROM 4) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.profiles
  WHERE unique_id LIKE prefix || '%';
  
  -- Format with leading zeros
  unique_id := prefix || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN unique_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_details_updated_at
  BEFORE UPDATE ON public.patient_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctor_verification_updated_at
  BEFORE UPDATE ON public.doctor_verification
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
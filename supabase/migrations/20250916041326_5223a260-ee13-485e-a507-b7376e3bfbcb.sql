-- Create feedback table for patient therapy feedback system
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  appointment_id UUID NOT NULL,
  therapy_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  pain_level_before INTEGER CHECK (pain_level_before >= 1 AND pain_level_before <= 10),
  pain_level_after INTEGER CHECK (pain_level_after >= 1 AND pain_level_after <= 10),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  overall_wellness INTEGER CHECK (overall_wellness >= 1 AND overall_wellness <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  appointment_reminders BOOLEAN DEFAULT true,
  therapy_updates BOOLEAN DEFAULT true,
  system_notifications BOOLEAN DEFAULT true,
  payment_alerts BOOLEAN DEFAULT true,
  wellness_reports BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add language preference to profiles
ALTER TABLE public.profiles 
ADD COLUMN language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'hi'));

-- Create wellness tracking table for scientific progress
CREATE TABLE public.wellness_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  heart_rate INTEGER,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  weight DECIMAL(5,2),
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  energy_score INTEGER CHECK (energy_score >= 1 AND energy_score <= 10),
  pain_score INTEGER CHECK (pain_score >= 1 AND pain_score <= 10),
  sleep_hours DECIMAL(4,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(patient_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for feedback table
CREATE POLICY "Patients can create feedback for their appointments" 
ON public.feedback 
FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can view their own feedback" 
ON public.feedback 
FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view feedback for their appointments" 
ON public.feedback 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM appointments 
  WHERE appointments.id = feedback.appointment_id 
  AND appointments.practitioner_id = auth.uid()
));

-- Create policies for notification preferences
CREATE POLICY "Users can manage their own notification preferences" 
ON public.notification_preferences 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Create policies for wellness tracking
CREATE POLICY "Patients can manage their own wellness data" 
ON public.wellness_tracking 
FOR ALL 
USING (auth.uid() = patient_id) 
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors can view wellness data for their patients" 
ON public.wellness_tracking 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM appointments 
  WHERE appointments.patient_id = wellness_tracking.patient_id 
  AND appointments.practitioner_id = auth.uid()
));

-- Create triggers for updated_at columns
CREATE TRIGGER update_feedback_updated_at
BEFORE UPDATE ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wellness_tracking_updated_at
BEFORE UPDATE ON public.wellness_tracking
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
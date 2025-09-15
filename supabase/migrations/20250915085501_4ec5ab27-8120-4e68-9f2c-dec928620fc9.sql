-- Create therapies table to store therapy types and pricing
CREATE TABLE public.therapies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  benefits TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create time slots table for available appointment times
CREATE TABLE public.time_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table for scheduled appointments
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  practitioner_id UUID,
  therapy_id UUID NOT NULL REFERENCES public.therapies(id),
  appointment_date DATE NOT NULL,
  time_slot_id UUID NOT NULL REFERENCES public.time_slots(id),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled')),
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table for payment records
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id),
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'inr',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled', 'refunded')),
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.therapies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for therapies (public read access)
CREATE POLICY "Anyone can view therapies" 
ON public.therapies 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can manage therapies" 
ON public.therapies 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for time_slots (public read access)
CREATE POLICY "Anyone can view time slots" 
ON public.time_slots 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can manage time slots" 
ON public.time_slots 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for appointments
CREATE POLICY "Users can view their own appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() = patient_id OR auth.uid() = practitioner_id);

CREATE POLICY "Patients can create their own appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() = patient_id OR auth.uid() = practitioner_id);

CREATE POLICY "Users can cancel their own appointments" 
ON public.appointments 
FOR DELETE 
USING (auth.uid() = patient_id OR auth.uid() = practitioner_id);

-- RLS Policies for payments
CREATE POLICY "Users can view payments for their appointments" 
ON public.payments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.appointments 
    WHERE appointments.id = payments.appointment_id 
    AND (appointments.patient_id = auth.uid() OR appointments.practitioner_id = auth.uid())
  )
);

CREATE POLICY "Authenticated users can create payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update payments for their appointments" 
ON public.payments 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.appointments 
    WHERE appointments.id = payments.appointment_id 
    AND (appointments.patient_id = auth.uid() OR appointments.practitioner_id = auth.uid())
  )
);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_therapies_updated_at
BEFORE UPDATE ON public.therapies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample therapies
INSERT INTO public.therapies (name, description, duration_minutes, price, category, benefits) VALUES
('Panchakarma Detox', 'Complete body detoxification using traditional Ayurvedic methods', 90, 2500.00, 'detox', ARRAY['Full body detox', 'Improved metabolism', 'Enhanced immunity']),
('Abhyanga Massage', 'Full body oil massage with herbal oils for relaxation and healing', 60, 1500.00, 'massage', ARRAY['Deep relaxation', 'Improved circulation', 'Stress relief']),
('Shirodhara Treatment', 'Continuous pouring of medicated oil on forehead for mental clarity', 45, 2000.00, 'mental_health', ARRAY['Mental clarity', 'Stress reduction', 'Better sleep']),
('Basti Therapy', 'Medicated enema therapy for digestive and joint health', 75, 1800.00, 'digestive', ARRAY['Digestive health', 'Joint mobility', 'Toxin elimination']);

-- Insert sample time slots
INSERT INTO public.time_slots (start_time, end_time) VALUES
('09:00', '10:30'),
('11:00', '12:30'),
('14:00', '15:30'),
('16:00', '17:30'),
('18:00', '19:30');

-- Add realtime support for appointments
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
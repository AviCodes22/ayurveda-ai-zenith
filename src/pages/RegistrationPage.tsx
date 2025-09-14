import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, Link } from "react-router-dom";
import { Leaf, Heart, User, UserCheck, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type UserRole = 'patient' | 'doctor' | 'administrator';

interface BasicInfo {
  fullName: string;
  dateOfBirth: string;
  aadharNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PatientDetails {
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
  bodyConstitution: string;
  pulseRate: string;
  bloodPressure: string;
  dietaryPreferences: string;
  lifestyleHabits: string;
  chiefComplaint: string;
}

interface DoctorDetails {
  ayushRegistrationNumber: string;
  specialization: string;
  qualification: string;
  yearsOfExperience: string;
  clinicAddress: string;
}

interface AdminDetails {
  workerId: string;
}

const RegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    fullName: "",
    dateOfBirth: "",
    aadharNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
    bodyConstitution: "",
    pulseRate: "",
    bloodPressure: "",
    dietaryPreferences: "",
    lifestyleHabits: "",
    chiefComplaint: ""
  });

  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails>({
    ayushRegistrationNumber: "",
    specialization: "",
    qualification: "",
    yearsOfExperience: "",
    clinicAddress: ""
  });

  const [adminDetails, setAdminDetails] = useState<AdminDetails>({
    workerId: ""
  });

  const validateBasicInfo = () => {
    if (!basicInfo.fullName || !basicInfo.dateOfBirth || !basicInfo.aadharNumber || !basicInfo.email || !basicInfo.password) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }

    if (basicInfo.password !== basicInfo.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return false;
    }

    if (basicInfo.aadharNumber.length !== 12) {
      toast({
        title: "Invalid Aadhar Number",
        description: "Aadhar number must be 12 digits.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleRegistration = async () => {
    if (!validateBasicInfo() || !role) return;
    
    setIsLoading(true);

    try {
      // Verify admin worker ID if administrator
      if (role === 'administrator') {
        const { data: workerData, error: workerError } = await supabase
          .from('administrator_workers')
          .select('worker_id')
          .eq('worker_id', adminDetails.workerId)
          .eq('is_active', true)
          .maybeSingle();

        if (workerError || !workerData) {
          toast({
            title: "Invalid Worker ID",
            description: "The provided worker ID is not valid or inactive.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: basicInfo.email,
        password: basicInfo.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) {
        toast({
          title: "Registration Failed",
          description: authError.message,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        toast({
          title: "Registration Failed",
          description: "Failed to create user account.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Generate unique ID
      const { data: uniqueIdData, error: uniqueIdError } = await supabase
        .rpc('generate_unique_id', { role_type: role });

      if (uniqueIdError) {
        toast({
          title: "Registration Failed",
          description: "Failed to generate unique ID.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          unique_id: uniqueIdData,
          full_name: basicInfo.fullName,
          date_of_birth: basicInfo.dateOfBirth,
          aadhar_number: basicInfo.aadharNumber,
          role: role
        });

      if (profileError) {
        toast({
          title: "Registration Failed",
          description: "Failed to create user profile.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Create role-specific details
      if (role === 'patient') {
        await supabase.from('patient_details').insert({
          user_id: authData.user.id,
          medical_history: patientDetails.medicalHistory,
          current_medications: patientDetails.currentMedications,
          allergies: patientDetails.allergies,
          body_constitution: patientDetails.bodyConstitution,
          pulse_rate: patientDetails.pulseRate ? parseInt(patientDetails.pulseRate) : null,
          blood_pressure: patientDetails.bloodPressure,
          dietary_preferences: patientDetails.dietaryPreferences,
          lifestyle_habits: patientDetails.lifestyleHabits,
          chief_complaint: patientDetails.chiefComplaint
        });
      } else if (role === 'doctor') {
        await supabase.from('doctor_verification').insert({
          user_id: authData.user.id,
          ayush_registration_number: doctorDetails.ayushRegistrationNumber,
          specialization: doctorDetails.specialization,
          qualification: doctorDetails.qualification,
          years_of_experience: parseInt(doctorDetails.yearsOfExperience),
          clinic_address: doctorDetails.clinicAddress
        });
      }

      toast({
        title: "Registration Successful!",
        description: `Welcome to AyurTech Pro! Your unique ID is: ${uniqueIdData}`,
      });

      navigate('/login');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="space-y-4">
      {/* Patient Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setRole('patient')}
        className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
          role === 'patient' 
            ? 'border-primary bg-primary/5 shadow-glow' 
            : 'border-primary/10 bg-card hover:border-primary/30'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${role === 'patient' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">Patient</h3>
            <p className="text-sm text-muted-foreground">
              Seeking Panchakarma treatments and personalized wellness solutions
            </p>
          </div>
        </div>
      </motion.div>

      {/* Doctor Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setRole('doctor')}
        className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
          role === 'doctor' 
            ? 'border-primary bg-primary/5 shadow-glow' 
            : 'border-primary/10 bg-card hover:border-primary/30'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${role === 'doctor' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">AYUSH Doctor</h3>
            <p className="text-sm text-muted-foreground">
              Certified Ayurvedic practitioner providing treatments and consultations
            </p>
          </div>
        </div>
      </motion.div>

      {/* Administrator Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setRole('administrator')}
        className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
          role === 'administrator' 
            ? 'border-primary bg-primary/5 shadow-glow' 
            : 'border-primary/10 bg-card hover:border-primary/30'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${role === 'administrator' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">Administrator</h3>
            <p className="text-sm text-muted-foreground">
              System administrator managing platform operations and user verification
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderBasicInfoForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={basicInfo.fullName}
            onChange={(e) => setBasicInfo({...basicInfo, fullName: e.target.value})}
            placeholder="Enter your full name"
            className="border-primary/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={basicInfo.dateOfBirth}
            onChange={(e) => setBasicInfo({...basicInfo, dateOfBirth: e.target.value})}
            className="border-primary/20"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="aadharNumber">Aadhar Number *</Label>
        <Input
          id="aadharNumber"
          value={basicInfo.aadharNumber}
          onChange={(e) => setBasicInfo({...basicInfo, aadharNumber: e.target.value})}
          placeholder="Enter 12-digit Aadhar number"
          maxLength={12}
          className="border-primary/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={basicInfo.email}
          onChange={(e) => setBasicInfo({...basicInfo, email: e.target.value})}
          placeholder="Enter your email address"
          className="border-primary/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={basicInfo.password}
            onChange={(e) => setBasicInfo({...basicInfo, password: e.target.value})}
            placeholder="Create a secure password"
            className="border-primary/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={basicInfo.confirmPassword}
            onChange={(e) => setBasicInfo({...basicInfo, confirmPassword: e.target.value})}
            placeholder="Confirm your password"
            className="border-primary/20"
          />
        </div>
      </div>
    </div>
  );

  const renderRoleSpecificForm = () => {
    if (role === 'patient') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Panchakarma Assessment</h3>
          
          <div className="space-y-2">
            <Label htmlFor="bodyConstitution">Body Constitution (Prakriti)</Label>
            <Select onValueChange={(value) => setPatientDetails({...patientDetails, bodyConstitution: value})}>
              <SelectTrigger className="border-primary/20">
                <SelectValue placeholder="Select your dominant constitution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vata">Vata (Air + Space)</SelectItem>
                <SelectItem value="pitta">Pitta (Fire + Water)</SelectItem>
                <SelectItem value="kapha">Kapha (Earth + Water)</SelectItem>
                <SelectItem value="vata-pitta">Vata-Pitta</SelectItem>
                <SelectItem value="pitta-kapha">Pitta-Kapha</SelectItem>
                <SelectItem value="vata-kapha">Vata-Kapha</SelectItem>
                <SelectItem value="tridosha">Tridosha (Balanced)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chiefComplaint">Chief Complaint</Label>
            <Textarea
              id="chiefComplaint"
              value={patientDetails.chiefComplaint}
              onChange={(e) => setPatientDetails({...patientDetails, chiefComplaint: e.target.value})}
              placeholder="Describe your main health concerns..."
              className="border-primary/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pulseRate">Pulse Rate (bpm)</Label>
              <Input
                id="pulseRate"
                type="number"
                value={patientDetails.pulseRate}
                onChange={(e) => setPatientDetails({...patientDetails, pulseRate: e.target.value})}
                placeholder="Normal range: 60-100"
                className="border-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodPressure">Blood Pressure</Label>
              <Input
                id="bloodPressure"
                value={patientDetails.bloodPressure}
                onChange={(e) => setPatientDetails({...patientDetails, bloodPressure: e.target.value})}
                placeholder="e.g., 120/80 mmHg"
                className="border-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              value={patientDetails.medicalHistory}
              onChange={(e) => setPatientDetails({...patientDetails, medicalHistory: e.target.value})}
              placeholder="Any previous medical conditions, surgeries, or treatments..."
              className="border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentMedications">Current Medications</Label>
            <Textarea
              id="currentMedications"
              value={patientDetails.currentMedications}
              onChange={(e) => setPatientDetails({...patientDetails, currentMedications: e.target.value})}
              placeholder="List any medications you're currently taking..."
              className="border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Known Allergies</Label>
            <Textarea
              id="allergies"
              value={patientDetails.allergies}
              onChange={(e) => setPatientDetails({...patientDetails, allergies: e.target.value})}
              placeholder="Any known allergies to foods, medicines, or substances..."
              className="border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietaryPreferences">Dietary Preferences</Label>
            <Textarea
              id="dietaryPreferences"
              value={patientDetails.dietaryPreferences}
              onChange={(e) => setPatientDetails({...patientDetails, dietaryPreferences: e.target.value})}
              placeholder="Vegetarian, vegan, specific dietary restrictions..."
              className="border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lifestyleHabits">Lifestyle Habits</Label>
            <Textarea
              id="lifestyleHabits"
              value={patientDetails.lifestyleHabits}
              onChange={(e) => setPatientDetails({...patientDetails, lifestyleHabits: e.target.value})}
              placeholder="Exercise routine, sleep patterns, stress levels, work schedule..."
              className="border-primary/20"
            />
          </div>
        </div>
      );
    }

    if (role === 'doctor') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">AYUSH Doctor Verification</h3>
          
          <div className="space-y-2">
            <Label htmlFor="ayushRegistrationNumber">AYUSH Registration Number *</Label>
            <Input
              id="ayushRegistrationNumber"
              value={doctorDetails.ayushRegistrationNumber}
              onChange={(e) => setDoctorDetails({...doctorDetails, ayushRegistrationNumber: e.target.value})}
              placeholder="Enter your AYUSH registration number"
              className="border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization *</Label>
            <Select onValueChange={(value) => setDoctorDetails({...doctorDetails, specialization: value})}>
              <SelectTrigger className="border-primary/20">
                <SelectValue placeholder="Select your specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="panchakarma">Panchakarma</SelectItem>
                <SelectItem value="general-ayurveda">General Ayurveda</SelectItem>
                <SelectItem value="rasayana">Rasayana (Rejuvenation)</SelectItem>
                <SelectItem value="kayachikitsa">Kayachikitsa (Internal Medicine)</SelectItem>
                <SelectItem value="shalya-tantra">Shalya Tantra (Surgery)</SelectItem>
                <SelectItem value="prasuti-tantra">Prasuti Tantra (Gynecology)</SelectItem>
                <SelectItem value="kaumara-bhritya">Kaumara Bhritya (Pediatrics)</SelectItem>
                <SelectItem value="shalakya-tantra">Shalakya Tantra (ENT & Ophthalmology)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification *</Label>
            <Input
              id="qualification"
              value={doctorDetails.qualification}
              onChange={(e) => setDoctorDetails({...doctorDetails, qualification: e.target.value})}
              placeholder="e.g., BAMS, MD (Ayurveda), PhD"
              className="border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
            <Input
              id="yearsOfExperience"
              type="number"
              value={doctorDetails.yearsOfExperience}
              onChange={(e) => setDoctorDetails({...doctorDetails, yearsOfExperience: e.target.value})}
              placeholder="Years of practice"
              min="0"
              className="border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinicAddress">Clinic Address</Label>
            <Textarea
              id="clinicAddress"
              value={doctorDetails.clinicAddress}
              onChange={(e) => setDoctorDetails({...doctorDetails, clinicAddress: e.target.value})}
              placeholder="Your practice address..."
              className="border-primary/20"
            />
          </div>
        </div>
      );
    }

    if (role === 'administrator') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Administrator Verification</h3>
          
          <div className="space-y-2">
            <Label htmlFor="workerId">Worker ID *</Label>
            <Input
              id="workerId"
              value={adminDetails.workerId}
              onChange={(e) => setAdminDetails({...adminDetails, workerId: e.target.value})}
              placeholder="Enter your administrator worker ID"
              className="border-primary/20"
            />
            <p className="text-sm text-muted-foreground">
              Contact your IT administrator if you don't have a valid worker ID.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  const getStepTitle = () => {
    switch(step) {
      case 1: return "Select Your Role";
      case 2: return "Basic Information";
      case 3: return role === 'patient' ? "Health Assessment" : role === 'doctor' ? "Professional Details" : "Verification";
      default: return "Registration";
    }
  };

  const canProceedToNext = () => {
    switch(step) {
      case 1: return role !== null;
      case 2: return validateBasicInfo();
      case 3: return true; // Role-specific validation can be added here
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Traditional Indian Background Patterns */}
      <div className="absolute inset-0 opacity-25">
        {/* Mandala Patterns */}
        <div className="absolute top-10 right-10 w-40 h-40 border-4 border-primary/60 rounded-full shadow-glow animate-pulse">
          <div className="absolute inset-4 border-2 border-accent/80 rounded-full">
            <div className="absolute inset-4 border-2 border-primary rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-accent rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-20 left-10 w-32 h-32 border-4 border-accent/70 rounded-full shadow-glow animate-pulse delay-500">
          <div className="absolute inset-3 border-2 border-primary/80 rounded-full">
            <div className="absolute inset-3 border-2 border-accent rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-primary rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Lotus Petals */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 opacity-60 animate-pulse delay-300">
          <div className="absolute inset-0 bg-primary/70 rounded-full transform rotate-0" style={{clipPath: 'ellipse(50% 80% at 50% 100%)'}}></div>
          <div className="absolute inset-0 bg-primary/70 rounded-full transform rotate-45" style={{clipPath: 'ellipse(50% 80% at 50% 100%)'}}></div>
          <div className="absolute inset-0 bg-primary/70 rounded-full transform rotate-90" style={{clipPath: 'ellipse(50% 80% at 50% 100%)'}}></div>
          <div className="absolute inset-0 bg-primary/70 rounded-full transform rotate-135" style={{clipPath: 'ellipse(50% 80% at 50% 100%)'}}></div>
        </div>

        {/* Sanskrit Om Symbol Background */}
        <div className="absolute top-1/2 left-1/6 text-6xl text-primary/25 font-bold select-none animate-pulse delay-800">ॐ</div>
        
        {/* Paisley Patterns */}
        <div className="absolute top-3/4 right-1/4 w-16 h-24 bg-accent/60 rounded-full transform rotate-45 opacity-50 shadow-lg animate-pulse delay-700" 
             style={{borderRadius: '50% 50% 50% 0'}}></div>
        <div className="absolute top-1/3 right-1/3 w-12 h-18 bg-primary/60 rounded-full transform -rotate-30 opacity-50 shadow-lg animate-pulse delay-1000" 
             style={{borderRadius: '50% 50% 50% 0'}}></div>

        {/* Traditional Border Elements */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-lg"></div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-accent/40 to-transparent shadow-lg"></div>
        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-b from-transparent via-primary/40 to-transparent shadow-lg"></div>
        <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-b from-transparent via-accent/40 to-transparent shadow-lg"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Logo Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Leaf className="w-10 h-10 text-primary drop-shadow-sm" />
              <Heart className="w-5 h-5 text-accent absolute -top-1 -right-1 drop-shadow-sm" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-primary">
                AyurTech
              </h1>
              <p className="text-xl font-semibold text-accent">Pro</p>
            </div>
          </div>
        </motion.div>

        {/* Registration Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="border-primary/10 shadow-elevated bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">{getStepTitle()}</CardTitle>
              <CardDescription className="text-muted-foreground">
                Step {step} of 3 - Create your wellness account
              </CardDescription>
              {/* Progress Bar */}
              <div className="mt-4 bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-healing"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </CardHeader>
            <CardContent>
              {step === 1 && renderRoleSelection()}
              {step === 2 && renderBasicInfoForm()}
              {step === 3 && renderRoleSpecificForm()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="border-primary/20"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button variant="outline" className="border-primary/20">
                      Already have an account?
                    </Button>
                  </Link>
                )}

                {step < 3 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceedToNext()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleRegistration}
                    disabled={isLoading || !canProceedToNext()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Creating Account..." : "Complete Registration"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;
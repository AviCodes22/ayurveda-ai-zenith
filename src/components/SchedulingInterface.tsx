import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Users, 
  MapPin,
  Sparkles,
  CheckCircle,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PaymentModal } from "@/components/PaymentModal";

interface SchedulingInterfaceProps {
  userType: string;
}

interface Therapy {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  category: string;
  benefits: string[];
  image_url: string;
}

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export const SchedulingInterface = ({ userType }: SchedulingInterfaceProps) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTherapy, setSelectedTherapy] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [therapies, setTherapies] = useState<Therapy[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    appointment?: {
      id: string;
      therapy: string;
      date: string;
      time: string;
      amount: number;
    };
  }>({ isOpen: false });

  useEffect(() => {
    fetchTherapies();
    fetchTimeSlots();
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchTherapies = async () => {
    try {
      const { data, error } = await supabase
        .from('therapies')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching therapies:', error);
        toast.error('Failed to load therapies');
      } else {
        console.log('Fetched therapies:', data);
        setTherapies(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching therapies:', error);
      toast.error('Failed to load therapies');
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('is_available', true)
        .order('start_time');
      
      if (error) {
        console.error('Error fetching time slots:', error);
        toast.error('Failed to load time slots');
      } else {
        console.log('Fetched time slots:', data);
        setTimeSlots(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching time slots:', error);
      toast.error('Failed to load time slots');
    }
  };

  const fetchAppointments = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          therapies(name),
          time_slots(start_time, end_time)
        `)
        .eq('patient_id', user.id)
        .order('appointment_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
      } else {
        console.log('Fetched appointments:', data);
        setAppointments(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching appointments:', error);
      toast.error('Failed to load appointments');
    }
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTherapy || !selectedTime || !user) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const selectedTherapyData = therapies.find(t => t.id === selectedTherapy);
      const selectedTimeSlotData = timeSlots.find(t => t.id === selectedTime);
      
      if (!selectedTherapyData || !selectedTimeSlotData) {
        toast.error("Invalid therapy or time slot selected");
        return;
      }

      // Create appointment
      const { data: appointment, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          therapy_id: selectedTherapy,
          time_slot_id: selectedTime,
          appointment_date: selectedDate.toISOString().split('T')[0],
          total_amount: selectedTherapyData.price,
          status: 'scheduled',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error (single appointment):', error);
        toast.error(`Failed to create appointment: ${error.message || 'Unknown error'}`);
        return;
      }

      // Open payment modal
      setPaymentModal({
        isOpen: true,
        appointment: {
          id: appointment.id,
          therapy: selectedTherapyData.name,
          date: selectedDate.toLocaleDateString(),
          time: `${selectedTimeSlotData.start_time} - ${selectedTimeSlotData.end_time}`,
          amount: selectedTherapyData.price
        }
      });

      setIsDialogOpen(false);
      setSelectedTherapy("");
      setSelectedTime("");
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast.error('Failed to schedule appointment');
    }
  };

  const handleAIOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      toast.success("AI Optimization Complete!", {
        description: "Found 3 optimal time slots with 25% better patient flow"
      });
    }, 2000);
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      apt.appointment_date === date.toISOString().split('T')[0]
    );
  };

  const handlePaymentSuccess = () => {
    fetchAppointments();
    toast.success('Appointment confirmed!', {
      description: 'Payment completed successfully.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Therapy Scheduling</h2>
          <p className="text-muted-foreground">
            {userType === "patient" ? "Book your next therapy session" : "Manage patient appointments"}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleAIOptimize}
            variant="outline"
            disabled={optimizing}
            className="hover:bg-primary/5"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {optimizing ? "Optimizing..." : "AI Optimize"}
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary-light">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule New Session</DialogTitle>
                <DialogDescription>
                  Book a new therapy appointment
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label>Therapy Type</Label>
                  <Select value={selectedTherapy} onValueChange={setSelectedTherapy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose therapy" />
                    </SelectTrigger>
                    <SelectContent>
                      {therapies.map((therapy) => (
                        <SelectItem key={therapy.id} value={therapy.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{therapy.name} ({therapy.duration_minutes} min)</span>
                            <Badge variant="secondary">₹{therapy.price}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Time Slot</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.id} value={slot.id}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {slot.start_time} - {slot.end_time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {userType !== "patient" && (
                  <>
                    <div>
                      <Label>Patient Name</Label>
                      <Input placeholder="Enter patient name" />
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Textarea placeholder="Additional notes..." />
                    </div>
                  </>
                )}

                <Button onClick={handleSchedule} className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Book & Pay
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Select Date</h3>
            <Badge variant="outline" className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {appointments.length} appointments
            </Badge>
          </div>
          
          <div className="flex gap-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            modifiers={{
              hasAppointment: appointments.map(apt => new Date(apt.appointment_date))
            }}
            modifiersStyles={{
              hasAppointment: { 
                backgroundColor: "hsl(var(--primary))", 
                color: "white",
                fontWeight: "bold"
              }
            }}
            />
          </div>
        </Card>

        {/* Daily Schedule */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {selectedDate ? selectedDate.toLocaleDateString() : "Select Date"}
          </h3>
          
          {selectedDate && (
            <div className="space-y-3">
              {getAppointmentsForDate(selectedDate).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No appointments scheduled
                </p>
              ) : (
                getAppointmentsForDate(selectedDate).map((apt, index) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {apt.time_slots?.start_time} - {apt.time_slots?.end_time}
                        </span>
                      </div>
                      <Badge 
                        variant={apt.payment_status === 'completed' ? 'default' : 'secondary'}
                        className={apt.payment_status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {apt.payment_status === 'completed' ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm">{apt.therapies?.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      ₹{apt.total_amount} • {apt.status}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Therapy Options */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Available Therapies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {therapies.map((therapy) => (
            <motion.div
              key={therapy.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedTherapy(therapy.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{therapy.name}</h4>
                <Badge variant="outline">₹{therapy.price}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {therapy.duration_minutes} minutes • {therapy.category}
              </p>
              <p className="text-xs text-muted-foreground">
                {therapy.description?.substring(0, 80)}...
              </p>
              {therapy.benefits && therapy.benefits.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {therapy.benefits.slice(0, 2).map((benefit, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Payment Modal */}
      {paymentModal.appointment && (
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={() => setPaymentModal({ isOpen: false })}
          appointment={paymentModal.appointment}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
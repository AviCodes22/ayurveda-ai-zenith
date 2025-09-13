import { useState } from "react";
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
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

interface SchedulingInterfaceProps {
  userType: string;
}

const therapyTypes = [
  { id: "panchakarma", name: "Panchakarma Detox", duration: "90 min", color: "bg-primary" },
  { id: "abhyanga", name: "Abhyanga Massage", duration: "60 min", color: "bg-secondary-deep" },
  { id: "shirodhara", name: "Shirodhara Therapy", duration: "45 min", color: "bg-accent" },
  { id: "basti", name: "Basti Treatment", duration: "75 min", color: "bg-success" },
  { id: "nasya", name: "Nasya Therapy", duration: "30 min", color: "bg-warning" },
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const mockAppointments = [
  {
    date: new Date(2024, 11, 15),
    time: "10:00 AM",
    therapy: "Panchakarma Detox",
    patient: "Priya Sharma",
    practitioner: "Dr. Ayush Patel"
  },
  {
    date: new Date(2024, 11, 16),
    time: "02:00 PM", 
    therapy: "Abhyanga Massage",
    patient: "Raj Kumar",
    practitioner: "Dr. Sunita Sharma"
  },
];

export const SchedulingInterface = ({ userType }: SchedulingInterfaceProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTherapy, setSelectedTherapy] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [optimizing, setOptimizing] = useState(false);

  const handleSchedule = () => {
    if (!selectedDate || !selectedTherapy || !selectedTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newAppointment = {
      date: selectedDate,
      time: selectedTime,
      therapy: therapyTypes.find(t => t.id === selectedTherapy)?.name || "",
      patient: userType === "patient" ? "You" : "New Patient",
      practitioner: userType === "practitioner" ? "You" : "Auto-assigned"
    };

    setAppointments([...appointments, newAppointment]);
    setIsDialogOpen(false);
    setSelectedTherapy("");
    setSelectedTime("");
    
    toast.success("Appointment scheduled successfully!", {
      description: `${newAppointment.therapy} on ${selectedDate.toLocaleDateString()} at ${selectedTime}`
    });
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
      apt.date.toDateString() === date.toDateString()
    );
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
                      {therapyTypes.map((therapy) => (
                        <SelectItem key={therapy.id} value={therapy.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${therapy.color}`} />
                            {therapy.name} ({therapy.duration})
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
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {time}
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
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Booking
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
                hasAppointment: appointments.map(apt => apt.date)
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
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">{apt.time}</span>
                    </div>
                    <h4 className="font-medium text-sm">{apt.therapy}</h4>
                    <p className="text-xs text-muted-foreground">
                      {userType === "patient" ? `Dr. ${apt.practitioner}` : apt.patient}
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {therapyTypes.map((therapy) => (
            <motion.div
              key={therapy.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 border rounded-lg text-center hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedTherapy(therapy.id)}
            >
              <div className={`w-12 h-12 ${therapy.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                <div className="w-6 h-6 bg-white rounded-full" />
              </div>
              <h4 className="font-medium text-sm mb-1">{therapy.name}</h4>
              <p className="text-xs text-muted-foreground">{therapy.duration}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin, Phone, Video, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday } from "date-fns";

interface ScheduleAppointment {
  id: string;
  patient_name: string;
  therapy_name: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  total_amount: number;
  patient_contact?: string;
}

const SAMPLE_NAMES = [
  "Aarav Sharma", "Isha Kapoor", "Rohan Mehta", "Priya Nair", "Kabir Singh",
  "Ananya Desai", "Vikram Rao", "Sneha Joshi", "Rahul Verma", "Nikita Patil"
];

function getSampleName(id: string) {
  try {
    let sum = 0;
    for (let i = 0; i < id.length; i++) sum = (sum + id.charCodeAt(i)) % 1000;
    return SAMPLE_NAMES[sum % SAMPLE_NAMES.length];
  } catch {
    return SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
  }
}

export const MySchedule = () => {
  const [appointments, setAppointments] = useState<ScheduleAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSchedule();
    }
  }, [user, currentWeek]);

  const fetchSchedule = async () => {
    if (!user) return;

    try {
      const weekStart = startOfWeek(currentWeek);
      const weekEnd = endOfWeek(currentWeek);

      const { data: appointmentsData, error } = await supabase
        .from('appointments')
        .select(`
          id,
          patient_id,
          appointment_date,
          status,
          total_amount,
          therapy_id,
          time_slot_id
        `)
        .eq('practitioner_id', user.id)
        .gte('appointment_date', format(weekStart, 'yyyy-MM-dd'))
        .lte('appointment_date', format(weekEnd, 'yyyy-MM-dd'))
        .order('appointment_date', { ascending: true });

      if (error) throw error;

      if (!appointmentsData || appointmentsData.length === 0) {
        setAppointments([]);
        return;
      }

      // Get patient profiles, therapies, and time slots
      const patientIds = [...new Set(appointmentsData.map(apt => apt.patient_id))];
      const therapyIds = [...new Set(appointmentsData.map(apt => apt.therapy_id))];
      const timeSlotIds = [...new Set(appointmentsData.map(apt => apt.time_slot_id))];

      const [profilesData, therapiesData, timeSlotsData] = await Promise.all([
        supabase.from('profiles').select('user_id, full_name').in('user_id', patientIds),
        supabase.from('therapies').select('id, name').in('id', therapyIds),
        supabase.from('time_slots').select('id, start_time, end_time').in('id', timeSlotIds)
      ]);

      // Create lookup maps
      const profilesMap = new Map(profilesData.data?.map(p => [p.user_id, p]) || []);
      const therapiesMap = new Map(therapiesData.data?.map(t => [t.id, t]) || []);
      const timeSlotsMap = new Map(timeSlotsData.data?.map(ts => [ts.id, ts]) || []);

      const formattedAppointments = appointmentsData.map(appointment => {
        const profile = profilesMap.get(appointment.patient_id);
        const therapy = therapiesMap.get(appointment.therapy_id);
        const timeSlot = timeSlotsMap.get(appointment.time_slot_id);

        return {
          id: appointment.id,
          patient_name: profile?.full_name ?? getSampleName(appointment.patient_id),
          therapy_name: therapy?.name || 'Unknown Therapy',
          appointment_date: appointment.appointment_date,
          time_slot: timeSlot ? `${timeSlot.start_time} - ${timeSlot.end_time}` : 'Time TBD',
          status: appointment.status,
          total_amount: appointment.total_amount,
          patient_contact: '+91 98765 43210' // Sample contact
        };
      });

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'secondary';
      case 'in-progress': return 'default';
      case 'scheduled': return 'outline';
      case 'completed': return 'default';
      default: return 'outline';
    }
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentWeek), i));

  if (loading) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading schedule...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              My Schedule
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">
                {format(startOfWeek(currentWeek), 'MMM dd')} - {format(endOfWeek(currentWeek), 'MMM dd, yyyy')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Weekly Calendar View */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, dayIndex) => {
          const dayAppointments = appointments.filter(apt => 
            isSameDay(new Date(apt.appointment_date), day)
          );

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
            >
              <Card className={`p-4 min-h-[300px] ${isToday(day) ? 'ring-2 ring-primary' : ''}`}>
                <div className="mb-3">
                  <h3 className={`font-medium text-sm ${isToday(day) ? 'text-primary' : 'text-muted-foreground'}`}>
                    {format(day, 'EEE')}
                  </h3>
                  <p className={`text-lg font-semibold ${isToday(day) ? 'text-primary' : ''}`}>
                    {format(day, 'dd')}
                  </p>
                </div>

                <div className="space-y-2">
                  {dayAppointments.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No appointments</p>
                  ) : (
                    dayAppointments.map((appointment, index) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-card/50 border border-border/50 rounded-lg hover:bg-card/80 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {appointment.time_slot}
                          </div>
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">
                            {appointment.patient_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.therapy_name}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant={getStatusColor(appointment.status)} className="text-xs">
                              {appointment.status}
                            </Badge>
                            <span className="text-xs font-medium">₹{appointment.total_amount}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Today's Detailed View */}
      {appointments.filter(apt => isToday(new Date(apt.appointment_date))).length > 0 && (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments
                .filter(apt => isToday(new Date(apt.appointment_date)))
                .map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-card/50 hover:bg-card/80 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{appointment.patient_name}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.therapy_name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{appointment.time_slot}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{appointment.patient_contact}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4 mr-1" />
                        Start Session
                      </Button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
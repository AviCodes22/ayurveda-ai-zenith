import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Eye, Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

interface CurrentPatient {
  patient_id: string;
  patient_name: string;
  therapy_name: string;
  appointment_date: string;
  status: string;
  time_slot: string;
  total_amount: number;
}

export const CurrentPatients = () => {
  const [patients, setPatients] = useState<CurrentPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCurrentPatients();
    }
  }, [user]);

  const fetchCurrentPatients = async () => {
    if (!user) return;

    try {
      // First get appointments for this practitioner
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          patient_id,
          appointment_date,
          status,
          total_amount,
          therapy_id,
          time_slot_id
        `)
        .eq('practitioner_id', user.id)
        .in('status', ['scheduled', 'confirmed', 'in-progress'])
        .order('appointment_date', { ascending: true });

      if (appointmentsError) throw appointmentsError;

      if (!appointmentsData || appointmentsData.length === 0) {
        setPatients([]);
        return;
      }

      // Get unique patient IDs and therapy IDs and time slot IDs
      const patientIds = [...new Set(appointmentsData.map(apt => apt.patient_id))];
      const therapyIds = [...new Set(appointmentsData.map(apt => apt.therapy_id))];
      const timeSlotIds = [...new Set(appointmentsData.map(apt => apt.time_slot_id))];

      // Fetch patient profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', patientIds);

      if (profilesError) throw profilesError;

      // Fetch therapies
      const { data: therapiesData, error: therapiesError } = await supabase
        .from('therapies')
        .select('id, name')
        .in('id', therapyIds);

      if (therapiesError) throw therapiesError;

      // Fetch time slots
      const { data: timeSlotsData, error: timeSlotsError } = await supabase
        .from('time_slots')
        .select('id, start_time, end_time')
        .in('id', timeSlotIds);

      if (timeSlotsError) throw timeSlotsError;

      // Create lookup maps
      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
      const therapiesMap = new Map(therapiesData?.map(t => [t.id, t]) || []);
      const timeSlotsMap = new Map(timeSlotsData?.map(ts => [ts.id, ts]) || []);

      // Combine the data
      const formattedPatients = appointmentsData.map(appointment => {
        const profile = profilesMap.get(appointment.patient_id);
        const therapy = therapiesMap.get(appointment.therapy_id);
        const timeSlot = timeSlotsMap.get(appointment.time_slot_id);

        return {
          patient_id: appointment.patient_id,
          patient_name: profile?.full_name || 'Unknown Patient',
          therapy_name: therapy?.name || 'Unknown Therapy',
          appointment_date: appointment.appointment_date,
          status: appointment.status,
          time_slot: timeSlot ? `${timeSlot.start_time} - ${timeSlot.end_time}` : 'Time TBD',
          total_amount: appointment.total_amount
        };
      });

      setPatients(formattedPatients);
    } catch (error) {
      console.error('Error fetching current patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'secondary';
      case 'in-progress': 
        return 'default';
      case 'scheduled':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-progress':
        return <Clock className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            My Patients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading patients...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="card-elevated hover-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            My Patients
            <Badge variant="secondary" className="ml-auto">
              {patients.length} active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No current patients found.</p>
              <p className="text-sm">Scheduled appointments will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patients.map((patient, index) => (
                <motion.div
                  key={`${patient.patient_id}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-card/50 hover:bg-card/80 transition-all duration-200 hover-scale"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{patient.patient_name}</h4>
                      <p className="text-sm text-muted-foreground">{patient.therapy_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(patient.appointment_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {patient.time_slot}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          ₹{patient.total_amount}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={getStatusColor(patient.status)}
                      className={patient.status === 'in-progress' ? 'animate-pulse' : ''}
                    >
                      {getStatusIcon(patient.status)}
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </Badge>
                    <Button variant="outline" size="sm" className="hover-scale">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Eye, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

interface PreviousPatient {
  patient_id: string;
  patient_name: string;
  therapy_name: string;
  appointment_date: string;
  status: string;
  total_sessions: number;
}

export const PreviousPatients = () => {
  const [patients, setPatients] = useState<PreviousPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPreviousPatients();
  }, [user]);

  const fetchPreviousPatients = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          patient_id,
          appointment_date,
          status,
          therapy_id,
          therapies!inner(name),
          profiles!inner(full_name)
        `)
        .eq('practitioner_id', user.id)
        .eq('status', 'completed')
        .order('appointment_date', { ascending: false });

      if (error) throw error;

      // Group by patient and get unique patients with their most recent therapy
      const patientMap = new Map();
      
      data?.forEach((appointment: any) => {
        const patientKey = appointment.patient_id;
        if (!patientMap.has(patientKey)) {
          patientMap.set(patientKey, {
            patient_id: appointment.patient_id,
            patient_name: appointment.profiles.full_name,
            therapy_name: appointment.therapies.name,
            appointment_date: appointment.appointment_date,
            status: appointment.status,
            total_sessions: 1
          });
        } else {
          const existing = patientMap.get(patientKey);
          existing.total_sessions += 1;
        }
      });

      setPatients(Array.from(patientMap.values()));
    } catch (error) {
      console.error('Error fetching previous patients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Previous Patients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading previous patients...
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
            Previous Patients
            <Badge variant="secondary" className="ml-auto">
              {patients.length} patients
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No previous patients found.</p>
              <p className="text-sm">Completed appointments will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patients.map((patient, index) => (
                <motion.div
                  key={patient.patient_id}
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
                        <Badge variant="outline" className="text-xs">
                          {patient.total_sessions} sessions
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Last: {new Date(patient.appointment_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-success/10 text-success hover:bg-success/20"
                    >
                      Completed
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
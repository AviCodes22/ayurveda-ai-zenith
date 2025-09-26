import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Stethoscope, TrendingUp, Clock, UserCheck, FileText, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { CurrentPatients } from "./CurrentPatients";

const doctorPatientData = [{
  month: "Jan",
  patients: 45
}, {
  month: "Feb", 
  patients: 52
}, {
  month: "Mar",
  patients: 48
}, {
  month: "Apr",
  patients: 61
}, {
  month: "May",
  patients: 55
}, {
  month: "Jun",
  patients: 67
}];

const consultationData = [{
  type: "Initial Consultation",
  count: 28
}, {
  type: "Follow-up",
  count: 42
}, {
  type: "Therapy Planning",
  count: 35
}, {
  type: "Progress Review",
  count: 19
}];

interface DoctorDashboardProps {
  displayName?: string;
}

export const DoctorDashboard = ({ displayName }: DoctorDashboardProps) => {
  return (
    <div className="space-y-8">
      {/* Doctor Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated gradient-earth p-8 rounded-2xl border border-earth-200/50 hover-glow"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 gradient-healing rounded-xl shadow-elevated animate-gentle-pulse">
            <Stethoscope className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-3xl font-playfair font-semibold text-foreground mb-2">
              Welcome Dr. {displayName || 'Doctor'}!
            </h2>
            <p className="text-muted-foreground text-lg">
              You have <span className="font-semibold text-primary">12 patients</span> scheduled today.
              <span className="font-medium text-success"> 3 new consultations</span> require your attention.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Doctor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 group-hover:gradient-healing rounded-xl transition-all duration-300">
                <Users className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-playfair font-semibold text-foreground">234</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 group-hover:bg-success rounded-xl transition-all duration-300">
                <Calendar className="h-6 w-6 text-success group-hover:text-success-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Consultations Today</p>
                <p className="text-2xl font-playfair font-semibold text-foreground">12</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 group-hover:bg-warning rounded-xl transition-all duration-300">
                <FileText className="h-6 w-6 text-warning group-hover:text-warning-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Treatment Plans</p>
                <p className="text-2xl font-playfair font-semibold text-foreground">89</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 group-hover:gradient-sunrise rounded-xl transition-all duration-300">
                <Activity className="h-6 w-6 text-accent group-hover:text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-playfair font-semibold text-success">96.8%</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Growth */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Patient Growth (6 Months)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={doctorPatientData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="patients" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Consultation Types */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Consultation Types (This Month)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={consultationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--success))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Today's Consultations */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Today's Consultations</h3>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            View Full Schedule
          </Button>
        </div>
        
        <div className="space-y-3">
          {[
            {
              time: "09:00 AM",
              patient: "Meera Joshi",
              type: "Initial Consultation",
              status: "confirmed",
              notes: "First visit - joint pain management"
            },
            {
              time: "10:30 AM", 
              patient: "Rohit Kumar",
              type: "Follow-up",
              status: "in-progress",
              notes: "Review panchakarma treatment progress"
            },
            {
              time: "11:30 AM",
              patient: "Kavya Reddy",
              type: "Therapy Planning",
              status: "pending",
              notes: "Design treatment plan for chronic fatigue"
            },
            {
              time: "02:00 PM",
              patient: "Arjun Patel",
              type: "Progress Review",
              status: "confirmed", 
              notes: "3-month treatment evaluation"
            }
          ].map((consultation, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-sm font-medium">{consultation.time}</div>
                  <div className="text-xs text-muted-foreground">{consultation.type}</div>
                </div>
                <div>
                  <h4 className="font-medium">{consultation.patient}</h4>
                  <p className="text-sm text-muted-foreground">{consultation.notes}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={
                    consultation.status === "confirmed" ? "secondary" : 
                    consultation.status === "in-progress" ? "default" : "outline"
                  }
                >
                  {consultation.status === "in-progress" ? (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </>
                  ) : consultation.status === "confirmed" ? (
                    <>
                      <UserCheck className="h-3 w-3 mr-1" />
                      Confirmed
                    </>
                  ) : (
                    "Pending"
                  )}
                </Badge>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Current Patients Section */}
      <CurrentPatients />
    </div>
  );
};
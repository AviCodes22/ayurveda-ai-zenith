import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, AlertTriangle, TrendingUp, Clock, UserCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
const patientData = [{
  therapy: "Panchakarma",
  count: 15
}, {
  therapy: "Abhyanga",
  count: 23
}, {
  therapy: "Shirodhara",
  count: 18
}, {
  therapy: "Basti",
  count: 12
}];
const scheduleData = [{
  name: "Completed",
  value: 78,
  color: "hsl(var(--success))"
}, {
  name: "Pending",
  value: 15,
  color: "hsl(var(--warning))"
}, {
  name: "Cancelled",
  value: 7,
  color: "hsl(var(--destructive))"
}];
interface PractitionerDashboardProps {
  displayName?: string;
}
export const PractitionerDashboard = ({
  displayName
}: PractitionerDashboardProps) => {
  return <div className="space-y-8">
      {/* Enhanced Welcome Section */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="card-elevated gradient-earth p-8 rounded-2xl border border-earth-200/50 hover-glow">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 gradient-healing rounded-xl shadow-elevated animate-gentle-pulse">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-3xl font-playfair font-semibold text-foreground mb-2">
              Good morning, {displayName || 'Practitioner'}!
            </h2>
            <p className="text-muted-foreground text-lg">
              You have <span className="font-semibold text-primary">8 appointments</span> today. 
              <span className="font-medium text-destructive"> 2 require immediate attention</span>.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1
      }}>
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 group-hover:gradient-healing rounded-xl transition-all duration-300 group-hover:shadow-glow">
                <Users className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Patients</p>
                <p className="text-2xl font-playfair font-semibold text-foreground">127</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }}>
          <Card className="card-elevated p-6 hover-scale hover-glow group rounded-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 group-hover:bg-success rounded-xl transition-all duration-300 group-hover:shadow-glow">
                <Calendar className="h-6 w-6 text-success group-hover:text-success-foreground transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Sessions</p>
                <p className="font-playfair font-semibold text-foreground text-base text-justify">8 Scheduled</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }}>
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 group-hover:bg-warning rounded-xl transition-all duration-300 group-hover:shadow-glow">
                <AlertTriangle className="h-6 w-6 text-warning group-hover:text-warning-foreground transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Needs Attention</p>
                <p className="font-playfair font-semibold text-warning text-base">2 Patients</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }}>
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 group-hover:gradient-sunrise rounded-xl transition-all duration-300 group-hover:shadow-glow">
                <TrendingUp className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="font-playfair font-semibold text-success text-base">94.2%</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Therapy Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Therapy Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={patientData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="therapy" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Session Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Session Status (This Week)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={scheduleData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                {scheduleData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {scheduleData.map(item => <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{
              backgroundColor: item.color
            }} />
                <span className="text-sm">{item.name}: {item.value}%</span>
              </div>)}
          </div>
        </Card>
      </div>

      {/* Today's Appointments */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Today's Appointments</h3>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
        </div>
        
        <div className="space-y-3">
          {[{
          time: "09:00 AM",
          patient: "Priya Sharma",
          therapy: "Panchakarma Consultation",
          status: "confirmed",
          duration: "45 min"
        }, {
          time: "10:30 AM",
          patient: "Raj Patel",
          therapy: "Abhyanga Therapy",
          status: "in-progress",
          duration: "60 min"
        }, {
          time: "12:00 PM",
          patient: "Anita Gupta",
          therapy: "Shirodhara Session",
          status: "pending",
          duration: "90 min"
        }, {
          time: "02:00 PM",
          patient: "Vikram Singh",
          therapy: "Follow-up Consultation",
          status: "confirmed",
          duration: "30 min"
        }].map((appointment, index) => <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-sm font-medium">{appointment.time}</div>
                  <div className="text-xs text-muted-foreground">{appointment.duration}</div>
                </div>
                <div>
                  <h4 className="font-medium">{appointment.patient}</h4>
                  <p className="text-sm text-muted-foreground">{appointment.therapy}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={appointment.status === "confirmed" ? "secondary" : appointment.status === "in-progress" ? "default" : "outline"}>
                  {appointment.status === "in-progress" ? <>
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </> : appointment.status === "confirmed" ? <>
                      <UserCheck className="h-3 w-3 mr-1" />
                      Confirmed
                    </> : "Pending"}
                </Badge>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>)}
        </div>
      </Card>
    </div>;
};
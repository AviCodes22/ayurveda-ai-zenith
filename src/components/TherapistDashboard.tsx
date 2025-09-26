import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Heart, TrendingUp, Clock, UserCheck, Target, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CurrentPatients } from "./CurrentPatients";

const therapySessionsData = [{
  therapy: "Abhyanga", 
  sessions: 32
}, {
  therapy: "Shirodhara",
  sessions: 28
}, {
  therapy: "Panchakarma",
  sessions: 24
}, {
  therapy: "Marma Therapy",
  sessions: 18
}, {
  therapy: "Yoga Therapy",
  sessions: 15
}];

const wellnessProgress = [{
  name: "Excellent",
  value: 35,
  color: "hsl(var(--success))"
}, {
  name: "Good", 
  value: 40,
  color: "hsl(var(--primary))"
}, {
  name: "Fair",
  value: 20,
  color: "hsl(var(--warning))"
}, {
  name: "Needs Support",
  value: 5,
  color: "hsl(var(--destructive))"
}];

interface TherapistDashboardProps {
  displayName?: string;
}

export const TherapistDashboard = ({ displayName }: TherapistDashboardProps) => {
  return (
    <div className="space-y-8">
      {/* Therapist Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated gradient-earth p-8 rounded-2xl border border-earth-200/50 hover-glow"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 gradient-healing rounded-xl shadow-elevated animate-gentle-pulse">
            <Heart className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-3xl font-playfair font-semibold text-foreground mb-2">
              Namaste, {displayName || 'Therapist'}!
            </h2>
            <p className="text-muted-foreground text-lg">
              You have <span className="font-semibold text-primary">9 therapy sessions</span> today.
              <span className="font-medium text-accent"> 2 wellness assessments</span> are due.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Therapist Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 group-hover:gradient-healing rounded-xl transition-all duration-300">
                <Users className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                <p className="text-2xl font-playfair font-semibold text-foreground">156</p>
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
                <p className="text-sm font-medium text-muted-foreground">Sessions Today</p>
                <p className="text-2xl font-playfair font-semibold text-foreground">9</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 group-hover:bg-accent rounded-xl transition-all duration-300">
                <Target className="h-6 w-6 text-accent group-hover:text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wellness Goals</p>
                <p className="text-2xl font-playfair font-semibold text-foreground">78</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 group-hover:gradient-sunrise rounded-xl transition-all duration-300">
                <Zap className="h-6 w-6 text-warning group-hover:text-warning-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Energy Index</p>
                <p className="text-2xl font-playfair font-semibold text-success">92.5%</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Therapy Sessions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Therapy Sessions (This Month)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={therapySessionsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="therapy" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sessions" fill="hsl(var(--accent))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Wellness Progress */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Client Wellness Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie 
                data={wellnessProgress} 
                cx="50%" 
                cy="50%" 
                innerRadius={60} 
                outerRadius={100} 
                dataKey="value"
              >
                {wellnessProgress.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {wellnessProgress.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="text-sm">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Today's Therapy Sessions */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Today's Therapy Sessions</h3>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            View Schedule
          </Button>
        </div>
        
        <div className="space-y-3">
          {[
            {
              time: "09:00 AM",
              patient: "Sita Devi",
              therapy: "Abhyanga Therapy",
              status: "confirmed",
              duration: "90 min",
              focus: "Stress relief & muscle tension"
            },
            {
              time: "11:00 AM",
              patient: "Ramesh Gupta", 
              therapy: "Shirodhara Session",
              status: "in-progress",
              duration: "60 min",
              focus: "Anxiety & sleep disorders"
            },
            {
              time: "01:00 PM",
              patient: "Priya Sharma",
              therapy: "Marma Therapy",
              status: "pending",
              duration: "45 min",
              focus: "Energy blockage release"
            },
            {
              time: "03:00 PM",
              patient: "Vikram Singh",
              therapy: "Yoga Therapy",
              status: "confirmed",
              duration: "60 min",
              focus: "Flexibility & mindfulness"
            }
          ].map((session, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-sm font-medium">{session.time}</div>
                  <div className="text-xs text-muted-foreground">{session.duration}</div>
                </div>
                <div>
                  <h4 className="font-medium">{session.patient}</h4>
                  <p className="text-sm text-muted-foreground">{session.therapy}</p>
                  <p className="text-xs text-muted-foreground mt-1">{session.focus}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={
                    session.status === "confirmed" ? "secondary" : 
                    session.status === "in-progress" ? "default" : "outline"
                  }
                >
                  {session.status === "in-progress" ? (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      In Session
                    </>
                  ) : session.status === "confirmed" ? (
                    <>
                      <UserCheck className="h-3 w-3 mr-1" />
                      Confirmed
                    </>
                  ) : (
                    "Pending"
                  )}
                </Badge>
                <Button variant="outline" size="sm">
                  View Notes
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
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Calendar, DollarSign, Activity, Star, Clock, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

// Sample data for analytics (replace with real data when available)
const monthlyRevenue = [
  { month: "Jan", revenue: 45000, patients: 23 },
  { month: "Feb", revenue: 52000, patients: 28 },
  { month: "Mar", revenue: 48000, patients: 25 },
  { month: "Apr", revenue: 61000, patients: 32 },
  { month: "May", revenue: 55000, patients: 29 },
  { month: "Jun", revenue: 67000, patients: 35 }
];

const treatmentEffectiveness = [
  { therapy: "Panchakarma", success: 95, total: 120 },
  { therapy: "Abhyanga", success: 88, total: 95 },
  { therapy: "Shirodhara", success: 92, total: 78 },
  { therapy: "Karna Purana", success: 86, total: 65 },
  { therapy: "Nasya", success: 91, total: 54 }
];

const patientSatisfaction = [
  { name: "Excellent", value: 45, color: "#22c55e" },
  { name: "Good", value: 35, color: "#3b82f6" },
  { name: "Average", value: 15, color: "#f59e0b" },
  { name: "Poor", value: 5, color: "#ef4444" }
];

const weeklyAppointments = [
  { day: "Mon", appointments: 8, completed: 7 },
  { day: "Tue", appointments: 12, completed: 11 },
  { day: "Wed", appointments: 10, completed: 9 },
  { day: "Thu", appointments: 15, completed: 14 },
  { day: "Fri", appointments: 11, completed: 10 },
  { day: "Sat", appointments: 6, completed: 6 },
  { day: "Sun", appointments: 3, completed: 3 }
];

export const MyAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [realTimeStats, setRealTimeStats] = useState({
    totalPatients: 0,
    completedAppointments: 0,
    totalRevenue: 0,
    avgRating: 4.8
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      // Fetch real appointment data
      const { data: appointmentsData, error } = await supabase
        .from('appointments')
        .select('patient_id, status, total_amount, payment_status')
        .eq('practitioner_id', user.id);

      if (error) throw error;

      // Calculate real stats
      const totalPatients = new Set(appointmentsData?.map(apt => apt.patient_id) || []).size;
      const completedAppointments = appointmentsData?.filter(apt => apt.status === 'completed').length || 0;
      const totalRevenue = appointmentsData?.reduce((sum, apt) => sum + (apt.total_amount || 0), 0) || 0;

      setRealTimeStats({
        totalPatients,
        completedAppointments,
        totalRevenue,
        avgRating: 4.8 // This would come from feedback table
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading analytics...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated gradient-earth p-6 rounded-2xl border border-earth-200/50 hover-glow"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 gradient-healing rounded-xl shadow-elevated">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-playfair font-semibold text-foreground">
              Performance Analytics
            </h2>
            <p className="text-muted-foreground">
              Track your practice performance and patient outcomes
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 group-hover:gradient-healing rounded-xl transition-all duration-300">
                <Users className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-playfair font-semibold text-foreground">{realTimeStats.totalPatients}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">+12% this month</span>
                </div>
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
                <p className="text-sm font-medium text-muted-foreground">Completed Sessions</p>
                <p className="text-2xl font-playfair font-semibold text-foreground">{realTimeStats.completedAppointments}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">98% completion rate</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 group-hover:bg-warning rounded-xl transition-all duration-300">
                <DollarSign className="h-6 w-6 text-warning group-hover:text-warning-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-playfair font-semibold text-foreground">₹{realTimeStats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">+18% this month</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 group-hover:gradient-sunrise rounded-xl transition-all duration-300">
                <Star className="h-6 w-6 text-accent group-hover:text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-playfair font-semibold text-success">{realTimeStats.avgRating}/5</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 text-warning fill-warning" />
                  <span className="text-xs text-muted-foreground">Based on 156 reviews</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg">Monthly Revenue & Patients</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1"
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Patient Satisfaction */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg">Patient Satisfaction</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={patientSatisfaction}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {patientSatisfaction.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Treatment Effectiveness */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg">Treatment Effectiveness</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {treatmentEffectiveness.map((treatment, index) => (
                <div key={treatment.therapy} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{treatment.therapy}</span>
                    <Badge variant="secondary">
                      {Math.round((treatment.success / treatment.total) * 100)}% success
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${(treatment.success / treatment.total) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {treatment.success} successful out of {treatment.total} treatments
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Weekly Appointments */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg">Weekly Appointments</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyAppointments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="hsl(var(--primary))" name="Scheduled" />
                <Bar dataKey="completed" fill="hsl(var(--success))" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Performance Insights */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-success" />
                <h4 className="font-medium text-success">Top Performing</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Panchakarma treatments show 95% success rate with highest patient satisfaction
              </p>
            </div>
            
            <div className="p-4 bg-warning/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-warning" />
                <h4 className="font-medium text-warning">Improvement Area</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Consider reducing wait times for Thursday appointments to improve efficiency
              </p>
            </div>
            
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-primary">Growth Opportunity</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Weekend slots show high demand - consider extending Saturday hours
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
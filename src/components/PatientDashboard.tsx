import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Activity, Clock, Heart, Thermometer, Droplets, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const healthData = [
  { date: "Mon", wellbeing: 65, energy: 70 },
  { date: "Tue", wellbeing: 72, energy: 75 },
  { date: "Wed", wellbeing: 78, energy: 82 },
  { date: "Thu", wellbeing: 85, energy: 88 },
  { date: "Fri", wellbeing: 88, energy: 90 },
];

interface PatientDashboardProps { 
  displayName?: string 
}

export const PatientDashboard = ({ displayName }: PatientDashboardProps) => {
  return (
    <div className="space-y-8">
      {/* Enhanced Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated gradient-sage p-8 rounded-2xl border border-sage-200/50 hover-glow"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 gradient-healing rounded-xl shadow-elevated">
            <Heart className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-3xl font-playfair font-semibold text-foreground mb-2">
              Welcome back, {displayName || 'User'}!
            </h2>
            <p className="text-muted-foreground text-lg">
              Your wellness journey continues. Today's focus: <span className="font-medium text-primary">Panchakarma Detox Phase 2</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 group-hover:gradient-healing rounded-xl transition-all duration-300 group-hover:shadow-glow">
                <Calendar className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Session</p>
                <p className="text-xl font-playfair font-semibold text-foreground">Tomorrow 10:00 AM</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 group-hover:bg-success rounded-xl transition-all duration-300 group-hover:shadow-glow">
                <Activity className="h-6 w-6 text-success group-hover:text-success-foreground transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-xl font-playfair font-semibold text-foreground">12/21 Sessions</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-earth-200/50 group-hover:gradient-earth rounded-xl transition-all duration-300 group-hover:shadow-warm">
                <Clock className="h-6 w-6 text-earth-600 group-hover:text-earth-800 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p className="text-xl font-playfair font-semibold text-foreground">45 min avg</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card-elevated p-6 hover-scale hover-glow group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 group-hover:gradient-sunrise rounded-xl transition-all duration-300 group-hover:shadow-glow">
                <Heart className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wellbeing</p>
                <p className="text-xl font-playfair font-semibold text-success">88% Good</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="card-elevated p-8 hover-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 gradient-healing rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-foreground">Weekly Progress</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-elevated)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="wellbeing" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Wellbeing"
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  name="Energy"
                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Enhanced Treatment Progress */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="card-elevated p-8 hover-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 gradient-sunrise rounded-lg">
                <Activity className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-foreground">Treatment Progress</h3>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-medium text-foreground">Panchakarma Detox</span>
                  <span className="text-sm font-semibold text-primary">57%</span>
                </div>
                <Progress value={57} className="h-3 bg-sage-100" />
              </div>
              
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-medium text-foreground">Abhyanga Therapy</span>
                  <span className="text-sm font-semibold text-success">85%</span>
                </div>
                <Progress value={85} className="h-3 bg-sage-100" />
              </div>
              
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-medium text-foreground">Shirodhara Sessions</span>
                  <span className="text-sm font-semibold text-earth-600">42%</span>
                </div>
                <Progress value={42} className="h-3 bg-sage-100" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Vital Signs & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="card-elevated p-8 hover-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-success/20 rounded-lg">
                <Thermometer className="h-5 w-5 text-success" />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-foreground">Vital Signs</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 gradient-sage rounded-xl">
                <Heart className="h-6 w-6 text-success mx-auto mb-2" />
                <p className="text-2xl font-playfair font-bold text-foreground">72</p>
                <p className="text-sm text-muted-foreground">Heart Rate</p>
              </div>
              <div className="text-center p-4 gradient-earth rounded-xl">
                <Droplets className="h-6 w-6 text-earth-600 mx-auto mb-2" />
                <p className="text-2xl font-playfair font-bold text-foreground">120/80</p>
                <p className="text-sm text-muted-foreground">Blood Pressure</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="card-elevated p-8 hover-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-playfair font-semibold text-foreground">Today's Schedule</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 hover:bg-sage-50 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Panchakarma Session</p>
                  <p className="text-sm text-muted-foreground">10:00 AM - 11:30 AM</p>
                </div>
                <Badge className="status-active">Today</Badge>
              </div>
              <div className="flex items-center gap-4 p-3 hover:bg-sage-50 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Consultation</p>
                  <p className="text-sm text-muted-foreground">2:00 PM - 2:30 PM</p>
                </div>
                <Badge className="status-pending">Upcoming</Badge>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
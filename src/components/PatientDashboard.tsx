import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Activity, Clock, Heart, Thermometer, Droplets } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const healthData = [
  { date: "Mon", wellbeing: 65, energy: 70 },
  { date: "Tue", wellbeing: 72, energy: 75 },
  { date: "Wed", wellbeing: 78, energy: 82 },
  { date: "Thu", wellbeing: 85, energy: 88 },
  { date: "Fri", wellbeing: 88, energy: 90 },
];

interface PatientDashboardProps { displayName?: string }
export const PatientDashboard = ({ displayName }: PatientDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-primary-light/10 p-6 rounded-xl border border-primary/20"
      >
        <h2 className="text-2xl font-bold mb-2">Welcome back, {displayName || 'User'}!</h2>
        <p className="text-muted-foreground">Your wellness journey continues. Today's focus: Panchakarma Detox Phase 2</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Session</p>
              <p className="font-semibold">Tomorrow 10:00 AM</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Activity className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="font-semibold">12/21 Sessions</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">45 min avg</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wellbeing</p>
              <p className="font-semibold">88% Good</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="wellbeing" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Wellbeing"
              />
              <Line 
                type="monotone" 
                dataKey="energy" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                name="Energy"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Treatment Progress */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Treatment Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Panchakarma Detox</span>
                <span className="text-sm text-muted-foreground">57%</span>
              </div>
              <Progress value={57} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Abhyanga Therapy</span>
                <span className="text-sm text-muted-foreground">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Dietary Adjustments</span>
                <span className="text-sm text-muted-foreground">72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
          </div>
        </Card>
      </div>

      {/* Current Therapies */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Active Therapies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Droplets className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Vamana (Emesis)</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Purification therapy for Kapha disorders</p>
            <Badge variant="secondary">Phase 2 - Active</Badge>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Thermometer className="h-5 w-5 text-accent" />
              <h4 className="font-medium">Abhyanga</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Full body oil massage therapy</p>
            <Badge variant="secondary">Daily - Ongoing</Badge>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="h-5 w-5 text-success" />
              <h4 className="font-medium">Pranayama</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Breathing exercises for wellness</p>
            <Badge variant="secondary">Morning Routine</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
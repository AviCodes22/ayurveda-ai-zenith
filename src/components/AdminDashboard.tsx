import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Activity, 
  Server, 
  Shield, 
  TrendingUp, 
  AlertCircle,
  DollarSign,
  Calendar
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const systemData = [
  { date: "Jan", users: 1200, sessions: 890, revenue: 45000 },
  { date: "Feb", users: 1350, sessions: 980, revenue: 52000 },
  { date: "Mar", users: 1580, sessions: 1150, revenue: 61000 },
  { date: "Apr", users: 1720, sessions: 1280, revenue: 68000 },
  { date: "May", users: 1950, sessions: 1420, revenue: 75000 },
];

const complianceData = [
  { metric: "Data Protection", score: 98 },
  { metric: "AYUSH Guidelines", score: 100 },
  { metric: "Medical Records", score: 96 },
  { metric: "Patient Privacy", score: 99 },
];

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-accent/20 to-primary/20 p-6 rounded-xl border border-accent/30"
      >
        <h2 className="text-2xl font-bold mb-2">System Overview</h2>
        <p className="text-muted-foreground">Monitoring 1,950+ active users across 15 centers with 99.9% uptime</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="font-semibold">1,950</p>
              <p className="text-xs text-success">+15% this month</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Activity className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Sessions</p>
              <p className="font-semibold">1,420</p>
              <p className="text-xs text-success">+22% this month</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="font-semibold">₹75,000</p>
              <p className="text-xs text-success">+18% this month</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Server className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">System Health</p>
              <p className="font-semibold">99.9%</p>
              <p className="text-xs text-success">All systems operational</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Trends */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Platform Growth</h3>
            <div className="flex gap-2">
              <Badge variant="outline">Users</Badge>
              <Badge variant="outline">Sessions</Badge>
              <Badge variant="outline">Revenue</Badge>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={systemData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="users" 
                stackId="1"
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary)/0.3)"
                name="Users"
              />
              <Area 
                type="monotone" 
                dataKey="sessions" 
                stackId="2"
                stroke="hsl(var(--accent))" 
                fill="hsl(var(--accent)/0.3)"
                name="Sessions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Score */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Compliance Dashboard</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={complianceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="metric" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="score" fill="hsl(var(--success))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* System Alerts */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">System Alerts</h3>
            <Badge variant="outline">3 Active</Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">High API Usage</h4>
                <p className="text-xs text-muted-foreground">
                  API calls exceeded 80% of monthly limit
                </p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Shield className="h-5 w-5 text-success mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">Security Scan Complete</h4>
                <p className="text-xs text-muted-foreground">
                  Monthly security audit passed with 100% score
                </p>
                <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">Performance Optimization</h4>
                <p className="text-xs text-muted-foreground">
                  Database optimization improved response time by 25%
                </p>
                <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Users className="h-5 w-5" />
            Manage Users
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Calendar className="h-5 w-5" />
            System Backup
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Shield className="h-5 w-5" />
            Security Audit
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Activity className="h-5 w-5" />
            Performance Report
          </Button>
        </div>
      </Card>
    </div>
  );
};
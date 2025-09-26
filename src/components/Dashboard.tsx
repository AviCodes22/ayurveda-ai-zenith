import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  BarChart3, 
  Users, 
  Bell, 
  Settings, 
  LogOut,
  Leaf,
  Activity,
  Clock,
  TrendingUp
} from "lucide-react";
import { PatientDashboard } from "@/components/PatientDashboard";
import { DoctorDashboard } from "@/components/DoctorDashboard";
import { TherapistDashboard } from "@/components/TherapistDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { SchedulingInterface } from "@/components/SchedulingInterface";
import { NotificationCenter } from "@/components/NotificationCenter";

interface UserProfile {
  unique_id: string;
  full_name: string;
  role: 'patient' | 'doctor' | 'administrator';
}

interface DashboardProps {
  userType: string;
  onLogout: () => void;
  userProfile?: UserProfile;
}

export const Dashboard = ({ userType, onLogout, userProfile }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(3);

  const getUserTitle = () => {
    switch (userType) {
      case "patient": return "Patient Portal";
      case "practitioner": 
      case "doctor": return "Practitioner Dashboard";
      case "admin": 
      case "administrator": return "Admin Console";
      default: return "Dashboard";
    }
  };

  const getNavItems = () => {
    const common = [
      { id: "overview", label: "Overview", icon: BarChart3 },
      { id: "schedule", label: "Schedule", icon: Calendar },
      { id: "notifications", label: "Notifications", icon: Bell, badge: notifications },
    ];

    if (userType === "patient") {
      return [
        ...common,
        { id: "therapy", label: "3D Therapy", icon: Activity },
        { id: "progress", label: "Progress", icon: TrendingUp },
      ];
    } else if (userType === "practitioner" || userType === "doctor") {
      return [
        ...common,
        { id: "patients", label: "Patients", icon: Users },
        { id: "therapy", label: "3D Preview", icon: Activity },
      ];
    } else {
      return [
        ...common,
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "users", label: "Users", icon: Users },
        { id: "settings", label: "Settings", icon: Settings },
      ];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-sage-50 to-earth-50 relative overflow-hidden pattern-lotus">
      {/* Enhanced Traditional Background Patterns */}
      <div className="absolute inset-0 opacity-20">
        {/* Floating Mandala Patterns with improved animations */}
        <div className="absolute top-10 right-10 w-40 h-40 border-4 border-primary/40 rounded-full shadow-glow animate-float">
          <div className="absolute inset-4 border-2 border-accent/60 rounded-full">
            <div className="absolute inset-4 border-2 border-primary/70 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-healing rounded-full shadow-elevated animate-gentle-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-20 left-10 w-32 h-32 border-4 border-sage-300/60 rounded-full shadow-glow animate-float" style={{animationDelay: '2s'}}>
          <div className="absolute inset-3 border-2 border-earth-400/60 rounded-full">
            <div className="absolute inset-3 border-2 border-accent/70 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 gradient-sunrise rounded-full shadow-elevated animate-gentle-pulse"></div>
            </div>
          </div>
        </div>

        {/* Sacred geometry patterns */}
        <div className="absolute top-1/3 left-1/3 w-24 h-24 opacity-30 animate-float" style={{animationDelay: '1s'}}>
          <div className="absolute inset-0 bg-gradient-sage rounded-full transform rotate-0" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}></div>
        </div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Enhanced Sidebar */}
        <div className="w-72 card-elevated border-r border-border/50 backdrop-blur-xl">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Leaf className="w-8 h-8 text-primary drop-shadow-sm" />
                <div className="absolute -top-1 -right-1 w-4 h-4 gradient-healing rounded-full animate-gentle-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-playfair font-semibold text-foreground">AyurTech</h1>
                <p className="text-lg font-playfair text-accent font-medium">Pro</p>
              </div>
            </div>
            <div className="text-center">
              <h2 className="font-playfair text-xl font-medium text-foreground mb-1">{getUserTitle()}</h2>
              {userProfile && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-primary">{userProfile.full_name}</p>
                  <Badge className="status-active text-xs">{userProfile.unique_id}</Badge>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {getNavItems().map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 hover-scale group ${
                    activeTab === item.id 
                      ? 'gradient-healing text-primary-foreground shadow-elevated' 
                      : 'hover:bg-sage-100/50 hover:shadow-gentle text-foreground'
                  }`}
                >
                  <item.icon className={`h-5 w-5 transition-colors ${
                    activeTab === item.id ? 'text-primary-foreground' : 'text-primary group-hover:text-primary'
                  }`} />
                  <span className="font-medium flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge className="bg-destructive text-destructive-foreground text-xs animate-gentle-pulse">
                      {item.badge}
                    </Badge>
                  )}
                </motion.button>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-border/50">
            <Button
              onClick={onLogout}
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-6"
            >
              {activeTab === "overview" && (
                <>
                  {userType === "patient" && <PatientDashboard displayName={userProfile?.full_name} />}
                  {userType === "doctor" && <DoctorDashboard displayName={userProfile?.full_name} />}
                  {userType === "therapist" && <TherapistDashboard displayName={userProfile?.full_name} />}
                  {userType === "practitioner" && <DoctorDashboard displayName={userProfile?.full_name} />}
                  {(userType === "admin" || userType === "administrator") && <AdminDashboard />}
                </>
              )}

              {activeTab === "schedule" && (
                <Card className="card-elevated p-8">
                  <h2 className="text-2xl font-playfair font-semibold mb-6 text-foreground">Schedule Management</h2>
                  <SchedulingInterface userType={userType} />
                </Card>
              )}

              {activeTab === "notifications" && (
                <Card className="card-elevated p-8">
                  <h2 className="text-2xl font-playfair font-semibold mb-6 text-foreground">Notifications</h2>
                  <NotificationCenter onMarkAsRead={() => setNotifications(prev => Math.max(0, prev - 1))} />
                </Card>
              )}

              {activeTab === "progress" && (
                <Card className="card-elevated p-8">
                  <h2 className="text-2xl font-playfair font-semibold mb-6 text-foreground">Progress Tracking</h2>
                  <p className="text-muted-foreground">Detailed progress tracking coming soon...</p>
                </Card>
              )}

              {activeTab === "patients" && (
                <Card className="card-elevated p-8">
                  <h2 className="text-2xl font-playfair font-semibold mb-6 text-foreground">Patient Management</h2>
                  <p className="text-muted-foreground">Patient management interface coming soon...</p>
                </Card>
              )}

              {activeTab === "analytics" && (
                <Card className="card-elevated p-8">
                  <h2 className="text-2xl font-playfair font-semibold mb-6 text-foreground">Analytics Dashboard</h2>
                  <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
                </Card>
              )}

              {activeTab === "users" && (
                <Card className="card-elevated p-8">
                  <h2 className="text-2xl font-playfair font-semibold mb-6 text-foreground">User Management</h2>
                  <p className="text-muted-foreground">User management interface coming soon...</p>
                </Card>
              )}

              {activeTab === "settings" && (
                <Card className="card-elevated p-8">
                  <h2 className="text-2xl font-playfair font-semibold mb-6 text-foreground">System Settings</h2>
                  <p className="text-muted-foreground">Settings panel coming soon...</p>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>  
    </div>
  );
};
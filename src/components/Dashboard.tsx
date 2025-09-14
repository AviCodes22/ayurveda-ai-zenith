import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { PractitionerDashboard } from "@/components/PractitionerDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { SchedulingInterface } from "@/components/SchedulingInterface";
import { TherapyPreview3D } from "@/components/TherapyPreview3D";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background relative overflow-hidden">
      {/* Traditional Indian Background Patterns */}
      <div className="absolute inset-0 opacity-25">
        {/* Mandala Patterns */}
        <div className="absolute top-10 right-10 w-40 h-40 border-4 border-primary/60 rounded-full shadow-glow animate-pulse">
          <div className="absolute inset-4 border-2 border-accent/80 rounded-full">
            <div className="absolute inset-4 border-2 border-primary rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-accent rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-20 left-10 w-32 h-32 border-4 border-accent/70 rounded-full shadow-glow animate-pulse delay-500">
          <div className="absolute inset-3 border-2 border-primary/80 rounded-full">
            <div className="absolute inset-3 border-2 border-accent rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-primary rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Sanskrit Om Symbol Background */}
        <div className="absolute top-1/2 left-1/6 text-6xl text-primary/25 font-bold select-none animate-pulse delay-800">ॐ</div>
        
        {/* Paisley Patterns */}
        <div className="absolute top-3/4 right-1/4 w-16 h-24 bg-accent/60 rounded-full transform rotate-45 opacity-50 shadow-lg animate-pulse delay-700" 
             style={{borderRadius: '50% 50% 50% 0'}}></div>

        {/* Traditional Border Elements */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-lg"></div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-accent/40 to-transparent shadow-lg"></div>
        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-b from-transparent via-primary/40 to-transparent shadow-lg"></div>
        <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-b from-transparent via-accent/40 to-transparent shadow-lg"></div>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40 relative">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-primary drop-shadow-sm" />
            <div>
              <h1 className="text-xl font-bold text-primary">AyurTech Pro</h1>
              <p className="text-sm text-muted-foreground">{getUserTitle()}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{userProfile?.full_name || "User"}</p>
              <p className="text-xs text-muted-foreground">ID: {userProfile?.unique_id || "N/A"}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
              className="border-primary/30 bg-card/50 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-border bg-card/80 backdrop-blur-sm min-h-[calc(100vh-73px)] relative z-10">
          <nav className="p-4">
            {getNavItems().map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={`w-full justify-start mb-2 ${
                  activeTab === item.id 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "hover:bg-muted"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 relative z-10">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <>
                {userType === "patient" && <PatientDashboard />}
                {(userType === "practitioner" || userType === "doctor") && <PractitionerDashboard />}
                {(userType === "admin" || userType === "administrator") && <AdminDashboard />}
              </>
            )}
            {activeTab === "schedule" && <SchedulingInterface userType={userType} />}
            {activeTab === "therapy" && <TherapyPreview3D />}
            {activeTab === "notifications" && (
              <NotificationCenter 
                onMarkAsRead={() => setNotifications(0)} 
              />
            )}
            {activeTab === "progress" && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Therapy Progress</h2>
                <p className="text-muted-foreground">Progress tracking coming soon...</p>
              </Card>
            )}
            {activeTab === "patients" && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Patient Management</h2>
                <p className="text-muted-foreground">Patient management interface coming soon...</p>
              </Card>
            )}
            {activeTab === "analytics" && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">System Analytics</h2>
                <p className="text-muted-foreground">Advanced analytics dashboard coming soon...</p>
              </Card>
            )}
            {activeTab === "users" && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">User Management</h2>
                <p className="text-muted-foreground">User management interface coming soon...</p>
              </Card>
            )}
            {activeTab === "settings" && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">System Settings</h2>
                <p className="text-muted-foreground">Settings panel coming soon...</p>
              </Card>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
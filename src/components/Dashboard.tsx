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

interface DashboardProps {
  userType: string;
  onLogout: () => void;
}

export const Dashboard = ({ userType, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(3);

  const getUserTitle = () => {
    switch (userType) {
      case "patient": return "Patient Portal";
      case "practitioner": return "Practitioner Dashboard";
      case "admin": return "Admin Console";
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
    } else if (userType === "practitioner") {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary">AyurTech Pro</h1>
              <p className="text-sm text-muted-foreground">{getUserTitle()}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium capitalize">{userType} User</p>
              <p className="text-xs text-muted-foreground">Demo Mode</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
              className="hover:bg-destructive hover:text-destructive-foreground"
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
        <aside className="w-64 border-r border-border bg-card/30 min-h-[calc(100vh-73px)]">
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
        <main className="flex-1 p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <>
                {userType === "patient" && <PatientDashboard />}
                {userType === "practitioner" && <PractitionerDashboard />}
                {userType === "admin" && <AdminDashboard />}
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
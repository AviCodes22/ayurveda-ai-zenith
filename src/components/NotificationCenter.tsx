import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Calendar, 
  Heart, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  X,
  Settings,
  Filter
} from "lucide-react";
import { toast } from "sonner";

interface NotificationCenterProps {
  onMarkAsRead: () => void;
}

interface Notification {
  id: string;
  type: "appointment" | "health" | "system" | "reminder";
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  action?: {
    label: string;
    onClick: () => void;
  };
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "appointment",
    title: "Upcoming Panchakarma Session",
    message: "Your detox therapy is scheduled for tomorrow at 10:00 AM with Dr. Sharma",
    time: "2 hours ago",
    read: false,
    priority: "high",
    action: {
      label: "Reschedule",
      onClick: () => toast.success("Redirecting to scheduling...")
    }
  },
  {
    id: "2", 
    type: "health",
    title: "Progress Milestone Achieved",
    message: "Congratulations! You've completed 75% of your Abhyanga therapy program",
    time: "4 hours ago",
    read: false,
    priority: "medium"
  },
  {
    id: "3",
    type: "system", 
    title: "Security Update Complete",
    message: "Your patient data is now protected with the latest DPDP 2023 compliance updates",
    time: "1 day ago",
    read: true,
    priority: "low"
  },
  {
    id: "4",
    type: "reminder",
    title: "Pre-therapy Preparation",
    message: "Remember to fast for 8 hours before your Vamana therapy session",
    time: "2 days ago",
    read: false, 
    priority: "high",
    action: {
      label: "Set Reminder",
      onClick: () => toast.success("Reminder set successfully!")
    }
  },
  {
    id: "5",
    type: "health",
    title: "Weekly Health Report",
    message: "Your wellness score improved by 15% this week. Great progress!",
    time: "3 days ago",
    read: true,
    priority: "medium"
  }
];

export const NotificationCenter = ({ onMarkAsRead }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const getIcon = (type: string) => {
    switch (type) {
      case "appointment": return Calendar;
      case "health": return Heart;
      case "system": return Shield;
      case "reminder": return Bell;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const filterNotifications = (filter: string) => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === filter);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    onMarkAsRead();
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification deleted");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">Stay updated with your therapy progress and appointments</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Notification Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="appointment">Appointments</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="reminder">Reminders</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-3">
              <AnimatePresence>
                {filterNotifications(activeTab).map((notification) => {
                  const Icon = getIcon(notification.type);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                        !notification.read ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${
                          notification.type === "appointment" ? "bg-primary/10" :
                          notification.type === "health" ? "bg-success/10" :
                          notification.type === "system" ? "bg-accent/10" :
                          "bg-warning/10"
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            notification.type === "appointment" ? "text-primary" :
                            notification.type === "health" ? "text-success" :
                            notification.type === "system" ? "text-accent" :
                            "text-warning"
                          }`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {notification.time}
                                </span>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getPriorityColor(notification.priority)}`}
                                >
                                  {notification.priority}
                                </Badge>
                                {!notification.read && (
                                  <Badge variant="default" className="text-xs">
                                    New
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {notification.action && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={notification.action.onClick}
                                >
                                  {notification.action.label}
                                </Button>
                              )}
                              {!notification.read && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filterNotifications(activeTab).length === 0 && (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    {activeTab === "unread" 
                      ? "You're all caught up! No unread notifications."
                      : "You don't have any notifications in this category."
                    }
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Appointment Reminders</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Health Progress Updates</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">System Notifications</span>
              <Badge variant="outline">Disabled</Badge>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Notifications</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">SMS Alerts</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Push Notifications</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
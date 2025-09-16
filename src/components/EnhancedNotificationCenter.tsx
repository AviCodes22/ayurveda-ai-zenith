import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Check, 
  X, 
  Settings as SettingsIcon, 
  Calendar, 
  Heart, 
  AlertTriangle, 
  MessageSquare,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  CheckCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

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

interface NotificationPreferences {
  appointment_reminders: boolean;
  therapy_updates: boolean;
  system_notifications: boolean;
  payment_alerts: boolean;
  wellness_reports: boolean;
}

export const EnhancedNotificationCenter = ({ onMarkAsRead }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    appointment_reminders: true,
    therapy_updates: true,
    system_notifications: true,
    payment_alerts: true,
    wellness_reports: true,
  });
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadPreferences();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      // Generate sample notifications with realistic data
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          type: 'appointment',
          title: 'Upcoming Appointment',
          message: 'Your Abhyanga therapy session is scheduled for tomorrow at 10:00 AM',
          time: '2 hours ago',
          read: false,
          priority: 'high',
          action: {
            label: 'View Details',
            onClick: () => console.log('View appointment details')
          }
        },
        {
          id: '2',
          type: 'health',
          title: 'Wellness Report Ready',
          message: 'Your weekly wellness analysis shows significant improvement in energy levels',
          time: '1 day ago',
          read: false,
          priority: 'medium'
        },
        {
          id: '3',
          type: 'system',
          title: 'New Feature Available',
          message: 'AI-powered therapy scheduling is now available for enhanced wellness planning',
          time: '2 days ago',
          read: true,
          priority: 'low'
        },
        {
          id: '4',
          type: 'reminder',
          title: 'Feedback Pending',
          message: 'Please provide feedback for your recent Panchakarma session',
          time: '3 days ago',
          read: false,
          priority: 'medium',
          action: {
            label: 'Give Feedback',
            onClick: () => console.log('Open feedback form')
          }
        },
        {
          id: '5',
          type: 'appointment',
          title: 'Payment Confirmation',
          message: 'Payment of ₹2,500 for Yoga Therapy session has been processed successfully',
          time: '1 week ago',
          read: true,
          priority: 'low'
        }
      ];
      
      setNotifications(sampleNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
        return;
      }

      if (data) {
        setPreferences({
          appointment_reminders: data.appointment_reminders,
          therapy_updates: data.therapy_updates,
          system_notifications: data.system_notifications,
          payment_alerts: data.payment_alerts,
          wellness_reports: data.wellness_reports,
        });
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const updatePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user?.id,
          ...newPreferences
        });

      if (error) throw error;

      setPreferences(newPreferences);
      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved",
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive",
      });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment': return Calendar;
      case 'health': return Heart;
      case 'system': return AlertTriangle;
      case 'reminder': return MessageSquare;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filterNotifications = (filter: string) => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === filter);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { ...notification, read: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    onMarkAsRead();
    toast({
      title: "All notifications marked as read",
      description: "Your notification list has been updated",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast({
      title: "Notification deleted",
      description: "The notification has been removed",
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filterNotifications(activeFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t('nav.notifications')}
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="appointment">Appointments</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="reminder">Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  {activeFilter === 'unread' 
                    ? "You're all caught up! No unread notifications."
                    : `No ${activeFilter === 'all' ? '' : activeFilter} notifications found.`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredNotifications.map((notification) => {
                  const Icon = getIcon(notification.type);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -300 }}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        notification.read 
                          ? 'bg-muted/30 border-border' 
                          : 'bg-card border-primary/20 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${
                          notification.read ? 'bg-muted' : 'bg-primary/10'
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            notification.read ? 'text-muted-foreground' : 'text-primary'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-semibold ${
                              notification.read ? 'text-muted-foreground' : 'text-foreground'
                            }`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {!notification.read && (
                                    <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                      <Check className="h-4 w-4 mr-2" />
                                      Mark as read
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem 
                                    onClick={() => deleteNotification(notification.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          
                          <p className={`text-sm mb-2 ${
                            notification.read ? 'text-muted-foreground' : 'text-foreground'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                            
                            {notification.action && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={notification.action.onClick}
                                className="text-xs"
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(preferences).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={key} className="text-sm font-medium">
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Label>
              <Switch
                id={key}
                checked={value}
                onCheckedChange={(checked) => {
                  const newPreferences = { ...preferences, [key]: checked };
                  updatePreferences(newPreferences);
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
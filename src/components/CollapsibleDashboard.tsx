import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar,
  TrendingUp,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Activity,
  Heart,
  Stethoscope
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PatientDashboard } from './PatientDashboard';
import { DoctorDashboard } from './DoctorDashboard';
import { TherapistDashboard } from './TherapistDashboard';
import { AdminDashboard } from './AdminDashboard';
import { EnhancedSchedulingInterface } from './EnhancedSchedulingInterface';
import { ScientificProgressDashboard } from './ScientificProgressDashboard';
import { FeedbackSystem } from './FeedbackSystem';
import { EnhancedNotificationCenter } from './EnhancedNotificationCenter';
import { CurrentPatients } from './CurrentPatients';
import { MySchedule } from './MySchedule';
import { MyAnalytics } from './MyAnalytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';

interface UserProfile {
  unique_id: string;
  full_name: string;
  role: 'patient' | 'doctor' | 'therapist';
}

interface CollapsibleDashboardProps {
  userType: string;
  onLogout: () => void;
  userProfile?: UserProfile;
}

const AppSidebar = ({ 
  userType, 
  userProfile, 
  activeTab, 
  setActiveTab, 
  onLogout 
}: {
  userType: string;
  userProfile?: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}) => {
  const { state } = useSidebar();
  const { t } = useLanguage();
  const collapsed = state === 'collapsed';

  const getUserTitle = (type: string) => {
    switch (type) {
      case 'patient': return t('dashboard.patient');
      case 'doctor': return t('dashboard.doctor');
      case 'therapist': return t('dashboard.therapist');
      default: return 'Dashboard';
    }
  };

  const getNavItems = (userType: string) => {
    const commonItems = [
      { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
      { id: 'notifications', label: t('nav.notifications'), icon: Bell }
    ];

    const userSpecificItems = {
      patient: [
        { id: 'schedule', label: t('nav.schedule'), icon: Calendar },
        { id: 'progress', label: t('nav.progress'), icon: TrendingUp },
        { id: 'feedback', label: t('nav.feedback'), icon: MessageSquare }
      ],
      doctor: [
        { id: 'patients', label: 'My Patients', icon: User },
        { id: 'schedule', label: 'My Schedule', icon: Calendar },
        { id: 'analytics', label: 'Analytics', icon: Activity }
      ],
      therapist: [
        { id: 'patients', label: 'My Patients', icon: User },
        { id: 'schedule', label: 'My Schedule', icon: Calendar },
        { id: 'treatments', label: 'Treatments', icon: Heart }
      ]
    };

    return [
      ...commonItems.slice(0, 1), // Dashboard first
      ...(userSpecificItems[userType as keyof typeof userSpecificItems] || []),
      ...commonItems.slice(1) // Notifications last
    ];
  };

  const navItems = getNavItems(userType);

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-gradient-elegant border-r border-border/50">
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-primary" />
              {!collapsed && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    AyurTech Pro
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {getUserTitle(userType)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Profile */}
        {userProfile && (
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {userProfile.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {userProfile.full_name}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {userProfile.unique_id}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <SidebarGroup className="flex-1">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      transition-all duration-200 
                      ${activeTab === item.id 
                        ? 'bg-primary/15 text-primary border-r-2 border-primary' 
                        : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    {!collapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <div className="p-4 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-2">{t('nav.logout')}</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export const CollapsibleDashboard = ({ userType, onLogout, userProfile }: CollapsibleDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (userType === 'patient') return <PatientDashboard />;
        if (userType === 'doctor') return <DoctorDashboard displayName={userProfile?.full_name} />;
        if (userType === 'therapist') return <TherapistDashboard displayName={userProfile?.full_name} />;
        return <PatientDashboard />;
      
      case 'schedule':
        if (userType === 'patient') {
          return <EnhancedSchedulingInterface />;
        } else {
          return <MySchedule />;
        }
      
      case 'patients':
        // Handle "My Patients" tab for doctors and therapists
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">My Patients</h2>
            <CurrentPatients />
          </div>
        );
      
      case 'analytics':
        return <MyAnalytics />;
      
      case 'treatments':
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Treatments</h2>
            <p className="text-muted-foreground">Available treatments and therapy options will be displayed here.</p>
          </Card>
        );
      
      case 'progress':
        return <ScientificProgressDashboard />;
      
      case 'feedback':
        return <FeedbackSystem />;
      
      case 'notifications':
        return <EnhancedNotificationCenter onMarkAsRead={() => {}} />;
      
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-elegant">
        {/* Global Header with Trigger */}
        <div className="fixed top-0 left-0 right-0 h-12 bg-card/80 backdrop-blur-sm border-b border-border/50 flex items-center px-4 z-50">
          <SidebarTrigger className="hover:bg-accent/50" />
          <div className="ml-4 flex items-center gap-2">
            <Stethoscope className="h-7 w-7 text-primary" />
            <span className="font-semibold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">AyurTech Pro</span>
          </div>
        </div>

        {/* Sidebar */}
        <AppSidebar
          userType={userType}
          userProfile={userProfile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
        />

        {/* Main Content */}
        <main className="flex-1 pt-12">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
};
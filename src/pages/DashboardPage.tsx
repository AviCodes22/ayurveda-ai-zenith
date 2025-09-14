import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Dashboard } from '@/components/Dashboard';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface UserProfile {
  unique_id: string;
  full_name: string;
  role: 'patient' | 'doctor' | 'administrator';
}

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('unique_id, full_name, role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          navigate('/login');
          return;
        }

        if (!data) {
          console.error('No profile found');
          navigate('/login');
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error('Unexpected error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/');
    }
  };

  if (authLoading || loading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center relative overflow-hidden">
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
        
        {/* Traditional Border Elements */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-lg"></div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-accent/40 to-transparent shadow-lg"></div>
        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-b from-transparent via-primary/40 to-transparent shadow-lg"></div>
        <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-b from-transparent via-accent/40 to-transparent shadow-lg"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="border-primary/20 shadow-elevated bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Loading Dashboard</h2>
            <p className="text-sm text-muted-foreground">Please wait while we prepare your wellness portal...</p>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <Dashboard 
        userType={profile.role} 
        onLogout={handleLogout}
        userProfile={profile}
      />
    </motion.div>
  );
};

export default DashboardPage;
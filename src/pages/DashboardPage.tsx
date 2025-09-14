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
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-primary/10 shadow-elevated bg-card/80 backdrop-blur-sm">
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
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Stethoscope, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const ImprovedLoginSystem = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!uniqueId.trim()) {
      errors.uniqueId = 'Unique ID is required';
    } else if (uniqueId.length < 4) {
      errors.uniqueId = 'Unique ID must be at least 4 characters';
    }
    
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Starting login process for:', uniqueId);

      // Step 1: Get email from unique ID
      const { data: emailData, error: emailError } = await supabase
        .rpc('get_email_by_unique_id', { p_unique_id: uniqueId });

      if (emailError) {
        console.error('Error getting email:', emailError);
        throw new Error('Failed to validate credentials. Please check your Unique ID.');
      }

      if (!emailData) {
        console.error('No email found for unique ID:', uniqueId);
        throw new Error('Invalid Unique ID. Please check and try again.');
      }

      console.log('Email retrieved successfully');

      // Step 2: Sign in with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: emailData,
        password: password,
      });

      if (authError) {
        console.error('Authentication error:', authError);
        
        // Provide user-friendly error messages
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Invalid password. Please check your password and try again.');
        } else if (authError.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before logging in.');
        } else if (authError.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a few minutes and try again.');
        } else {
          throw new Error('Login failed. Please check your credentials and try again.');
        }
      }

      if (!authData.user) {
        throw new Error('Login failed. Please try again.');
      }

      console.log('User authenticated successfully');

      // Step 3: Verify user profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('unique_id, full_name, role')
        .eq('user_id', authData.user.id)
        .maybeSingle();

      if (profileError || !profileData) {
        console.error('Profile verification error:', profileError);
        throw new Error('User profile not found. Please contact support.');
      }

      console.log('Profile verified:', profileData.unique_id);

      // Success notification
      toast({
        title: "Login successful!",
        description: `Welcome back, ${profileData.full_name}!`,
        duration: 3000,
      });

      // Navigate to dashboard
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
      
      toast({
        title: "Login failed",
        description: error.message || 'Please check your credentials and try again.',
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-elegant flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-32 h-32 border-2 border-primary rounded-full animate-pulse" />
        <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-accent rounded-full animate-pulse delay-500" />
        <div className="absolute top-1/2 left-1/4 text-4xl text-primary/30 font-bold select-none">ॐ</div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-elegant bg-card/95 backdrop-blur-sm border-border/50">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center items-center gap-3">
              <Stethoscope className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  AyurTech Pro
                </h1>
                <p className="text-sm text-muted-foreground">
                  Ayurvedic Wellness Platform
                </p>
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Welcome Back
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="uniqueId" className="text-sm font-medium">
                  Unique ID
                </Label>
                <Input
                  id="uniqueId"
                  type="text"
                  value={uniqueId}
                  onChange={(e) => {
                    setUniqueId(e.target.value);
                    if (validationErrors.uniqueId) {
                      setValidationErrors(prev => ({...prev, uniqueId: ''}));
                    }
                  }}
                  placeholder="Enter your unique ID (e.g., PAT0001)"
                  className={`transition-colors ${
                    validationErrors.uniqueId 
                      ? 'border-destructive focus:ring-destructive' 
                      : 'border-border focus:ring-primary'
                  }`}
                  disabled={isLoading}
                />
                {validationErrors.uniqueId && (
                  <p className="text-sm text-destructive">{validationErrors.uniqueId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (validationErrors.password) {
                        setValidationErrors(prev => ({...prev, password: ''}));
                      }
                    }}
                    placeholder="Enter your password"
                    className={`pr-10 transition-colors ${
                      validationErrors.password 
                        ? 'border-destructive focus:ring-destructive' 
                        : 'border-border focus:ring-primary'
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-destructive">{validationErrors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-primary hover:text-primary-light font-medium transition-colors"
                >
                  Register here
                </Link>
              </p>
              <div className="text-xs text-muted-foreground">
                <p>Demo Credentials:</p>
                <p>ID: PAT0001, Password: patient123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
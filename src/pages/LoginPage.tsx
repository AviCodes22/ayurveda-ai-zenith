import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { Leaf, Heart, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const [uniqueId, setUniqueId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, get the user's email from their unique_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('unique_id', uniqueId)
        .maybeSingle();

      if (profileError || !profileData) {
        toast({
          title: "Login Failed",
          description: "Invalid unique ID. Please check your credentials.",
          variant: "destructive"
        });
        return;
      }

      // Get the user's email from auth.users
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profileData.user_id);
      
      if (userError || !userData.user?.email) {
        toast({
          title: "Login Failed", 
          description: "Unable to find user account. Please contact support.",
          variant: "destructive"
        });
        return;
      }

      // Sign in with email and password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: password
      });

      if (signInError) {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please check your password.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Welcome Back!",
        description: "You have successfully logged in.",
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Leaf className="w-10 h-10 text-primary" />
              <Heart className="w-5 h-5 text-accent absolute -top-1 -right-1" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-gradient-healing bg-clip-text text-transparent">
                AyurTech
              </h1>
              <p className="text-xl font-semibold text-accent">Pro</p>
            </div>
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="border-primary/10 shadow-elevated bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to access your wellness dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="uniqueId" className="text-sm font-medium text-foreground">
                    Unique ID
                  </Label>
                  <Input
                    id="uniqueId"
                    type="text"
                    placeholder="Enter your unique ID (e.g., PAT0001)"
                    value={uniqueId}
                    onChange={(e) => setUniqueId(e.target.value)}
                    className="border-primary/20 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-primary/20 focus:border-primary focus:ring-primary/20 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-healing hover:shadow-glow transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Are you a{" "}
                  <Link 
                    to="/register" 
                    className="text-accent hover:text-accent/80 font-medium underline-offset-4 hover:underline transition-colors"
                  >
                    new user?
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
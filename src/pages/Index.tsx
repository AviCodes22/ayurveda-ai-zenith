import { useState } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { Dashboard } from "@/components/Dashboard";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const handleLogin = (userType: string) => {
    setCurrentUser(userType);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {!currentUser ? (
        <>
          <HeroSection onGetStarted={() => setShowAuth(true)} />
          <AuthModal 
            isOpen={showAuth} 
            onClose={() => setShowAuth(false)}
            onLogin={handleLogin}
          />
        </>
      ) : (
        <Dashboard userType={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
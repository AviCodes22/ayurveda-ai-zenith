import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Leaf, Heart } from "lucide-react";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="flex items-center gap-3 p-6 rounded-2xl bg-card border border-primary/20 shadow-elevated backdrop-blur-sm">
            <div className="relative">
              <Leaf className="w-12 h-12 text-primary drop-shadow-sm" />
              <Heart className="w-6 h-6 text-accent absolute -top-1 -right-1 drop-shadow-sm" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-primary">
                AyurTech
              </h1>
              <p className="text-2xl font-semibold text-accent">Pro</p>
            </div>
          </div>
        </motion.div>

        {/* Welcome Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-12"
        >
          <div className="bg-card/80 backdrop-blur-sm border border-primary/10 rounded-2xl p-8 shadow-elevated">
            <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed mb-4">
              "आयुर्वेदः अमृतानां वेदः"
            </blockquote>
            <p className="text-lg text-muted-foreground italic">
              "Ayurveda is the science of life and longevity"
            </p>
            <div className="mt-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            <p className="text-base text-muted-foreground mt-4">
              Welcome to the future of traditional healing. Where ancient wisdom meets modern technology 
              to provide personalized Panchakarma treatments and holistic wellness solutions.
            </p>
          </div>
        </motion.div>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button
            onClick={() => navigate('/login')}
            className="px-12 py-4 text-lg font-semibold bg-gradient-healing hover:shadow-glow transition-all duration-300 rounded-2xl"
            size="lg"
          >
            Begin Your Wellness Journey
          </Button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/3 right-16 w-32 h-32 bg-accent/5 rounded-full blur-2xl"></div>
          <div className="absolute top-3/4 left-1/4 w-16 h-16 bg-secondary/5 rounded-full blur-lg"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
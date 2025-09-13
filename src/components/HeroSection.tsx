import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Calendar, BarChart3, Shield, Sparkles, Zap } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const features = [
    {
      icon: Calendar,
      title: "AI-Powered Scheduling",
      description: "Automated Panchakarma therapy optimization with 50% efficiency boost"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Patient progress tracking with predictive health insights"
    },
    {
      icon: Shield,
      title: "AYUSH Compliant",
      description: "Full compliance with DPDP 2023 and medical regulations"
    },
    {
      icon: Sparkles,
      title: "3D Therapy Preview",
      description: "Immersive visualization of Panchakarma procedures"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
      
      {/* Hero Content */}
      <div className="relative px-6 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              AyurTech Pro
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            Revolutionary Panchakarma Patient Management & Therapy Scheduling Platform
          </p>
          
          <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
            Empowering the $16B Ayurveda market with AI-driven patient care, 
            real-time tracking, and immersive therapy previews
          </p>

          <div className="flex gap-4 justify-center">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary-glow text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg border-primary/20 hover:bg-primary/5"
            >
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/20">
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-primary">50%</div>
            <div className="text-muted-foreground">Efficiency Boost</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">30%</div>
            <div className="text-muted-foreground">Better Outcomes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-muted-foreground">AYUSH Compliant</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Leaf, Heart } from "lucide-react";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-6 relative overflow-hidden">
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

        {/* Lotus Petals */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 opacity-60 animate-pulse delay-300">
          <div className="absolute inset-0 bg-primary/70 rounded-full transform rotate-0" style={{clipPath: 'ellipse(50% 80% at 50% 100%)'}}></div>
          <div className="absolute inset-0 bg-primary/70 rounded-full transform rotate-45" style={{clipPath: 'ellipse(50% 80% at 50% 100%)'}}></div>
          <div className="absolute inset-0 bg-primary/70 rounded-full transform rotate-90" style={{clipPath: 'ellipse(50% 80% at 50% 100%)'}}></div>
          <div className="absolute inset-0 bg-primary/70 rounded-full transform rotate-135" style={{clipPath: 'ellipse(50% 80% at 50% 100%)'}}></div>
        </div>

        {/* Paisley Patterns */}
        <div className="absolute top-3/4 right-1/4 w-16 h-24 bg-accent/60 rounded-full transform rotate-45 opacity-50 shadow-lg animate-pulse delay-700" 
             style={{borderRadius: '50% 50% 50% 0'}}></div>
        <div className="absolute top-1/3 right-1/3 w-12 h-18 bg-primary/60 rounded-full transform -rotate-30 opacity-50 shadow-lg animate-pulse delay-1000" 
             style={{borderRadius: '50% 50% 50% 0'}}></div>

        {/* Traditional Geometric Patterns */}
        <div className="absolute bottom-1/4 right-1/5 w-20 h-20 border-2 border-primary/60 transform rotate-45 opacity-40 animate-pulse delay-200">
          <div className="absolute inset-2 border-2 border-accent/70 transform -rotate-45">
            <div className="absolute inset-1 bg-primary/30 transform rotate-45 shadow-inner"></div>
          </div>
        </div>

        {/* Sanskrit Om Symbol Background */}
        <div className="absolute top-1/2 left-1/6 text-6xl text-primary/25 font-bold select-none animate-pulse delay-800">ॐ</div>
        
        {/* Herbal Leaf Patterns */}
        <div className="absolute bottom-1/3 left-2/3 opacity-40 animate-pulse delay-600">
          <div className="w-8 h-12 bg-primary/60 rounded-full transform -rotate-12 shadow-lg" style={{borderRadius: '50% 100% 50% 100%'}}></div>
          <div className="w-6 h-10 bg-accent/60 rounded-full transform rotate-45 -mt-6 ml-2 shadow-lg" style={{borderRadius: '50% 100% 50% 100%'}}></div>
          <div className="w-4 h-8 bg-primary/50 rounded-full transform -rotate-30 -mt-4 ml-1 shadow-lg" style={{borderRadius: '50% 100% 50% 100%'}}></div>
        </div>

        {/* Traditional Border Elements */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-primary/40 to-transparent shadow-lg"></div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-accent/40 to-transparent shadow-lg"></div>
        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-b from-transparent via-primary/40 to-transparent shadow-lg"></div>
        <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-b from-transparent via-accent/40 to-transparent shadow-lg"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-2xl mx-auto relative z-10"
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
            className="px-12 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated hover:shadow-glow transition-all duration-300 rounded-2xl border border-primary/20"
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
          <div className="absolute top-1/4 left-10 w-24 h-24 bg-primary/15 rounded-full blur-xl animate-pulse shadow-glow"></div>
          <div className="absolute bottom-1/3 right-16 w-36 h-36 bg-accent/15 rounded-full blur-2xl animate-pulse delay-1000 shadow-glow"></div>
          <div className="absolute top-3/4 left-1/4 w-20 h-20 bg-secondary/15 rounded-full blur-lg animate-pulse delay-500 shadow-glow"></div>
          <div className="absolute top-1/6 right-1/3 w-16 h-16 bg-primary-glow/20 rounded-full blur-lg animate-pulse delay-300"></div>
          <div className="absolute bottom-1/6 left-1/3 w-28 h-28 bg-secondary-deep/10 rounded-full blur-xl animate-pulse delay-700"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
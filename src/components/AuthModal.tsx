import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, User, UserCheck, Stethoscope } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userType: string) => void;
}

export const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const userTypes = [
    {
      type: "patient",
      title: "Patient",
      description: "Access your therapy schedules and progress",
      icon: User,
      color: "from-primary to-primary-light"
    },
    {
      type: "practitioner", 
      title: "Practitioner",
      description: "Manage patients and therapy sessions",
      icon: UserCheck,
      color: "from-secondary to-accent"
    },
    {
      type: "therapist",
      title: "Therapist",
      description: "Specialized therapy sessions and treatments",
      icon: Stethoscope,
      color: "from-accent to-secondary-deep"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-card rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-primary/10"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Welcome to AyurTech Pro
              </h2>
              <p className="text-muted-foreground">Choose your role to continue</p>
            </div>

            <div className="grid gap-4">
              {userTypes.map((user) => (
                <motion.div
                  key={user.type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30"
                    onClick={() => onLogin(user.type)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full bg-gradient-to-br ${user.color} text-white`}>
                        <user.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{user.title}</h3>
                        <p className="text-muted-foreground text-sm">{user.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Demo mode - Click any role to explore the platform</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
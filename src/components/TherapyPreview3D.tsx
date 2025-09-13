import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box, Sphere, Cylinder } from "@react-three/drei";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, Info, Volume2 } from "lucide-react";
import { toast } from "sonner";

// 3D Therapy Room Component
function TherapyRoom({ therapy }: { therapy: string }) {
  const meshRef = useRef<any>();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  const getRoomColor = () => {
    switch (therapy) {
      case "panchakarma": return "#22c55e";
      case "abhyanga": return "#f59e0b";
      case "shirodhara": return "#3b82f6";
      case "basti": return "#8b5cf6";
      default: return "#22c55e";
    }
  };

  return (
    <group>
      {/* Room Floor */}
      <Box
        position={[0, -2, 0]}
        args={[8, 0.2, 8]}
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={hovered ? "#4ade80" : "#16a34a"} />
      </Box>

      {/* Therapy Bed/Table */}
      <Box position={[0, -1, 0]} args={[3, 0.5, 1.5]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>

      {/* Therapy Equipment */}
      {therapy === "shirodhara" && (
        <Cylinder position={[0, 2, 0]} args={[0.1, 0.1, 3]}>
          <meshStandardMaterial color="#fbbf24" />
        </Cylinder>
      )}

      {therapy === "abhyanga" && (
        <>
          <Sphere position={[-2, 0, 0]} args={[0.3]}>
            <meshStandardMaterial color="#f59e0b" />
          </Sphere>
          <Sphere position={[2, 0, 0]} args={[0.3]}>
            <meshStandardMaterial color="#f59e0b" />
          </Sphere>
        </>
      )}

      {/* Ambient Elements */}
      <Text
        position={[0, 3, -3]}
        fontSize={0.5}
        color={getRoomColor()}
        anchorX="center"
        anchorY="middle"
      >
        {therapy.charAt(0).toUpperCase() + therapy.slice(1)} Therapy
      </Text>

      {/* Lighting */}
      <pointLight position={[2, 4, 2]} intensity={0.5} color="#fbbf24" />
      <pointLight position={[-2, 4, 2]} intensity={0.5} color="#60a5fa" />
    </group>
  );
}

// Loading Component
function Loader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading 3D Environment...</p>
      </div>
    </div>
  );
}

export const TherapyPreview3D = () => {
  const [selectedTherapy, setSelectedTherapy] = useState("panchakarma");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const therapies = [
    {
      id: "panchakarma",
      name: "Panchakarma Detox",
      description: "Complete purification and rejuvenation therapy",
      duration: "90 minutes",
      benefits: ["Deep detoxification", "Improved circulation", "Mental clarity"]
    },
    {
      id: "abhyanga", 
      name: "Abhyanga Massage",
      description: "Full-body warm oil massage therapy",
      duration: "60 minutes",
      benefits: ["Muscle relaxation", "Skin nourishment", "Stress relief"]
    },
    {
      id: "shirodhara",
      name: "Shirodhara Treatment", 
      description: "Continuous oil pouring on forehead",
      duration: "45 minutes",
      benefits: ["Mental peace", "Better sleep", "Anxiety relief"]
    },
    {
      id: "basti",
      name: "Basti Therapy",
      description: "Medicated enema for colon cleansing",
      duration: "75 minutes", 
      benefits: ["Digestive health", "Nervous system", "Joint mobility"]
    }
  ];

  const currentTherapy = therapies.find(t => t.id === selectedTherapy);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast.success(isPlaying ? "Simulation paused" : "Simulation started");
  };

  const handleReset = () => {
    setIsPlaying(false);
    toast.success("View reset to default position");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">3D Therapy Preview</h2>
          <p className="text-muted-foreground">Immersive visualization of Ayurvedic treatments</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-accent/10">
            Interactive Demo
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Viewer */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Therapy Environment</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowInfo(!showInfo)}>
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="h-80 rounded-lg border bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
            <Suspense fallback={<Loader />}>
              <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <TherapyRoom therapy={selectedTherapy} />
                <OrbitControls 
                  enablePan={true} 
                  enableZoom={true} 
                  enableRotate={true}
                  autoRotate={isPlaying}
                  autoRotateSpeed={2}
                />
              </Canvas>
            </Suspense>
          </div>

          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Interactive Controls</span>
              </div>
              <p className="text-xs text-muted-foreground">
                • Click and drag to rotate the view<br/>
                • Scroll to zoom in/out<br/>
                • Use controls above to play/pause animation
              </p>
            </motion.div>
          )}
        </Card>

        {/* Therapy Selection & Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Select Therapy</h3>
            <Select value={selectedTherapy} onValueChange={setSelectedTherapy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {therapies.map((therapy) => (
                  <SelectItem key={therapy.id} value={therapy.id}>
                    {therapy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {currentTherapy && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">{currentTherapy.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {currentTherapy.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Duration:</span>
                  <Badge variant="outline">{currentTherapy.duration}</Badge>
                </div>
                
                <div>
                  <span className="text-sm font-medium mb-2 block">Key Benefits:</span>
                  <ul className="space-y-1">
                    {currentTherapy.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Button className="w-full mt-4 bg-gradient-to-r from-primary to-primary-light">
                Book This Therapy
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Additional Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
            <Play className="h-6 w-6 text-primary" />
          </div>
          <h4 className="font-semibold mb-2">Interactive Experience</h4>
          <p className="text-sm text-muted-foreground">
            Explore therapy environments in immersive 3D
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-accent/10 rounded-full mx-auto mb-3 flex items-center justify-center">
            <Info className="h-6 w-6 text-accent" />
          </div>
          <h4 className="font-semibold mb-2">Detailed Information</h4>
          <p className="text-sm text-muted-foreground">
            Learn about each therapy's benefits and procedures
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-success/10 rounded-full mx-auto mb-3 flex items-center justify-center">
            <Volume2 className="h-6 w-6 text-success" />
          </div>
          <h4 className="font-semibold mb-2">Guided Experience</h4>
          <p className="text-sm text-muted-foreground">
            Audio guidance and therapy instructions
          </p>
        </Card>
      </div>
    </div>
  );
};
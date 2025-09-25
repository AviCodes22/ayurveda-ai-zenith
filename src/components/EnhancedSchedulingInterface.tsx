import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Sparkles, Brain, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

interface Therapy {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  category: string;
  benefits: string[];
  description: string;
}

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface OptimizedSchedule {
  therapyId: string;
  timeSlotId: string;
  priority: number;
  reasoning: string;
}

interface AIOptimization {
  optimizedSchedule: OptimizedSchedule[];
  wellnessInsights: string;
  energyOptimization: string;
}

const ItemType = 'THERAPY';

const DraggableTherapy = ({ therapy, isSelected, onSelect }: { 
  therapy: Therapy; 
  isSelected: boolean; 
  onSelect: (id: string) => void;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { id: therapy.id, therapy },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`cursor-move ${isDragging ? 'opacity-50' : ''}`}
    >
      <Card 
        className={`transition-all duration-200 hover:shadow-md ${
          isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-accent/50'
        }`}
        onClick={() => onSelect(therapy.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{therapy.name}</h3>
            <Badge variant="outline">{therapy.category}</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Clock className="h-3 w-3" />
            {therapy.duration_minutes} min
            <Separator orientation="vertical" className="h-3" />
            ₹{therapy.price}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {therapy.description}
          </p>
          {therapy.benefits && therapy.benefits.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {therapy.benefits.slice(0, 2).map((benefit, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DropZoneSlot = ({ 
  timeSlot, 
  droppedTherapy, 
  onDrop, 
  isOptimal, 
  reasoning 
}: { 
  timeSlot: TimeSlot; 
  droppedTherapy: Therapy | null; 
  onDrop: (therapy: Therapy, slotId: string) => void;
  isOptimal?: boolean;
  reasoning?: string;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item: { therapy: Therapy }) => onDrop(item.therapy, timeSlot.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <motion.div
      ref={drop}
      className={`p-3 border-2 border-dashed rounded-lg transition-all duration-200 min-h-[100px] ${
        isOver ? 'border-primary bg-primary/10' : 
        isOptimal ? 'border-green-500 bg-green-50' :
        'border-gray-300 hover:border-gray-400'
      }`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">
          {timeSlot.start_time} - {timeSlot.end_time}
        </div>
        {isOptimal && (
          <Badge className="bg-green-100 text-green-800">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Recommended
          </Badge>
        )}
      </div>
      
      {droppedTherapy ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-primary/10 p-2 rounded border"
        >
          <div className="font-medium text-sm">{droppedTherapy.name}</div>
          <div className="text-xs text-muted-foreground">
            {droppedTherapy.duration_minutes} min • ₹{droppedTherapy.price}
          </div>
        </motion.div>
      ) : (
        <div className="text-center text-muted-foreground text-sm">
          Drop therapy here
        </div>
      )}
      
      {reasoning && (
        <div className="mt-2 text-xs text-green-700 bg-green-50 p-2 rounded">
          <Brain className="h-3 w-3 inline mr-1" />
          {reasoning}
        </div>
      )}
    </motion.div>
  );
};

export const EnhancedSchedulingInterface = () => {
  const [therapies, setTherapies] = useState<Therapy[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTherapies, setSelectedTherapies] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [schedule, setSchedule] = useState<Map<string, Therapy>>(new Map());
  const [aiOptimization, setAiOptimization] = useState<AIOptimization | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchTherapies();
      fetchTimeSlots();
    }
  }, [user]);

  const fetchTherapies = async () => {
    try {
      const { data, error } = await supabase
        .from('therapies')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setTherapies(data || []);
    } catch (error) {
      console.error('Error fetching therapies:', error);
      toast({
        title: "Error",
        description: "Failed to load therapies",
        variant: "destructive",
      });
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('is_available', true)
        .order('start_time');
      
      if (error) throw error;
      setTimeSlots(data || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast({
        title: "Error",
        description: "Failed to load time slots",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTherapySelect = (therapyId: string) => {
    setSelectedTherapies(prev => 
      prev.includes(therapyId) 
        ? prev.filter(id => id !== therapyId)
        : [...prev, therapyId]
    );
  };

  const handleDrop = (therapy: Therapy, slotId: string) => {
    setSchedule(prev => new Map(prev.set(slotId, therapy)));
    if (!selectedTherapies.includes(therapy.id)) {
      setSelectedTherapies(prev => [...prev, therapy.id]);
    }
  };

  const handleAIOptimization = async () => {
    if (selectedTherapies.length === 0) {
      toast({
        title: "Please select therapies",
        description: "Choose at least one therapy to optimize your schedule",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai-optimizer', {
        body: {
          selectedTherapies,
          selectedDate,
          patientId: user?.id
        }
      });

      if (error) throw error;

      if (data.success) {
        setAiOptimization(data.optimization);
        
        // Apply AI recommendations to schedule
        const newSchedule = new Map();
        data.optimization.optimizedSchedule.forEach((rec: OptimizedSchedule) => {
          const therapy = therapies.find(t => t.id === rec.therapyId);
          if (therapy) {
            newSchedule.set(rec.timeSlotId, therapy);
          }
        });
        setSchedule(newSchedule);

        toast({
          title: "Schedule optimized!",
          description: "AI has created an optimal therapy schedule for you",
        });
      } else {
        throw new Error(data.error || 'Optimization failed');
      }
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      toast({
        title: "Optimization failed",
        description: "Failed to optimize schedule. Please try manual arrangement.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleBookAppointments = async () => {
    if (schedule.size === 0) {
      toast({
        title: "No therapies scheduled",
        description: "Please arrange therapies in time slots before booking",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create pending appointments first
      const appointments = Array.from(schedule.entries()).map(([slotId, therapy]) => ({
        patient_id: user?.id,
        therapy_id: therapy.id,
        time_slot_id: slotId,
        appointment_date: selectedDate,
        total_amount: therapy.price,
        status: 'scheduled',
        payment_status: 'pending'
      }));

      const { data: createdAppointments, error } = await supabase
        .from('appointments')
        .insert(appointments)
        .select('*');

      if (error) throw error;

      // Calculate total amount
      const totalAmount = Array.from(schedule.values()).reduce((sum, therapy) => sum + therapy.price, 0);

      // Prepare therapy data with time slots for payment page
      const therapyData = Array.from(schedule.entries()).map(([slotId, therapy]) => {
        const timeSlot = timeSlots.find(slot => slot.id === slotId);
        return {
          id: therapy.id,
          name: therapy.name,
          duration_minutes: therapy.duration_minutes,
          price: therapy.price,
          timeSlot: timeSlot ? `${timeSlot.start_time} - ${timeSlot.end_time}` : 'Time TBD',
          date: selectedDate
        };
      });

      // Navigate to payment page with appointment data
      navigate('/payment', {
        state: {
          paymentData: {
            therapies: therapyData,
            totalAmount,
            selectedDate
          },
          appointments: createdAppointments
        }
      });

      // Reset form
      setSchedule(new Map());
      setSelectedTherapies([]);
      setAiOptimization(null);

    } catch (error) {
      console.error('Error creating appointments:', error);
      toast({
        title: "Booking failed",
        description: "Failed to create appointments. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('schedule.title')}
            </CardTitle>
          </CardHeader>
        <CardContent className="space-y-6">
          {/* Appointment Selection */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Select Date</Label>
            <div className="relative z-20">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={handleAIOptimization}
              disabled={isOptimizing || selectedTherapies.length === 0}
              className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary"
            >
              {isOptimizing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  {t('schedule.aiOptimize')}
                </>
              )}
            </Button>
            <Button
              onClick={handleBookAppointments}
              disabled={schedule.size === 0}
              variant="default"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {t('schedule.bookAppointment')}
            </Button>
          </div>
          
          {selectedTherapies.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Selected: {selectedTherapies.length} therapies
            </div>
          )}
        </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Therapies */}
          <Card>
            <CardHeader>
              <CardTitle>Available Therapies</CardTitle>
              <p className="text-sm text-muted-foreground">
                Click to select, drag to schedule
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {therapies.map((therapy) => (
                    <DraggableTherapy
                      key={therapy.id}
                      therapy={therapy}
                      isSelected={selectedTherapies.includes(therapy.id)}
                      onSelect={handleTherapySelect}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle>Time Slots ({selectedDate})</CardTitle>
              <p className="text-sm text-muted-foreground">
                Drop therapies into available slots
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {timeSlots.map((slot) => {
                  const aiRecommendation = aiOptimization?.optimizedSchedule.find(
                    rec => rec.timeSlotId === slot.id
                  );
                  
                  return (
                    <DropZoneSlot
                      key={slot.id}
                      timeSlot={slot}
                      droppedTherapy={schedule.get(slot.id) || null}
                      onDrop={handleDrop}
                      isOptimal={!!aiRecommendation}
                      reasoning={aiRecommendation?.reasoning}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        {aiOptimization && (
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Wellness Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-1 text-foreground">Wellness Recommendations</h4>
                <p className="text-sm text-muted-foreground">
                  {aiOptimization.wellnessInsights}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1 text-foreground">Energy Optimization</h4>
                <p className="text-sm text-muted-foreground">
                  {aiOptimization.energyOptimization}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DndProvider>
  );
};
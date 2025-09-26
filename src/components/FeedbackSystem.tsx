import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

interface Appointment {
  id: string;
  appointment_date: string;
  status: string;
  therapies: { name: string; id: string };
  time_slots: { start_time: string; end_time: string };
}

interface Feedback {
  id: string;
  rating: number;
  comments: string;
  pain_level_before: number;
  pain_level_after: number;
  energy_level: number;
  sleep_quality: number;
  overall_wellness: number;
  created_at: string;
  therapies: { name: string } | null;
}

export const FeedbackSystem = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [painBefore, setPainBefore] = useState([5]);
  const [painAfter, setPainAfter] = useState([3]);
  const [energyLevel, setEnergyLevel] = useState([7]);
  const [sleepQuality, setSleepQuality] = useState([4]);
  const [overallWellness, setOverallWellness] = useState([7]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      fetchCompletedAppointments();
      fetchUserFeedbacks();
    }
  }, [user]);

  const fetchCompletedAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          status,
          therapy_id,
          practitioner_id,
          therapies(name, id),
          time_slots(start_time, end_time)
        `)
        .eq('patient_id', user?.id)
        .eq('status', 'completed')
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load completed appointments",
        variant: "destructive",
      });
    }
  };

  const fetchUserFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          id,
          rating,
          comments,
          pain_level_before,
          pain_level_after,
          energy_level,
          sleep_quality,
          overall_wellness,
          created_at,
          therapy_id,
          therapies!inner(name)
        `)
        .eq('patient_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbacks((data as any) || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedAppointment) {
      toast({
        title: "Please select an appointment",
        description: "Choose an appointment to provide feedback for",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const appointment = appointments.find(apt => apt.id === selectedAppointment);
      
      // Get appointment details with practitioner info
      const { data: appointmentDetails, error: appointmentError } = await supabase
        .from('appointments')
        .select('practitioner_id')
        .eq('id', selectedAppointment)
        .single();

      if (appointmentError) throw appointmentError;
      
      const { error } = await supabase
        .from('feedback')
        .insert({
          patient_id: user?.id,
          appointment_id: selectedAppointment,
          therapy_id: appointment?.therapies.id,
          rating,
          comments,
          pain_level_before: painBefore[0],
          pain_level_after: painAfter[0],
          energy_level: energyLevel[0],
          sleep_quality: sleepQuality[0],
          overall_wellness: overallWellness[0]
        });

      if (error) throw error;

      toast({
        title: "Feedback submitted successfully!",
        description: "Thank you for your valuable feedback",
      });

      // Reset form
      setSelectedAppointment('');
      setRating(5);
      setComments('');
      setPainBefore([5]);
      setPainAfter([3]);
      setEnergyLevel([7]);
      setSleepQuality([4]);
      setOverallWellness([7]);

      // Refresh feedbacks
      fetchUserFeedbacks();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feedback Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t('feedback.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Appointment Selection */}
          <div>
            <Label>Select Completed Appointment</Label>
            <Select value={selectedAppointment} onValueChange={setSelectedAppointment}>
              <SelectTrigger className="w-full bg-card border-border text-foreground relative z-10">
                <SelectValue placeholder="Choose an appointment to review" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground relative z-50">
                {appointments.map((appointment) => (
                  <SelectItem key={appointment.id} value={appointment.id} className="hover:bg-accent">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {appointment.therapies.name} - {' '}
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div>
            <Label>{t('feedback.rating')}</Label>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
            </div>
          </div>

          {/* Wellness Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>{t('feedback.painBefore')} (1-10)</Label>
              <Slider
                value={painBefore}
                onValueChange={setPainBefore}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">Current: {painBefore[0]}</div>
            </div>

            <div>
              <Label>{t('feedback.painAfter')} (1-10)</Label>
              <Slider
                value={painAfter}
                onValueChange={setPainAfter}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">Current: {painAfter[0]}</div>
            </div>

            <div>
              <Label>{t('feedback.energyLevel')} (1-10)</Label>
              <Slider
                value={energyLevel}
                onValueChange={setEnergyLevel}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">Current: {energyLevel[0]}</div>
            </div>

            <div>
              <Label>{t('feedback.sleepQuality')} (1-5)</Label>
              <Slider
                value={sleepQuality}
                onValueChange={setSleepQuality}
                max={5}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">Current: {sleepQuality[0]}</div>
            </div>
          </div>

          <div>
            <Label>Overall Wellness (1-10)</Label>
            <Slider
              value={overallWellness}
              onValueChange={setOverallWellness}
              max={10}
              min={1}
              step={1}
              className="mt-2"
            />
            <div className="text-sm text-muted-foreground mt-1">Current: {overallWellness[0]}</div>
          </div>

          {/* Comments */}
          <div>
            <Label>{t('feedback.comments')}</Label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Share your detailed experience with the therapy..."
              className="mt-2"
              rows={4}
            />
          </div>

          <Button
            onClick={handleSubmitFeedback}
            disabled={isSubmitting || !selectedAppointment}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t('feedback.submit')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Previous Feedbacks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Previous Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          {feedbacks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No feedback submitted yet. Complete a therapy session to share your experience!
            </p>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{feedback.therapies?.name || 'Unknown Therapy'}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>

                  {feedback.comments && (
                    <p className="text-sm">{feedback.comments}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                    <div className="text-center">
                      <div className="font-medium">Pain Before</div>
                      <div className="text-muted-foreground">{feedback.pain_level_before}/10</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Pain After</div>
                      <div className="text-muted-foreground">{feedback.pain_level_after}/10</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Energy</div>
                      <div className="text-muted-foreground">{feedback.energy_level}/10</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Sleep</div>
                      <div className="text-muted-foreground">{feedback.sleep_quality}/5</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Wellness</div>
                      <div className="text-muted-foreground">{feedback.overall_wellness}/10</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
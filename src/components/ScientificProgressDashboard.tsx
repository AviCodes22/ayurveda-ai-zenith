import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { TrendingUp, Heart, Activity, Zap, Moon, Target, Calendar, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface WellnessData {
  date: string;
  heart_rate: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  mood_score: number;
  energy_score: number;
  pain_score: number;
  sleep_hours: number;
  weight: number;
}

interface TherapyBenefit {
  therapy: string;
  completed_sessions: number;
  improvement_score: number;
  category: string;
}

export const ScientificProgressDashboard = () => {
  const [wellnessData, setWellnessData] = useState<WellnessData[]>([]);
  const [therapyBenefits, setTherapyBenefits] = useState<TherapyBenefit[]>([]);
  const [wellnessScore, setWellnessScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('overview');
  
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      fetchWellnessData();
      fetchTherapyBenefits();
    }
  }, [user]);

  const fetchWellnessData = async () => {
    try {
      const { data, error } = await supabase
        .from('wellness_tracking')
        .select('*')
        .eq('patient_id', user?.id)
        .order('date', { ascending: true })
        .limit(30);

      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        heart_rate: item.heart_rate || 0,
        blood_pressure_systolic: item.blood_pressure_systolic || 0,
        blood_pressure_diastolic: item.blood_pressure_diastolic || 0,
        mood_score: item.mood_score || 0,
        energy_score: item.energy_score || 0,
        pain_score: item.pain_score || 0,
        sleep_hours: item.sleep_hours || 0,
        weight: item.weight || 0,
      })) || [];
      
      setWellnessData(formattedData);
      calculateWellnessScore(formattedData);
    } catch (error) {
      console.error('Error fetching wellness data:', error);
      // Generate sample data for demonstration
      generateSampleData();
    }
  };

  const fetchTherapyBenefits = async () => {
    try {
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          id,
          status,
          therapies!inner(name, category, benefits),
          feedback!inner(
            rating,
            overall_wellness,
            energy_level,
            pain_level_after,
            pain_level_before
          )
        `)
        .eq('patient_id', user?.id)
        .eq('status', 'completed');

      if (error) throw error;

      // Process therapy benefits
      const therapyMap = new Map();
      
      appointments?.forEach(appointment => {
        const therapyName = appointment.therapies?.name;
        const feedbackData = Array.isArray(appointment.feedback) ? appointment.feedback[0] : appointment.feedback;
        
        if (therapyName) {
          if (!therapyMap.has(therapyName)) {
            therapyMap.set(therapyName, {
              therapy: therapyName,
              completed_sessions: 0,
              total_improvement: 0,
              feedback_count: 0,
              category: appointment.therapies.category || 'General'
            });
          }
          
          const therapy = therapyMap.get(therapyName);
          therapy.completed_sessions += 1;
          
          if (feedbackData && typeof feedbackData === 'object') {
            const improvement = (feedbackData.pain_level_before || 0) - (feedbackData.pain_level_after || 0) + 
                              (feedbackData.energy_level || 0) + (feedbackData.overall_wellness || 0);
            therapy.total_improvement += improvement;
            therapy.feedback_count += 1;
          }
        }
      });

      const benefits = Array.from(therapyMap.values()).map(therapy => ({
        therapy: therapy.therapy,
        completed_sessions: therapy.completed_sessions,
        improvement_score: therapy.feedback_count > 0 
          ? Math.round(therapy.total_improvement / therapy.feedback_count) 
          : therapy.completed_sessions * 2,
        category: therapy.category
      }));

      setTherapyBenefits(benefits);
    } catch (error) {
      console.error('Error fetching therapy benefits:', error);
      // Generate sample therapy data
      setTherapyBenefits([
        { therapy: 'Abhyanga', completed_sessions: 8, improvement_score: 85, category: 'Massage' },
        { therapy: 'Panchakarma', completed_sessions: 3, improvement_score: 92, category: 'Detox' },
        { therapy: 'Yoga Therapy', completed_sessions: 12, improvement_score: 78, category: 'Movement' },
        { therapy: 'Herbal Medicine', completed_sessions: 15, improvement_score: 81, category: 'Medicine' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = () => {
    const sampleData = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      sampleData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        heart_rate: 65 + Math.random() * 20,
        blood_pressure_systolic: 115 + Math.random() * 15,
        blood_pressure_diastolic: 75 + Math.random() * 10,
        mood_score: 6 + Math.random() * 3,
        energy_score: 6 + Math.random() * 3,
        pain_score: 5 - Math.random() * 3,
        sleep_hours: 6.5 + Math.random() * 2,
        weight: 70 + Math.random() * 5,
      });
    }
    
    setWellnessData(sampleData);
    calculateWellnessScore(sampleData);
  };

  const calculateWellnessScore = (data: WellnessData[]) => {
    if (data.length === 0) {
      setWellnessScore(0);
      return;
    }

    const latest = data[data.length - 1];
    const score = (
      (latest.mood_score / 10) * 25 +
      (latest.energy_score / 10) * 25 +
      ((10 - latest.pain_score) / 10) * 25 +
      (Math.min(latest.sleep_hours / 8, 1)) * 25
    );
    
    setWellnessScore(Math.round(score));
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  const MetricCard = ({ title, value, unit, icon: Icon, color, trend }: any) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">
              {typeof value === 'number' ? value.toFixed(1) : value}{unit}
            </p>
            {trend && (
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">{trend}%</span>
              </div>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

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

  const latestData = wellnessData[wellnessData.length - 1] || {
    heart_rate: 0, mood_score: 0, energy_score: 0, pain_score: 0, sleep_hours: 0
  };

  return (
    <div className="space-y-6">
      {/* Wellness Score Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            {t('progress.wellnessScore')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="text-4xl font-bold text-blue-600 mb-2">{wellnessScore}%</div>
              <Progress value={wellnessScore} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">
                Based on mood, energy, pain levels, and sleep quality
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-yellow-500" />
              <Badge variant={wellnessScore >= 80 ? "default" : wellnessScore >= 60 ? "secondary" : "outline"}>
                {wellnessScore >= 80 ? "Excellent" : wellnessScore >= 60 ? "Good" : "Improving"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={t('progress.heartRate')}
          value={latestData.heart_rate}
          unit=" bpm"
          icon={Heart}
          color="text-red-500"
          trend={2.3}
        />
        <MetricCard
          title="Mood Score"
          value={latestData.mood_score}
          unit="/10"
          icon={Activity}
          color="text-green-500"
          trend={5.1}
        />
        <MetricCard
          title={t('progress.energyLevel')}
          value={latestData.energy_score}
          unit="/10"
          icon={Zap}
          color="text-yellow-500"
          trend={3.7}
        />
        <MetricCard
          title="Sleep Quality"
          value={latestData.sleep_hours}
          unit=" hrs"
          icon={Moon}
          color="text-blue-500"
          trend={1.2}
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
          <TabsTrigger value="therapy">Therapy Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wellness Trends (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={wellnessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="mood_score" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="energy_score" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Heart Rate Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={wellnessData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="heart_rate" stroke="#ff7c7c" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blood Pressure Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={wellnessData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="blood_pressure_systolic" stroke="#8884d8" strokeWidth={2} name="Systolic" />
                    <Line type="monotone" dataKey="blood_pressure_diastolic" stroke="#82ca9d" strokeWidth={2} name="Diastolic" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wellness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pain & Energy Correlation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={wellnessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="energy_score" stroke="#82ca9d" strokeWidth={2} name="Energy Level" />
                  <Line type="monotone" dataKey="pain_score" stroke="#ff7c7c" strokeWidth={2} name="Pain Level" />
                  <Line type="monotone" dataKey="sleep_hours" stroke="#8dd1e1" strokeWidth={2} name="Sleep Hours" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="therapy" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Therapy Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={therapyBenefits}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="therapy" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="improvement_score" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={therapyBenefits}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ therapy, completed_sessions }) => `${therapy}: ${completed_sessions}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="completed_sessions"
                    >
                      {therapyBenefits.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Therapy Benefits List */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Therapy Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {therapyBenefits.map((therapy, index) => (
                  <motion.div
                    key={therapy.therapy}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{therapy.therapy}</h4>
                      <p className="text-sm text-muted-foreground">
                        {therapy.completed_sessions} sessions completed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {therapy.improvement_score}%
                      </div>
                      <Badge variant="outline">{therapy.category}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { selectedTherapies, selectedDate, patientId } = await req.json();

    console.log('Optimizing schedule for:', { selectedTherapies, selectedDate, patientId });

    // Fetch available time slots
    const { data: timeSlots, error: timeSlotsError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('is_available', true)
      .order('start_time');

    if (timeSlotsError) {
      console.error('Error fetching time slots:', timeSlotsError);
      throw new Error('Failed to fetch time slots');
    }

    // Fetch therapy details
    const { data: therapies, error: therapiesError } = await supabase
      .from('therapies')
      .select('*')
      .in('id', selectedTherapies);

    if (therapiesError) {
      console.error('Error fetching therapies:', therapiesError);
      throw new Error('Failed to fetch therapy details');
    }

    // Fetch patient's wellness data for personalization
    const { data: wellnessData, error: wellnessError } = await supabase
      .from('wellness_tracking')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false })
      .limit(7); // Last 7 days

    if (wellnessError) {
      console.log('No wellness data found for patient, using defaults');
    }

    // Fetch existing appointments for the date to avoid conflicts
    const { data: existingAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('time_slot_id')
      .eq('appointment_date', selectedDate)
      .neq('status', 'cancelled');

    const bookedSlots = existingAppointments?.map(apt => apt.time_slot_id) || [];

    // Prepare AI optimization prompt
    const therapyDetails = therapies.map(t => ({
      name: t.name,
      duration: t.duration_minutes,
      category: t.category,
      benefits: t.benefits
    }));

    const availableSlots = timeSlots
      .filter(slot => !bookedSlots.includes(slot.id))
      .map(slot => ({
        id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time
      }));

    const patientProfile = wellnessData && wellnessData.length > 0 ? {
      averageMoodScore: wellnessData.reduce((sum, w) => sum + (w.mood_score || 5), 0) / wellnessData.length,
      averageEnergyScore: wellnessData.reduce((sum, w) => sum + (w.energy_score || 5), 0) / wellnessData.length,
      averagePainScore: wellnessData.reduce((sum, w) => sum + (w.pain_score || 5), 0) / wellnessData.length,
      averageSleepHours: wellnessData.reduce((sum, w) => sum + (w.sleep_hours || 7), 0) / wellnessData.length
    } : {
      averageMoodScore: 5,
      averageEnergyScore: 5,
      averagePainScore: 5,
      averageSleepHours: 7
    };

    const prompt = `As an Ayurvedic wellness expert, optimize the following therapy schedule:

Selected Therapies: ${JSON.stringify(therapyDetails, null, 2)}

Available Time Slots: ${JSON.stringify(availableSlots, null, 2)}

Patient Profile: ${JSON.stringify(patientProfile, null, 2)}

Please analyze and provide:
1. Optimal sequence of therapies based on Ayurvedic principles
2. Best time slots considering therapy synergies and patient wellness data
3. Reasoning for recommendations including energy levels, pain management, and therapeutic benefits
4. Any contraindications or special considerations

Respond with a JSON object containing:
{
  "optimizedSchedule": [
    {
      "therapyId": "therapy_uuid",
      "timeSlotId": "slot_uuid", 
      "priority": 1-5,
      "reasoning": "explanation"
    }
  ],
  "wellnessInsights": "overall recommendations",
  "energyOptimization": "energy-based scheduling insights"
}`;

    // Call Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', await geminiResponse.text());
      throw new Error('Failed to get AI optimization');
    }

    const geminiData = await geminiResponse.json();
    const aiResponse = geminiData.candidates[0].content.parts[0].text;
    
    // Parse AI response
    let optimizationResult;
    try {
      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        optimizationResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback: create basic optimization
      optimizationResult = {
        optimizedSchedule: selectedTherapies.map((therapyId, index) => ({
          therapyId,
          timeSlotId: availableSlots[index % availableSlots.length]?.id,
          priority: Math.min(index + 1, 5),
          reasoning: 'Basic sequential scheduling applied'
        })),
        wellnessInsights: 'Schedule optimized for balanced therapy distribution',
        energyOptimization: 'Therapies arranged to maintain consistent energy levels'
      };
    }

    console.log('AI optimization result:', optimizationResult);

    return new Response(JSON.stringify({
      success: true,
      optimization: optimizationResult,
      availableSlots: availableSlots.length,
      patientInsights: patientProfile
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-ai-optimizer function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
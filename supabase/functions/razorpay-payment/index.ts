import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../_shared/database.types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, ...body } = await req.json();

    switch (action) {
      case 'create_order':
        return await createRazorpayOrder(body, supabaseClient, user.id);
      case 'verify_payment':
        return await verifyRazorpayPayment(body, supabaseClient, user.id);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in razorpay-payment function:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function createRazorpayOrder(
  { appointmentId, appointmentIds, amount, currency = 'INR', description }: any,
  supabaseClient: any,
  userId: string
) {
  const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
  const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

  if (!razorpayKeyId || !razorpayKeySecret) {
    throw new Error('Razorpay credentials not configured');
  }

  // Handle both single and multiple appointments
  const ids = appointmentIds || (appointmentId ? [appointmentId] : []);
  if (ids.length === 0) {
    throw new Error('No appointment IDs provided');
  }

  // Verify appointments belong to user
  const { data: appointments, error: appointmentError } = await supabaseClient
    .from('appointments')
    .select('*')
    .in('id', ids)
    .eq('patient_id', userId);

  if (appointmentError || !appointments || appointments.length !== ids.length) {
    throw new Error('Appointments not found or unauthorized');
  }

  // Create Razorpay order
  const orderData = {
    amount: Math.round(amount * 100), // Convert to paise
    currency: currency,
    receipt: `appointments_${ids.join('_')}`,
    notes: {
      appointment_ids: ids.join(','),
      patient_id: userId,
      description: description || `Payment for ${ids.length} therapy sessions`
    }
  };

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Razorpay API error:', errorData);
    throw new Error('Failed to create Razorpay order');
  }

  const order = await response.json();

  // Store payment records for each appointment
  const paymentInserts = ids.map((id: string) => ({
    appointment_id: id,
    amount: appointments.find((apt: any) => apt.id === id)?.total_amount || 0,
    currency: currency,
    razorpay_order_id: order.id,
    status: 'pending',
  }));

  const { error: paymentError } = await supabaseClient
    .from('payments')
    .insert(paymentInserts);

  if (paymentError) {
    console.error('Error storing payments:', paymentError);
    throw new Error('Failed to store payment records');
  }

  return new Response(JSON.stringify({ 
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: razorpayKeyId
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function verifyRazorpayPayment(
  { razorpayOrderId, razorpayPaymentId, razorpaySignature, appointmentIds }: any,
  supabaseClient: any,
  userId: string
) {
  const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

  if (!razorpayKeySecret) {
    throw new Error('Razorpay secret not configured');
  }

  // Verify signature
  const expectedSignature = await generateSignature(
    razorpayOrderId + '|' + razorpayPaymentId,
    razorpayKeySecret
  );

  if (expectedSignature !== razorpaySignature) {
    throw new Error('Invalid payment signature');
  }

  // Update payment records
  const { data: payments, error: paymentError } = await supabaseClient
    .from('payments')
    .update({
      razorpay_payment_id: razorpayPaymentId,
      status: 'completed',
      payment_method: 'razorpay',
    })
    .eq('razorpay_order_id', razorpayOrderId)
    .select('appointment_id');

  if (paymentError || !payments) {
    console.error('Error updating payments:', paymentError);
    throw new Error('Failed to update payment records');
  }

  // Update appointment payment status for all appointments
  const appointmentIdsToUpdate = appointmentIds || payments.map((p: any) => p.appointment_id);
  
  const { error: appointmentError } = await supabaseClient
    .from('appointments')
    .update({ payment_status: 'completed' })
    .in('id', appointmentIdsToUpdate)
    .eq('patient_id', userId);

  if (appointmentError) {
    console.error('Error updating appointments:', appointmentError);
    throw new Error('Failed to update appointment status');
  }

  return new Response(JSON.stringify({ 
    success: true,
    message: 'Payment verified successfully',
    updated_appointments: appointmentIdsToUpdate.length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function generateSignature(data: string, secret: string) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(data);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
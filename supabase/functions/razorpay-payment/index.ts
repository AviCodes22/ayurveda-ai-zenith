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
  { appointmentId, amount, currency = 'INR' }: any,
  supabaseClient: any,
  userId: string
) {
  const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
  const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

  if (!razorpayKeyId || !razorpayKeySecret) {
    throw new Error('Razorpay credentials not configured');
  }

  // Verify appointment belongs to user
  const { data: appointment, error: appointmentError } = await supabaseClient
    .from('appointments')
    .select('*')
    .eq('id', appointmentId)
    .eq('patient_id', userId)
    .single();

  if (appointmentError || !appointment) {
    throw new Error('Appointment not found or unauthorized');
  }

  // Create Razorpay order
  const orderData = {
    amount: Math.round(amount * 100), // Convert to paise
    currency: currency,
    receipt: `appointment_${appointmentId}`,
    notes: {
      appointment_id: appointmentId,
      patient_id: userId
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

  // Store payment record
  const { error: paymentError } = await supabaseClient
    .from('payments')
    .insert({
      appointment_id: appointmentId,
      amount: amount,
      currency: currency,
      razorpay_order_id: order.id,
      status: 'pending',
    });

  if (paymentError) {
    console.error('Error storing payment:', paymentError);
    throw new Error('Failed to store payment record');
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
  { razorpayOrderId, razorpayPaymentId, razorpaySignature }: any,
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

  // Update payment record
  const { data: payment, error: paymentError } = await supabaseClient
    .from('payments')
    .update({
      razorpay_payment_id: razorpayPaymentId,
      status: 'completed',
      payment_method: 'razorpay',
    })
    .eq('razorpay_order_id', razorpayOrderId)
    .select('appointment_id')
    .single();

  if (paymentError || !payment) {
    console.error('Error updating payment:', paymentError);
    throw new Error('Failed to update payment record');
  }

  // Update appointment payment status
  const { error: appointmentError } = await supabaseClient
    .from('appointments')
    .update({ payment_status: 'completed' })
    .eq('id', payment.appointment_id)
    .eq('patient_id', userId);

  if (appointmentError) {
    console.error('Error updating appointment:', appointmentError);
    throw new Error('Failed to update appointment status');
  }

  return new Response(JSON.stringify({ 
    success: true,
    message: 'Payment verified successfully'
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
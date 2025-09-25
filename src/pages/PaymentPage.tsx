import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Shield, Clock, CheckCircle, Loader2, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TherapyItem {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  timeSlot: string;
  date: string;
}

interface PaymentData {
  therapies: TherapyItem[];
  totalAmount: number;
  selectedDate: string;
}

// Declare Razorpay on window for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    // Get payment data from navigation state
    if (location.state?.paymentData) {
      setPaymentData(location.state.paymentData);
      setAppointments(location.state.appointments || []);
    } else {
      // Redirect back if no payment data
      navigate('/dashboard');
    }
  }, [location.state, navigate]);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!paymentData) return;

    setIsProcessing(true);
    
    try {
      // Load Razorpay script
      const razorpayLoaded = await initializeRazorpay();
      if (!razorpayLoaded) {
        throw new Error('Failed to load Razorpay. Please check your internet connection.');
      }

      // Create a combined payment order for all appointments
      const { data, error } = await supabase.functions.invoke('razorpay-payment', {
        body: {
          action: 'create_order',
          appointmentIds: appointments.map(apt => apt.id),
          amount: paymentData.totalAmount,
          currency: 'INR',
          description: `Payment for ${paymentData.therapies.length} therapy sessions`
        }
      });

      if (error || !data) {
        throw new Error(error?.message || 'Failed to create payment order');
      }

      // Initialize Razorpay payment
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'AyurTech Pro',
        description: `Payment for ${paymentData.therapies.length} therapy sessions on ${paymentData.selectedDate}`,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const { error: verifyError } = await supabase.functions.invoke('razorpay-payment', {
              body: {
                action: 'verify_payment',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                appointmentIds: appointments.map(apt => apt.id)
              }
            });

            if (verifyError) {
              throw new Error(verifyError.message);
            }

            // Update appointment payment status
            const { error: updateError } = await supabase
              .from('appointments')
              .update({ payment_status: 'completed' })
              .in('id', appointments.map(apt => apt.id));

            if (updateError) {
              console.error('Error updating payment status:', updateError);
            }

            toast({
              title: "Payment Successful!",
              description: `Your ${paymentData.therapies.length} therapy appointments have been confirmed for ${paymentData.selectedDate}`,
            });
            
            // Navigate to dashboard with success message
            navigate('/dashboard', { 
              state: { 
                paymentSuccess: true,
                bookingDetails: {
                  therapies: paymentData.therapies.length,
                  date: paymentData.selectedDate,
                  amount: paymentData.totalAmount
                }
              }
            });
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if the amount was deducted.",
              variant: "destructive"
            });
          }
        },
        prefill: {
          email: user?.email || '',
          contact: '9999999999'
        },
        notes: {
          user_id: user?.id,
          appointment_count: paymentData.therapies.length.toString(),
          selected_date: paymentData.selectedDate
        },
        theme: {
          color: '#0f766e'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  if (!paymentData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Complete Payment</h1>
            <p className="text-muted-foreground">Secure payment for your therapy appointments</p>
          </div>
        </div>

        {/* Appointment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Patient: {user?.email}</span>
              </div>
              <Badge variant="secondary">
                {paymentData.selectedDate}
              </Badge>
            </div>

            <div className="space-y-3">
              {paymentData.therapies.map((therapy, index) => (
                <div key={therapy.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{therapy.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {therapy.timeSlot} • {therapy.duration_minutes} min
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{therapy.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total Amount</span>
              <span className="text-primary">₹{paymentData.totalAmount.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 mb-1">Secure Payment</h4>
                <p className="text-sm text-green-700">
                  Your payment is protected by Razorpay with 256-bit SSL encryption. 
                  We support UPI, cards, net banking, and wallets.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Summary */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-2">What's Included</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Professional Ayurvedic therapy sessions</li>
                  <li>• Personalized treatment approach</li>
                  <li>• Post-therapy wellness guidance</li>
                  <li>• Free consultation for follow-up</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90 text-white font-semibold py-4 text-lg shadow-lg"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Pay ₹{paymentData.totalAmount.toLocaleString()} Securely
              </>
            )}
          </Button>
        </motion.div>

        <p className="text-xs text-center text-muted-foreground">
          By proceeding with payment, you agree to our Terms of Service and Privacy Policy. 
          You can cancel or reschedule your appointments up to 24 hours before the session.
        </p>
      </motion.div>
    </div>
  );
};
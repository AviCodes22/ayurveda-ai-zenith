import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Shield, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: {
    id: string;
    therapy: string;
    date: string;
    time: string;
    amount: number;
  };
  onSuccess: () => void;
}

// Declare Razorpay on window for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentModal = ({ isOpen, onClose, appointment, onSuccess }: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Don't render if appointment data is not available
  if (!appointment) {
    return null;
  }

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
    setIsProcessing(true);
    
    try {
      // Load Razorpay script
      const razorpayLoaded = await initializeRazorpay();
      if (!razorpayLoaded) {
        throw new Error('Failed to load Razorpay. Please check your internet connection.');
      }

      // Create order
      const { data, error } = await supabase.functions.invoke('razorpay-payment', {
        body: {
          action: 'create_order',
          appointmentId: appointment.id,
          amount: appointment.amount,
          currency: 'INR'
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
        description: `Payment for ${appointment.therapy}`,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const { error: verifyError } = await supabase.functions.invoke('razorpay-payment', {
              body: {
                action: 'verify_payment',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              }
            });

            if (verifyError) {
              throw new Error(verifyError.message);
            }

            toast.success('Payment successful!', {
              description: 'Your appointment has been confirmed.'
            });
            
            onSuccess();
            onClose();
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed', {
              description: 'Please contact support if the amount was deducted.'
            });
          }
        },
        prefill: {
          email: 'patient@ayurtech.com',
          contact: '9999999999'
        },
        notes: {
          appointment_id: appointment.id,
          therapy: appointment.therapy
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
      toast.error('Payment failed', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Complete Payment
          </DialogTitle>
          <DialogDescription>
            Secure payment for your therapy appointment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Appointment Details */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{appointment.therapy}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Clock className="h-4 w-4" />
                      {appointment.date} at {appointment.time}
                    </div>
                  </div>
                  <Badge variant="secondary">
                    ₹{appointment.amount.toLocaleString()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <Shield className="h-4 w-4 flex-shrink-0" />
            <span>Your payment is secured by Razorpay with 256-bit SSL encryption</span>
          </div>

          {/* Payment Button */}
          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay ₹{appointment.amount.toLocaleString()}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By proceeding, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
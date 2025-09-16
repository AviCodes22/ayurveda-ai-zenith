export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          practitioner_id: string | null;
          therapy_id: string;
          appointment_date: string;
          time_slot_id: string;
          status: string;
          payment_status: string;
          total_amount: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          practitioner_id?: string | null;
          therapy_id: string;
          appointment_date: string;
          time_slot_id: string;
          status?: string;
          payment_status?: string;
          total_amount: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          practitioner_id?: string | null;
          therapy_id?: string;
          appointment_date?: string;
          time_slot_id?: string;
          status?: string;
          payment_status?: string;
          total_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          appointment_id: string;
          amount: number;
          currency: string;
          status: string;
          payment_method: string | null;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          amount: number;
          currency?: string;
          status?: string;
          payment_method?: string | null;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          appointment_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
          payment_method?: string | null;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      therapies: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          duration_minutes: number;
          price: number;
          category: string;
          benefits: string[] | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      time_slots: {
        Row: {
          id: string;
          start_time: string;
          end_time: string;
          is_available: boolean;
          created_at: string;
        };
      };
    };
  };
};
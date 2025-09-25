export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          payment_status: string
          practitioner_id: string | null
          status: string
          therapy_id: string
          time_slot_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          payment_status?: string
          practitioner_id?: string | null
          status?: string
          therapy_id: string
          time_slot_id: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          payment_status?: string
          practitioner_id?: string | null
          status?: string
          therapy_id?: string
          time_slot_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_therapy_id_fkey"
            columns: ["therapy_id"]
            isOneToOne: false
            referencedRelation: "therapies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_verification: {
        Row: {
          ayush_registration_number: string
          clinic_address: string | null
          created_at: string | null
          id: string
          qualification: string
          specialization: string
          updated_at: string | null
          user_id: string
          verification_status: string | null
          verified_at: string | null
          years_of_experience: number | null
        }
        Insert: {
          ayush_registration_number: string
          clinic_address?: string | null
          created_at?: string | null
          id?: string
          qualification: string
          specialization: string
          updated_at?: string | null
          user_id: string
          verification_status?: string | null
          verified_at?: string | null
          years_of_experience?: number | null
        }
        Update: {
          ayush_registration_number?: string
          clinic_address?: string | null
          created_at?: string | null
          id?: string
          qualification?: string
          specialization?: string
          updated_at?: string | null
          user_id?: string
          verification_status?: string | null
          verified_at?: string | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          appointment_id: string
          comments: string | null
          created_at: string
          energy_level: number | null
          id: string
          overall_wellness: number | null
          pain_level_after: number | null
          pain_level_before: number | null
          patient_id: string
          rating: number
          sleep_quality: number | null
          therapy_id: string
          updated_at: string
        }
        Insert: {
          appointment_id: string
          comments?: string | null
          created_at?: string
          energy_level?: number | null
          id?: string
          overall_wellness?: number | null
          pain_level_after?: number | null
          pain_level_before?: number | null
          patient_id: string
          rating: number
          sleep_quality?: number | null
          therapy_id: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          comments?: string | null
          created_at?: string
          energy_level?: number | null
          id?: string
          overall_wellness?: number | null
          pain_level_after?: number | null
          pain_level_before?: number | null
          patient_id?: string
          rating?: number
          sleep_quality?: number | null
          therapy_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          appointment_reminders: boolean | null
          created_at: string
          id: string
          payment_alerts: boolean | null
          system_notifications: boolean | null
          therapy_updates: boolean | null
          updated_at: string
          user_id: string
          wellness_reports: boolean | null
        }
        Insert: {
          appointment_reminders?: boolean | null
          created_at?: string
          id?: string
          payment_alerts?: boolean | null
          system_notifications?: boolean | null
          therapy_updates?: boolean | null
          updated_at?: string
          user_id: string
          wellness_reports?: boolean | null
        }
        Update: {
          appointment_reminders?: boolean | null
          created_at?: string
          id?: string
          payment_alerts?: boolean | null
          system_notifications?: boolean | null
          therapy_updates?: boolean | null
          updated_at?: string
          user_id?: string
          wellness_reports?: boolean | null
        }
        Relationships: []
      }
      patient_details: {
        Row: {
          allergies: string | null
          blood_pressure: string | null
          body_constitution: string | null
          chief_complaint: string | null
          created_at: string | null
          current_medications: string | null
          dietary_preferences: string | null
          id: string
          lifestyle_habits: string | null
          medical_history: string | null
          pulse_rate: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allergies?: string | null
          blood_pressure?: string | null
          body_constitution?: string | null
          chief_complaint?: string | null
          created_at?: string | null
          current_medications?: string | null
          dietary_preferences?: string | null
          id?: string
          lifestyle_habits?: string | null
          medical_history?: string | null
          pulse_rate?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allergies?: string | null
          blood_pressure?: string | null
          body_constitution?: string | null
          chief_complaint?: string | null
          created_at?: string | null
          current_medications?: string | null
          dietary_preferences?: string | null
          id?: string
          lifestyle_habits?: string | null
          medical_history?: string | null
          pulse_rate?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          appointment_id: string
          created_at: string
          currency: string
          id: string
          payment_method: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          appointment_id: string
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          appointment_id?: string
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          aadhar_number: string
          created_at: string | null
          date_of_birth: string
          full_name: string
          id: string
          language_preference: string | null
          role: Database["public"]["Enums"]["app_role"]
          unique_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          aadhar_number: string
          created_at?: string | null
          date_of_birth: string
          full_name: string
          id?: string
          language_preference?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          unique_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          aadhar_number?: string
          created_at?: string | null
          date_of_birth?: string
          full_name?: string
          id?: string
          language_preference?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          unique_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      therapies: {
        Row: {
          benefits: string[] | null
          category: string
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          image_url: string | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          benefits?: string[] | null
          category: string
          created_at?: string
          description?: string | null
          duration_minutes: number
          id?: string
          image_url?: string | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          benefits?: string[] | null
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      therapist_assignments: {
        Row: {
          created_at: string
          doctor_id: string
          id: string
          is_active: boolean
          specialization: string
          therapist_id: string
          therapist_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          id?: string
          is_active?: boolean
          specialization: string
          therapist_id: string
          therapist_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          id?: string
          is_active?: boolean
          specialization?: string
          therapist_id?: string
          therapist_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          created_at: string
          end_time: string
          id: string
          is_available: boolean
          start_time: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          is_available?: boolean
          start_time: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          is_available?: boolean
          start_time?: string
        }
        Relationships: []
      }
      wellness_tracking: {
        Row: {
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          created_at: string
          date: string
          energy_score: number | null
          heart_rate: number | null
          id: string
          mood_score: number | null
          pain_score: number | null
          patient_id: string
          sleep_hours: number | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          created_at?: string
          date?: string
          energy_score?: number | null
          heart_rate?: number | null
          id?: string
          mood_score?: number | null
          pain_score?: number | null
          patient_id: string
          sleep_hours?: number | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          created_at?: string
          date?: string
          energy_score?: number | null
          heart_rate?: number | null
          id?: string
          mood_score?: number | null
          pain_score?: number | null
          patient_id?: string
          sleep_hours?: number | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_id: {
        Args: { role_type: Database["public"]["Enums"]["app_role"] }
        Returns: string
      }
      get_email_by_unique_id: {
        Args: { p_unique_id: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "patient" | "doctor" | "therapist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["patient", "doctor", "therapist"],
    },
  },
} as const

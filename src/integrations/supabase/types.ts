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
      administrator_workers: {
        Row: {
          created_at: string | null
          department: string
          id: string
          is_active: boolean | null
          position: string
          worker_id: string
        }
        Insert: {
          created_at?: string | null
          department: string
          id?: string
          is_active?: boolean | null
          position: string
          worker_id: string
        }
        Update: {
          created_at?: string | null
          department?: string
          id?: string
          is_active?: boolean | null
          position?: string
          worker_id?: string
        }
        Relationships: []
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
      profiles: {
        Row: {
          aadhar_number: string
          created_at: string | null
          date_of_birth: string
          full_name: string
          id: string
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
          role: Database["public"]["Enums"]["app_role"]
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
          role?: Database["public"]["Enums"]["app_role"]
          unique_id?: string
          updated_at?: string | null
          user_id?: string
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
      app_role: "patient" | "doctor" | "administrator"
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
      app_role: ["patient", "doctor", "administrator"],
    },
  },
} as const

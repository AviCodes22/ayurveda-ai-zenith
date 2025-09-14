// Deno Deploy / Supabase Edge Function - Register User
// Creates auth user, profile, and role-specific records using service role (bypasses RLS)
// CORS enabled and public (no JWT required)

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type UserRole = "patient" | "doctor" | "administrator";

type JsonResp = {
  success?: boolean;
  user_id?: string;
  unique_id?: string;
  error?: string;
  detail?: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase service configuration" } satisfies JsonResp),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body = await req.json();
    const {
      email,
      password,
      fullName,
      dateOfBirth,
      aadharNumber,
      role,
      patientDetails,
      doctorDetails,
      adminDetails,
    }: {
      email: string;
      password: string;
      fullName: string;
      dateOfBirth: string;
      aadharNumber: string;
      role: UserRole;
      patientDetails?: Record<string, unknown>;
      doctorDetails?: Record<string, unknown>;
      adminDetails?: { workerId: string };
    } = body;

    // Basic validation
    if (!email || !password || !fullName || !dateOfBirth || !aadharNumber || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" } satisfies JsonResp),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Verify admin worker ID
    if (role === "administrator") {
      const { data: worker, error: workerErr } = await supabase
        .from("administrator_workers")
        .select("worker_id, is_active")
        .eq("worker_id", adminDetails?.workerId ?? "")
        .maybeSingle();

      if (workerErr || !worker || worker.is_active !== true) {
        return new Response(
          JSON.stringify({ error: "Invalid or inactive administrator worker ID" } satisfies JsonResp),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    // Create auth user
    let userId: string | null = null;
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createErr) {
      // If email already exists, return a clear message
      if ((createErr as any).message?.toLowerCase().includes("already been registered") || (createErr as any).code === "email_exists") {
        return new Response(
          JSON.stringify({ error: "This email is already registered. Please sign in instead." } satisfies JsonResp),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: createErr.message || "Failed to create user" } satisfies JsonResp),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    userId = created!.user!.id;

    // Generate unique ID via RPC
    const { data: uniqueId, error: uidErr } = await supabase.rpc("generate_unique_id", { role_type: role });
    if (uidErr || !uniqueId) {
      return new Response(
        JSON.stringify({ error: "Failed to generate unique ID", detail: uidErr?.message } satisfies JsonResp),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Create profile (idempotent-ish: ignore duplicate aadhar/unique constraint violations)
    const { error: profileErr } = await supabase.from("profiles").insert({
      user_id: userId,
      unique_id: uniqueId,
      full_name: fullName,
      date_of_birth: dateOfBirth,
      aadhar_number: aadharNumber,
      role,
    });

    if (profileErr) {
      // If the user already has a profile, don't fail hard – fetch and return existing unique_id
      if (profileErr.code === "23505") {
        const { data: prof } = await supabase
          .from("profiles")
          .select("unique_id")
          .eq("user_id", userId)
          .maybeSingle();
        return new Response(
          JSON.stringify({ success: true, user_id: userId, unique_id: prof?.unique_id ?? uniqueId } satisfies JsonResp),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: profileErr.message || "Failed to create profile" } satisfies JsonResp),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Role-specific inserts
    if (role === "patient" && patientDetails) {
      const { error } = await supabase.from("patient_details").insert({
        user_id: userId,
        ...patientDetails,
      });
      if (error && error.code !== "23505") {
        return new Response(
          JSON.stringify({ error: error.message || "Failed to save patient details" } satisfies JsonResp),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    if (role === "doctor" && doctorDetails) {
      const { error } = await supabase.from("doctor_verification").insert({
        user_id: userId,
        ...doctorDetails,
      });
      if (error && error.code !== "23505") {
        return new Response(
          JSON.stringify({ error: error.message || "Failed to save doctor verification" } satisfies JsonResp),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, user_id: userId, unique_id: uniqueId } satisfies JsonResp),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("register function error", e);
    return new Response(
      JSON.stringify({ error: e?.message || "Unknown error" } satisfies JsonResp),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

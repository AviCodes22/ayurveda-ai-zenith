import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
        JSON.stringify({ success: false, error: "Missing Supabase service configuration" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body = await req.json();
    const { email }: { email: string } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log(`Attempting to delete user with email: ${email}`);

    // Get user by email
    const { data: users, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      console.error("Error listing users:", getUserError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to find user" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const user = users?.users?.find(u => u.email === email);
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      return new Response(
        JSON.stringify({ success: false, error: "User not found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log(`Found user with ID: ${user.id}`);

    // Delete from profiles table first
    const { error: profileDeleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("user_id", user.id);

    if (profileDeleteError) {
      console.error("Error deleting profile:", profileDeleteError);
    } else {
      console.log("Profile deleted successfully");
    }

    // Delete from auth.users table
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (authDeleteError) {
      console.error("Error deleting user from auth:", authDeleteError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to delete user from auth" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log(`User ${email} deleted successfully`);

    return new Response(
      JSON.stringify({ success: true, message: `User ${email} deleted successfully` }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );

  } catch (error) {
    console.error("Delete user function error:", error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message || "Unknown error" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
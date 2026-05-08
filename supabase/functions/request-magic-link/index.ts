import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, content-type",
}

interface RequestBody {
  email: string
  redirectTo?: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const body: RequestBody = await req.json()
    const { email, redirectTo } = body

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    const resendApiKey = Deno.env.get("RESEND_API_KEY")

    if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
      console.error("Missing environment variables")
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // Create admin client with service role key to generate auth link
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Generate magic link using admin API
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: email.trim(),
      options: {
        redirectTo: redirectTo || `${supabaseUrl}/auth/v1/verify`,
      },
    })

    if (error) {
      console.error("Generate link error:", error)
      return new Response(
        JSON.stringify({ error: "Failed to generate magic link" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    if (!data?.properties?.email_otp_link) {
      return new Response(
        JSON.stringify({ error: "Failed to generate magic link" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // Send via Resend API (bypasses Supabase quota)
    const magicLink = data.properties.email_otp_link
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BindIQ <noreply@usebindiq.com>",
        to: email.trim(),
        subject: "Sign in to BindIQ",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Sign in to BindIQ</h2>
            <p>Click the link below to sign in to your BindIQ account:</p>
            <p>
              <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px;">
                Sign in to BindIQ
              </a>
            </p>
            <p style="color: #666; font-size: 12px;">
              Or copy and paste this link in your browser:<br>
              <code>${magicLink}</code>
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              This link expires in 24 hours.
            </p>
          </div>
        `,
      }),
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      console.error("Resend error:", resendData)
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // Success
    return new Response(
      JSON.stringify({
        success: true,
        message: "Magic link sent to email",
        messageId: resendData.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    console.error("Error:", error)
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})

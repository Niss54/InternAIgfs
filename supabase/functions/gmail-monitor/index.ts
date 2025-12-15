import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GmailCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GMAIL-MONITOR] ${step}${detailsStr}`);
};

// Extract interview dates from email content
function extractInterviewDates(emailContent: string, subject: string): Date[] {
  const dates: Date[] = [];
  const text = `${subject} ${emailContent}`.toLowerCase();
  
  // Date patterns
  const datePatterns = [
    // Format: "January 15, 2024 at 2:00 PM"
    /(\w+\s+\d{1,2},\s+\d{4}\s+at\s+\d{1,2}:\d{2}\s*[ap]m)/gi,
    // Format: "Jan 15, 2024 2:00 PM"
    /(\w{3}\s+\d{1,2},\s+\d{4}\s+\d{1,2}:\d{2}\s*[ap]m)/gi,
    // Format: "15/01/2024 14:00"
    /(\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2})/gi,
    // Format: "2024-01-15 14:00"
    /(\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2})/gi,
  ];

  datePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const date = new Date(match);
        if (!isNaN(date.getTime()) && date > new Date()) {
          dates.push(date);
        }
      });
    }
  });

  return dates;
}

async function getAccessToken(credentials: GmailCredentials): Promise<string> {
  const tokenUrl = "https://oauth2.googleapis.com/token";
  
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      refresh_token: credentials.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchRecentEmails(accessToken: string) {
  const gmailUrl = "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=interview OR scheduling OR appointment&maxResults=10";
  
  const response = await fetch(gmailUrl, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Gmail API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.messages || [];
}

async function getEmailDetails(accessToken: string, messageId: string) {
  const emailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`;
  
  const response = await fetch(emailUrl, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch email details: ${response.statusText}`);
  }

  return await response.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Gmail monitor function started");

    // Get Gmail credentials from environment
    const gmailCredentials: GmailCredentials = {
      clientId: Deno.env.get("GMAIL_CLIENT_ID") || "",
      clientSecret: Deno.env.get("GMAIL_CLIENT_SECRET") || "",
      refreshToken: Deno.env.get("GMAIL_REFRESH_TOKEN") || "",
    };

    if (!gmailCredentials.clientId || !gmailCredentials.clientSecret || !gmailCredentials.refreshToken) {
      throw new Error("Missing Gmail credentials");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id });

    // Get Gmail access token
    const accessToken = await getAccessToken(gmailCredentials);
    logStep("Gmail access token obtained");

    // Fetch recent emails
    const messages = await fetchRecentEmails(accessToken);
    logStep("Fetched recent emails", { count: messages.length });

    const processedEmails = [];

    for (const message of messages) {
      try {
        const emailDetails = await getEmailDetails(accessToken, message.id);
        
        // Extract subject and body
        const headers = emailDetails.payload.headers;
        const subject = headers.find((h: any) => h.name === "Subject")?.value || "";
        const from = headers.find((h: any) => h.name === "From")?.value || "";
        
        let body = "";
        if (emailDetails.payload.body?.data) {
          body = atob(emailDetails.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        } else if (emailDetails.payload.parts) {
          const textPart = emailDetails.payload.parts.find((part: any) => 
            part.mimeType === "text/plain" || part.mimeType === "text/html"
          );
          if (textPart?.body?.data) {
            body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          }
        }

        // Extract interview dates
        const interviewDates = extractInterviewDates(body, subject);
        
        if (interviewDates.length > 0) {
          logStep("Found interview dates in email", { 
            subject, 
            from,
            dates: interviewDates.map(d => d.toISOString())
          });

          // Save to database for each interview date found
          for (const interviewDate of interviewDates) {
            try {
              // First, find or create an application record
              let applicationId = null;
              
              // Try to find existing application based on email content/company
              const { data: existingApp } = await supabaseClient
                .from("applications")
                .select("id")
                .eq("user_id", user.id)
                .limit(1)
                .single();

              if (existingApp) {
                applicationId = existingApp.id;
              } else {
                // Create a placeholder application
                const { data: newApp, error: appError } = await supabaseClient
                  .from("applications")
                  .insert({
                    user_id: user.id,
                    internship_id: "00000000-0000-0000-0000-000000000000", // Placeholder
                    status: "interview",
                    notes: `Auto-detected from email: ${subject}`,
                  })
                  .select("id")
                  .single();

                if (appError) {
                  logStep("Error creating application", { error: appError });
                  continue;
                }
                applicationId = newApp.id;
              }

              // Update application with interview date
              const { error: updateError } = await supabaseClient
                .from("applications")
                .update({
                  interview_date: interviewDate.toISOString(),
                  status: "interview"
                })
                .eq("id", applicationId);

              if (updateError) {
                logStep("Error updating application", { error: updateError });
              } else {
                logStep("Successfully updated application with interview date");
              }

              processedEmails.push({
                subject,
                from,
                interviewDate: interviewDate.toISOString(),
                applicationId
              });

            } catch (dbError) {
              logStep("Database error", { error: dbError });
            }
          }
        }
      } catch (emailError) {
        logStep("Error processing email", { error: emailError, messageId: message.id });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      emailsProcessed: messages.length,
      interviewsFound: processedEmails.length,
      interviews: processedEmails
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in gmail-monitor", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
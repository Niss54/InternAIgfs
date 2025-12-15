import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[EMAIL-AUTO-REPLY] ${step}${detailsStr}`);
};

interface EmailReplyRequest {
  emailContent: string;
  senderEmail: string;
  subject: string;
  companyName?: string;
  internshipRole?: string;
  userProfile?: any;
}

async function generateProfessionalReply(
  emailContent: string, 
  subject: string,
  companyName?: string,
  internshipRole?: string,
  userProfile?: any
): Promise<string> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const userName = userProfile?.full_name || "the candidate";
  const roleInfo = internshipRole ? ` for the ${internshipRole} position` : "";
  const companyInfo = companyName ? ` at ${companyName}` : "";

  const systemPrompt = `You are an AI assistant helping ${userName} craft professional email replies to internship providers. 

Generate a polite, professional, and engaging email response that:
1. Shows enthusiasm for the opportunity
2. Demonstrates professionalism and good communication skills
3. Includes relevant questions about the role/company when appropriate
4. Maintains a confident but humble tone
5. Is concise and well-structured
6. Uses proper business email etiquette

The response should be personalized and thoughtful, not generic. Match the tone of the original email while being professional.`;

  const userPrompt = `Original email subject: "${subject}"
Original email content: "${emailContent}"

Context:
- Company: ${companyName || "Not specified"}
- Role: ${internshipRole || "Not specified"}
- Candidate: ${userName}

Please generate a professional reply email that appropriately responds to this message. Include only the email body content, not subject line or greetings.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    logStep("OpenAI API Error", { error: error.message });
    
    // Fallback template response
    return `Dear Hiring Team,

Thank you for reaching out regarding the internship opportunity${roleInfo}${companyInfo}. I am very interested in this position and excited about the possibility of contributing to your team.

I would appreciate the opportunity to discuss how my skills and enthusiasm align with your requirements. Please let me know if you need any additional information from my end or if there are next steps I should be aware of.

I look forward to hearing from you soon.

Best regards,
${userName}`;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Email auto-reply function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
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

    // Get user profile for personalization
    const { data: userProfile } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const {
      emailContent,
      senderEmail,
      subject,
      companyName,
      internshipRole
    }: EmailReplyRequest = await req.json();

    if (!emailContent || !senderEmail || !subject) {
      throw new Error("Missing required fields: emailContent, senderEmail, and subject are required");
    }

    logStep("Processing email reply request", { 
      senderEmail, 
      subject: subject.substring(0, 50),
      companyName,
      internshipRole 
    });

    // Generate professional reply using OpenAI
    const replyContent = await generateProfessionalReply(
      emailContent,
      subject,
      companyName,
      internshipRole,
      userProfile
    );

    logStep("Generated professional reply");

    // Prepare reply email structure
    const emailReply = {
      subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
      body: replyContent,
      to: senderEmail,
      from: user.email,
      replyTo: emailContent,
      generatedAt: new Date().toISOString()
    };

    // You could optionally save this to a database table for tracking
    // or integrate with an email sending service here

    return new Response(JSON.stringify({
      success: true,
      reply: emailReply,
      message: "Professional email reply generated successfully"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in email-auto-reply", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
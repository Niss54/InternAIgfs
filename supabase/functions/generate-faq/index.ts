import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user from JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid user token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Fetch recent applications
    const { data: applications } = await supabase
      .from('applications')
      .select('*, internships(*)')
      .eq('user_id', user.id)
      .order('applied_at', { ascending: false })
      .limit(3);

    // Generate personalized context
    const userContext = `
User Profile:
- Name: ${profile?.full_name || 'User'}
- Skills: ${profile?.skills?.join(', ') || 'Not specified'}
- Role Preference: ${profile?.role_preference || 'Any role'}
- Location: ${profile?.location_preference || 'Any location'}
- Experience Level: ${profile?.bio ? 'Has experience' : 'Entry level'}
- Recent Applications: ${applications?.map(a => a.internships?.title).join(', ') || 'None'}
`;

    const prompt = `Based on the following user profile, generate 10 highly personalized FAQ questions and answers that this specific user would find helpful for their internship search and career development.

${userContext}

Generate FAQs that are:
1. Specific to their skills and preferences
2. Relevant to their career stage
3. Practical and actionable
4. Related to their recent activity on the platform

Format the response as a JSON array with exactly 10 objects, each having 'question' and 'answer' fields.
The answers should be detailed (2-3 sentences) and personalized.

Example format:
[
  {
    "question": "How can I improve my chances...",
    "answer": "Based on your skills in..., you should..."
  }
]`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const faqContent = data.candidates[0].content.parts[0].text;
    let faqs;
    
    try {
      faqs = JSON.parse(faqContent);
    } catch (e) {
      console.error('Failed to parse FAQ JSON:', e);
      // Fallback FAQs if parsing fails
      faqs = [
        {
          question: "How can I make my profile stand out to recruiters?",
          answer: "Focus on highlighting your unique skills and experiences. Add specific projects you've worked on and quantify your achievements where possible."
        },
        {
          question: "What's the best way to prepare for technical interviews?",
          answer: "Practice coding problems daily, review fundamental concepts in your field, and do mock interviews. Focus on explaining your thought process clearly."
        },
        {
          question: "How many internships should I apply to?",
          answer: "Apply to 10-15 internships per week that match your skills and interests. Quality over quantity - tailor each application to the specific role."
        },
        {
          question: "When is the best time to apply for summer internships?",
          answer: "Start applying in September-November for summer internships. Many companies have early deadlines, and positions fill up quickly."
        },
        {
          question: "Should I follow up after applying?",
          answer: "Yes, send a polite follow-up email after 1-2 weeks if you haven't heard back. Express continued interest and ask about the timeline."
        },
        {
          question: "How important is GPA for internship applications?",
          answer: "While some companies have GPA requirements, many value skills and experience more. Focus on building projects and gaining practical experience."
        },
        {
          question: "What should I include in my cover letter?",
          answer: "Explain why you're interested in the company, highlight relevant experiences, and show how you can add value. Keep it concise and tailored."
        },
        {
          question: "How can I network effectively as a student?",
          answer: "Attend career fairs, join professional organizations, engage on LinkedIn, and reach out to alumni. Build genuine relationships, not just connections."
        },
        {
          question: "What skills are most in-demand for internships?",
          answer: "Technical skills vary by field, but communication, problem-solving, teamwork, and adaptability are universally valued by employers."
        },
        {
          question: "How do I negotiate internship stipends?",
          answer: "Research industry standards, highlight your unique value, and be professional. If the stipend is non-negotiable, ask about other benefits or learning opportunities."
        }
      ];
    }

    return new Response(
      JSON.stringify({ faqs }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('FAQ generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate FAQs. Please try again.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
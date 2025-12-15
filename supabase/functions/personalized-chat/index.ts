import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  conversationHistory?: any[];
  sessionId?: string;
}

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

    const { message, conversationHistory = [], sessionId } = await req.json() as ChatRequest;

    // Fetch user context
    const [profileResult, applicationsResult, interviewsResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('applications')
        .select('*, internships(*)')
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false })
        .limit(5),
      supabase.from('interviews')
        .select('*, applications(*, internships(*))')
        .eq('applications.user_id', user.id)
        .order('interview_date', { ascending: false })
        .limit(3)
    ]);

    const profile = profileResult.data;
    const applications = applicationsResult.data || [];
    const interviews = interviewsResult.data || [];

    // Build personalized context
    const userContext = {
      name: profile?.full_name || 'there',
      email: profile?.email,
      phone: profile?.phone,
      skills: profile?.skills || [],
      bio: profile?.bio,
      isPremium: profile?.is_premium,
      locationPreference: profile?.location_preference,
      rolePreference: profile?.role_preference,
      expectedStipend: profile?.expected_stipend,
      applications: applications.map(app => ({
        company: app.internships?.company_name,
        position: app.internships?.title,
        status: app.status,
        appliedAt: app.applied_at,
        interviewDate: app.interview_date
      })),
      upcomingInterviews: interviews.map(interview => ({
        company: interview.applications?.internships?.company_name,
        date: interview.interview_date,
        type: interview.interview_type,
        meetingLink: interview.meeting_link
      }))
    };

    // Create system prompt with user context
    const systemPrompt = `You are InternAI's friendly career mentor chatbot. You have access to the following user information:

User Profile:
- Name: ${userContext.name}
- Email: ${userContext.email || 'Not provided'}
- Skills: ${userContext.skills.join(', ') || 'Not specified'}
- Bio: ${userContext.bio || 'Not provided'}
- Subscription: ${userContext.isPremium ? 'Premium' : 'Free'} user
- Location Preference: ${userContext.locationPreference || 'Any'}
- Role Preference: ${userContext.rolePreference || 'Any'}
- Expected Stipend: ${userContext.expectedStipend ? `₹${userContext.expectedStipend}/month` : 'Not specified'}

Recent Applications (${applications.length}):
${userContext.applications.map(app => 
  `- ${app.position} at ${app.company} (Status: ${app.status})`
).join('\n')}

Upcoming Interviews (${interviews.length}):
${userContext.upcomingInterviews.map(int => 
  `- ${int.type} interview on ${new Date(int.date).toLocaleDateString()} with ${int.company}`
).join('\n')}

Instructions:
1. ALWAYS address the user by their name (${userContext.name})
2. Be friendly, supportive, and encouraging like a career mentor
3. Keep responses concise and clear (2-3 paragraphs max)
4. Use the user's data to provide personalized advice
5. If asked about features they don't have access to (Free vs Premium), guide them appropriately
6. If information is missing, politely suggest they update their profile
7. Be proactive in offering relevant tips based on their situation
8. Maintain a professional yet warm tone throughout`;

    // Prepare messages for Gemini
    const messages = [
      ...conversationHistory,
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    // Store chat session if sessionId provided
    if (sessionId) {
      const chatSession = {
        user_id: user.id,
        messages: JSON.stringify([...conversationHistory, 
          { role: 'user', parts: [{ text: message }] },
          { role: 'model', parts: [{ text: aiResponse }] }
        ]),
        context: userContext,
        updated_at: new Date().toISOString()
      };

      await supabase
        .from('chat_sessions')
        .upsert({ id: sessionId, ...chatSession }, { onConflict: 'id' });
    }

    return new Response(
      JSON.stringify({ response: aiResponse, sessionId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Personalized chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to get AI response. Please try again.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
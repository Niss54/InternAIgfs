import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SimulationRequest {
  role_type: string;
  simulation_type: 'technical' | 'behavioral' | 'final';
  answers?: Array<{ question: string; answer: string; time_taken?: number }>;
  action: 'start' | 'submit' | 'get_feedback';
  simulation_id?: string;
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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Invalid user token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { role_type, simulation_type, answers, action, simulation_id }: SimulationRequest = await req.json();

    // Get user profile for context
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (action === 'start') {
      // Generate interview questions based on role and type
      let questionPrompt = '';
      let questionCount = 5;

      if (simulation_type === 'technical') {
        questionPrompt = `Generate ${questionCount} technical interview questions for a ${role_type} intern position. 
        Include questions about:
        - Core technical skills for ${role_type}
        - Problem-solving and coding challenges
        - System design basics (if applicable)
        - Best practices and tools
        
        User skills: ${profile?.skills?.join(', ') || 'Not specified'}
        
        Format as JSON array of objects with 'question', 'difficulty' (easy/medium/hard), and 'category' fields.`;
      } else if (simulation_type === 'behavioral') {
        questionPrompt = `Generate ${questionCount} behavioral interview questions for a ${role_type} intern position.
        Include questions about:
        - Teamwork and collaboration
        - Problem-solving approach
        - Leadership and initiative
        - Handling challenges and failures
        - Motivation and career goals
        
        Format as JSON array of objects with 'question', 'focus_area', and 'evaluation_criteria' fields.`;
      } else if (simulation_type === 'final') {
        questionCount = 3;
        questionPrompt = `Generate ${questionCount} final round interview questions for a ${role_type} intern position.
        Include questions about:
        - Why this company/role specifically
        - Long-term career vision
        - Unique value proposition
        - Cultural fit scenarios
        
        Format as JSON array of objects with 'question', 'purpose', and 'ideal_response_elements' fields.`;
      }

      // Call Gemini API to generate questions
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: questionPrompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const questionsText = data.candidates[0].content.parts[0].text;
      
      // Parse questions from response
      let questions;
      try {
        // Extract JSON from response
        const jsonMatch = questionsText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          questions = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: create questions from text
          questions = questionsText.split('\n')
            .filter((line: string) => line.trim().startsWith('1.') || line.trim().startsWith('2.') || 
                    line.trim().startsWith('3.') || line.trim().startsWith('4.') || line.trim().startsWith('5.'))
            .map((q: string, index: number) => ({
              question: q.replace(/^\d+\.\s*/, '').trim(),
              difficulty: index < 2 ? 'easy' : index < 4 ? 'medium' : 'hard',
              category: simulation_type
            }));
        }
      } catch (parseError) {
        console.error('Error parsing questions:', parseError);
        // Fallback questions based on simulation type
        if (simulation_type === 'technical') {
          questions = [
            { question: `What programming languages are you most comfortable with for ${role_type} development?`, difficulty: 'easy', category: 'technical' },
            { question: `Describe your experience with version control systems like Git.`, difficulty: 'easy', category: 'technical' },
            { question: `How would you approach debugging a complex issue in a ${role_type} application?`, difficulty: 'medium', category: 'technical' },
            { question: `Explain the concept of API design and RESTful services.`, difficulty: 'medium', category: 'technical' },
            { question: `Walk me through how you would design a scalable system for ${role_type}.`, difficulty: 'hard', category: 'technical' }
          ];
        } else if (simulation_type === 'behavioral') {
          questions = [
            { question: 'Tell me about a time when you had to work in a team to complete a project.', focus_area: 'teamwork', evaluation_criteria: 'collaboration' },
            { question: 'Describe a challenging problem you solved and your approach.', focus_area: 'problem-solving', evaluation_criteria: 'analytical thinking' },
            { question: 'How do you handle constructive criticism and feedback?', focus_area: 'growth mindset', evaluation_criteria: 'adaptability' },
            { question: 'Tell me about a time when you took initiative on a project.', focus_area: 'leadership', evaluation_criteria: 'proactivity' },
            { question: 'Why are you interested in this internship and our company?', focus_area: 'motivation', evaluation_criteria: 'genuine interest' }
          ];
        } else {
          questions = [
            { question: 'What specific aspect of our company culture excites you most?', purpose: 'cultural fit', ideal_response_elements: ['research', 'alignment'] },
            { question: 'Where do you see yourself in 5 years, and how does this role fit?', purpose: 'career vision', ideal_response_elements: ['growth', 'commitment'] },
            { question: 'What unique perspective or skill would you bring to our team?', purpose: 'value proposition', ideal_response_elements: ['uniqueness', 'relevance'] }
          ];
        }
      }

      // Create simulation record
      const { data: simulation, error: insertError } = await supabaseClient
        .from('interview_simulations')
        .insert({
          user_id: user.id,
          role_type,
          simulation_type,
          questions: JSON.stringify(questions),
          answers: JSON.stringify([]),
          feedback: JSON.stringify({})
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return new Response(
        JSON.stringify({
          simulation_id: simulation.id,
          questions,
          simulation_type,
          role_type,
          instructions: {
            technical: 'Answer each question thoughtfully. You have 5 minutes per question. Focus on demonstrating your technical knowledge and problem-solving approach.',
            behavioral: 'Use the STAR method (Situation, Task, Action, Result) for your responses. Be specific and provide concrete examples.',
            final: 'These questions assess cultural fit and long-term vision. Be authentic and show your research about the company.'
          }[simulation_type]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'submit' && simulation_id && answers) {
      // Submit answers and generate feedback
      const { data: simulation } = await supabaseClient
        .from('interview_simulations')
        .select('*')
        .eq('id', simulation_id)
        .eq('user_id', user.id)
        .single();

      if (!simulation) {
        return new Response(
          JSON.stringify({ error: 'Simulation not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      const questions = JSON.parse(simulation.questions);
      
      // Generate AI feedback for each answer
      const feedbackPrompt = `As an experienced hiring manager, provide detailed feedback for this ${simulation_type} interview simulation for a ${role_type} intern position.

Questions and Answers:
${answers.map((a, i) => `
Q${i+1}: ${a.question}
A${i+1}: ${a.answer}
Time taken: ${a.time_taken || 'Not recorded'}
`).join('')}

Please provide:
1. Overall performance score (1-100)
2. Individual question feedback with scores
3. Strengths demonstrated
4. Areas for improvement  
5. Specific recommendations for better responses
6. Communication quality assessment

User background: ${profile?.skills?.join(', ') || 'No skills listed'}

Format response as JSON with the structure:
{
  "overall_score": number,
  "individual_scores": [{"question_index": 0, "score": number, "feedback": "string"}],
  "strengths": ["string"],
  "improvements": ["string"], 
  "recommendations": ["string"],
  "communication_score": number
}`;

      const feedbackResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: feedbackPrompt }]
            }],
            generationConfig: {
              temperature: 0.3,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            }
          })
        }
      );

      const feedbackData = await feedbackResponse.json();
      const feedbackText = feedbackData.candidates[0].content.parts[0].text;
      
      let feedback;
      try {
        const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          feedback = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in feedback');
        }
      } catch (parseError) {
        // Fallback feedback structure
        feedback = {
          overall_score: 75,
          individual_scores: answers.map((_, i) => ({
            question_index: i,
            score: 70 + Math.floor(Math.random() * 20),
            feedback: "Good response, could be more detailed with specific examples."
          })),
          strengths: ["Clear communication", "Relevant experience mentioned"],
          improvements: ["Provide more specific examples", "Structure responses better"],
          recommendations: ["Practice the STAR method", "Research the company more thoroughly"],
          communication_score: 80
        };
      }

      // Calculate duration
      const duration = Math.floor((Date.now() - new Date(simulation.created_at).getTime()) / (1000 * 60));

      // Update simulation with answers and feedback
      await supabaseClient
        .from('interview_simulations')
        .update({
          answers: JSON.stringify(answers),
          feedback: JSON.stringify(feedback),
          score: feedback.overall_score,
          duration_minutes: duration
        })
        .eq('id', simulation_id);

      return new Response(
        JSON.stringify({
          feedback,
          simulation_id,
          duration_minutes: duration,
          completed_at: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'get_feedback' && simulation_id) {
      // Get existing simulation feedback
      const { data: simulation } = await supabaseClient
        .from('interview_simulations')
        .select('*')
        .eq('id', simulation_id)
        .eq('user_id', user.id)
        .single();

      if (!simulation) {
        return new Response(
          JSON.stringify({ error: 'Simulation not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      return new Response(
        JSON.stringify({
          simulation,
          questions: JSON.parse(simulation.questions),
          answers: JSON.parse(simulation.answers),
          feedback: JSON.parse(simulation.feedback)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (error) {
    console.error('Interview Simulator error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process interview simulation' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
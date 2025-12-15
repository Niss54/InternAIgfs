import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CustomizationRequest {
  internship_id: string;
  base_resume_data: any;
  customization_type: 'resume' | 'cover_letter' | 'linkedin_summary' | 'all';
  template_id?: string;
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

    const { 
      internship_id, 
      base_resume_data, 
      customization_type, 
      template_id = 'modern' 
    }: CustomizationRequest = await req.json();

    // Get internship details
    const { data: internship } = await supabaseClient
      .from('internships')
      .select('*')
      .eq('id', internship_id)
      .single();

    if (!internship) {
      return new Response(
        JSON.stringify({ error: 'Internship not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Get user profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Check if customization already exists
    const { data: existingCustomization } = await supabaseClient
      .from('resume_customizations')
      .select('*')
      .eq('user_id', user.id)
      .eq('internship_id', internship_id)
      .single();

    let customizedContent: any = {};

    if (customization_type === 'resume' || customization_type === 'all') {
      // Generate customized resume content
      const resumePrompt = `As an ATS optimization expert, customize this resume for the specific internship posting below.

INTERNSHIP DETAILS:
Company: ${internship.company_name}
Role: ${internship.title}
Description: ${internship.description || ''}
Required Skills: ${internship.skills_required?.join(', ') || ''}
Requirements: ${internship.requirements?.join(', ') || ''}

CURRENT RESUME DATA:
Personal Info: ${JSON.stringify(base_resume_data.personalInfo)}
Experience: ${JSON.stringify(base_resume_data.experience)}
Education: ${JSON.stringify(base_resume_data.education)}
Skills: ${JSON.stringify(base_resume_data.skills)}
Projects: ${JSON.stringify(base_resume_data.projects)}

CUSTOMIZATION REQUIREMENTS:
1. Reorder and highlight the most relevant skills for this specific role
2. Customize project descriptions to emphasize relevant technologies and outcomes
3. Tailor experience descriptions to match the job requirements
4. Optimize the professional summary to align with the company and role
5. Ensure ATS compatibility by including key terms from the job posting
6. Maintain truthfulness - only emphasize existing skills and experiences

Return the customized resume data in the same JSON structure as the input, with optimized content that will score higher in ATS systems for this specific internship.

Format as JSON with the same structure as the input resume data.`;

      const resumeResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: resumePrompt }]
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

      const resumeData = await resumeResponse.json();
      const resumeText = resumeData.candidates[0].content.parts[0].text;
      
      try {
        const jsonMatch = resumeText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          customizedContent.resume = JSON.parse(jsonMatch[0]);
        } else {
          customizedContent.resume = base_resume_data; // Fallback
        }
      } catch (parseError) {
        console.error('Error parsing resume customization:', parseError);
        customizedContent.resume = base_resume_data;
      }
    }

    if (customization_type === 'cover_letter' || customization_type === 'all') {
      // Generate customized cover letter
      const coverLetterPrompt = `Write a compelling cover letter for this specific internship application.

INTERNSHIP DETAILS:
Company: ${internship.company_name}
Role: ${internship.title}
Description: ${internship.description || ''}
Required Skills: ${internship.skills_required?.join(', ') || ''}

APPLICANT DETAILS:
Name: ${base_resume_data.personalInfo?.name || profile?.full_name || 'Student'}
Skills: ${base_resume_data.skills?.map((s: any) => s.items).flat().join(', ') || profile?.skills?.join(', ') || ''}
Experience: ${base_resume_data.experience?.map((e: any) => `${e.position} at ${e.company}`).join(', ') || 'Recent graduate'}
Education: ${base_resume_data.education?.map((e: any) => `${e.degree} from ${e.institution}`).join(', ') || 'Student'}

REQUIREMENTS:
1. Professional and engaging tone
2. Specific mention of why this company and role
3. Highlight relevant skills and experiences from the resume
4. Show enthusiasm and cultural fit
5. Call to action
6. Keep it concise (3-4 paragraphs)
7. Address the hiring manager professionally

Write a complete cover letter that will stand out to recruiters.`;

      const coverResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: coverLetterPrompt }]
            }],
            generationConfig: {
              temperature: 0.4,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      const coverData = await coverResponse.json();
      customizedContent.cover_letter = coverData.candidates[0].content.parts[0].text;
    }

    if (customization_type === 'linkedin_summary' || customization_type === 'all') {
      // Generate LinkedIn summary
      const linkedinPrompt = `Create an optimized LinkedIn summary/about section for someone applying to this internship.

TARGET INTERNSHIP:
Company: ${internship.company_name}
Role: ${internship.title}
Industry Focus: ${internship.skills_required?.join(', ') || 'Technology'}

CANDIDATE BACKGROUND:
Skills: ${base_resume_data.skills?.map((s: any) => s.items).flat().join(', ') || profile?.skills?.join(', ') || ''}
Experience: ${base_resume_data.experience?.map((e: any) => e.position).join(', ') || 'Student'}
Education: ${base_resume_data.education?.map((e: any) => e.degree).join(', ') || 'Current student'}

REQUIREMENTS:
1. Professional but personable tone
2. Include relevant keywords for discoverability
3. Highlight key achievements and skills
4. Show career aspirations aligned with the industry
5. Include a call-to-action
6. 2-3 paragraphs, engaging and authentic
7. Optimize for LinkedIn search algorithms

Write a compelling LinkedIn About section that will attract recruiters in this field.`;

      const linkedinResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: linkedinPrompt }]
            }],
            generationConfig: {
              temperature: 0.5,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      const linkedinData = await linkedinResponse.json();
      customizedContent.linkedin_summary = linkedinData.candidates[0].content.parts[0].text;
    }

    // Store or update customization
    const customizationData = {
      user_id: user.id,
      internship_id,
      customized_content: customizedContent,
      cover_letter: customizedContent.cover_letter || null,
      linkedin_summary: customizedContent.linkedin_summary || null,
      template_id
    };

    let savedCustomization;
    if (existingCustomization) {
      const { data: updated } = await supabaseClient
        .from('resume_customizations')
        .update(customizationData)
        .eq('id', existingCustomization.id)
        .select()
        .single();

      savedCustomization = updated;
    } else {
      const { data: created } = await supabaseClient
        .from('resume_customizations')
        .insert(customizationData)
        .select()
        .single();

      savedCustomization = created;
    }

    // Generate ATS optimization score
    const atsScore = calculateATSScore(customizedContent.resume || base_resume_data, internship);

    return new Response(
      JSON.stringify({
        customization_id: savedCustomization?.id,
        customized_content: customizedContent,
        ats_score: atsScore,
        optimization_tips: [
          'Resume tailored with relevant keywords from job posting',
          'Skills section reordered by relevance to the role',
          'Experience descriptions optimized for ATS scanning',
          'Professional summary aligned with company values'
        ],
        internship_match: {
          company: internship.company_name,
          role: internship.title,
          key_requirements_addressed: internship.skills_required?.slice(0, 5) || []
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Resume Tailor error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to customize resume' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function calculateATSScore(resumeData: any, internship: any): number {
  let score = 0;
  const maxScore = 100;

  // Keyword matching (40 points)
  if (internship.skills_required && resumeData.skills) {
    const requiredSkills = internship.skills_required.map((s: string) => s.toLowerCase());
    const resumeSkills = resumeData.skills.flatMap((s: any) => s.items || []).map((s: string) => s.toLowerCase());
    
    const matchingSkills = requiredSkills.filter((req: string) => 
      resumeSkills.some((res: string) => res.includes(req) || req.includes(res))
    );
    
    score += (matchingSkills.length / requiredSkills.length) * 40;
  }

  // Contact information completeness (15 points)
  if (resumeData.personalInfo) {
    const requiredFields = ['name', 'email', 'phone'];
    const presentFields = requiredFields.filter(field => resumeData.personalInfo[field]);
    score += (presentFields.length / requiredFields.length) * 15;
  }

  // Experience relevance (20 points)
  if (resumeData.experience && resumeData.experience.length > 0) {
    score += Math.min(20, resumeData.experience.length * 5);
  }

  // Education (10 points)
  if (resumeData.education && resumeData.education.length > 0) {
    score += 10;
  }

  // Projects (10 points)
  if (resumeData.projects && resumeData.projects.length > 0) {
    score += Math.min(10, resumeData.projects.length * 3);
  }

  // Professional summary (5 points)
  if (resumeData.personalInfo?.summary && resumeData.personalInfo.summary.length > 50) {
    score += 5;
  }

  return Math.min(maxScore, Math.round(score));
}
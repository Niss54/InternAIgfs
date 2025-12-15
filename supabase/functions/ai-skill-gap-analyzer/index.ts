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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Invalid user token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Get user profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check if we have recent analysis (within 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const { data: recentAnalysis } = await supabaseClient
      .from('skill_gap_analysis')
      .select('*')
      .eq('user_id', user.id)
      .gte('analysis_date', weekAgo.toISOString().split('T')[0])
      .order('created_at', { ascending: false })
      .limit(1);

    if (recentAnalysis && recentAnalysis.length > 0) {
      return new Response(
        JSON.stringify({
          analysis: recentAnalysis[0],
          cached: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get market demand data from internships
    const { data: internships } = await supabaseClient
      .from('internships')
      .select('skills_required, title, company_name')
      .eq('is_active', true)
      .not('skills_required', 'is', null)
      .limit(500); // Get recent internships for market analysis

    if (!internships || internships.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No market data available' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Analyze market demand
    const skillFrequency: Record<string, number> = {};
    const roleSkillMap: Record<string, Set<string>> = {};

    internships.forEach(internship => {
      if (internship.skills_required) {
        const role = internship.title.toLowerCase().split(' ')[0]; // Get first word as role indicator
        if (!roleSkillMap[role]) roleSkillMap[role] = new Set();

        internship.skills_required.forEach((skill: string) => {
          const normalizedSkill = skill.toLowerCase().trim();
          skillFrequency[normalizedSkill] = (skillFrequency[normalizedSkill] || 0) + 1;
          roleSkillMap[role].add(normalizedSkill);
        });
      }
    });

    // Get top market skills (appearing in at least 5% of jobs)
    const minFrequency = Math.max(3, Math.floor(internships.length * 0.05));
    const marketSkills = Object.entries(skillFrequency)
      .filter(([_, count]) => count >= minFrequency)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 20)
      .map(([skill]) => skill);

    // User's current skills
    const userSkills = (profile.skills || []).map((s: string) => s.toLowerCase());
    
    // Find skill gaps
    const gapSkills = marketSkills.filter(marketSkill => 
      !userSkills.some(userSkill => 
        userSkill.includes(marketSkill) || marketSkill.includes(userSkill)
      )
    );

    // Generate recommendations based on user's role preference
    const userRole = profile.role_preference?.toLowerCase() || 'general';
    let roleSpecificRecommendations: string[] = [];

    // Find role-specific skill gaps
    for (const [role, skills] of Object.entries(roleSkillMap)) {
      if (userRole.includes(role) || role.includes(userRole.split(' ')[0])) {
        const roleSkills = Array.from(skills);
        const roleGaps = roleSkills.filter(skill => 
          !userSkills.some(userSkill => 
            userSkill.includes(skill) || skill.includes(userSkill)
          )
        );
        roleSpecificRecommendations = roleGaps.slice(0, 5);
        break;
      }
    }

    // Generate learning recommendations
    const recommendations = [];
    
    // Top priority gaps
    const topGaps = gapSkills.slice(0, 5);
    if (topGaps.length > 0) {
      recommendations.push(
        `Focus on high-demand skills: ${topGaps.slice(0, 3).join(', ')}`,
        `These skills appear in ${Math.round(skillFrequency[topGaps[0]] / internships.length * 100)}% of current job postings`
      );
    }

    // Role-specific recommendations
    if (roleSpecificRecommendations.length > 0) {
      recommendations.push(
        `For ${profile.role_preference || 'your target role'}, consider learning: ${roleSpecificRecommendations.slice(0, 3).join(', ')}`
      );
    }

    // Course suggestions based on gaps
    const courseMap: Record<string, string> = {
      'react': 'React.js Development Course',
      'python': 'Python Programming Fundamentals',
      'javascript': 'Modern JavaScript Development',
      'node': 'Node.js Backend Development',
      'aws': 'AWS Cloud Fundamentals',
      'docker': 'Docker & Containerization',
      'kubernetes': 'Kubernetes Orchestration',
      'tensorflow': 'Machine Learning with TensorFlow',
      'sql': 'Database Design & SQL',
      'git': 'Version Control with Git'
    };

    topGaps.forEach(skill => {
      if (courseMap[skill]) {
        recommendations.push(`📚 Suggested: ${courseMap[skill]}`);
      }
    });

    // Create analysis record
    const analysis = {
      user_id: user.id,
      current_skills: userSkills,
      market_skills: marketSkills,
      gap_skills: gapSkills,
      recommendations,
      analysis_date: new Date().toISOString().split('T')[0]
    };

    // Store the analysis
    const { error: insertError } = await supabaseClient
      .from('skill_gap_analysis')
      .insert(analysis);

    if (insertError) {
      console.error('Error storing skill analysis:', insertError);
    }

    // Calculate skill match percentage
    const skillMatchPercentage = userSkills.length > 0 
      ? Math.round((userSkills.filter(skill => marketSkills.includes(skill)).length / marketSkills.length) * 100)
      : 0;

    return new Response(
      JSON.stringify({
        analysis: {
          ...analysis,
          skill_match_percentage: skillMatchPercentage,
          market_analysis: {
            total_jobs_analyzed: internships.length,
            top_skills: marketSkills.slice(0, 10).map(skill => ({
              skill,
              demand_percentage: Math.round(skillFrequency[skill] / internships.length * 100)
            }))
          }
        },
        cached: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Skill Gap Analyzer error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze skill gaps' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
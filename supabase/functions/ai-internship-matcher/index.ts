import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MatchRequest {
  limit?: number;
  forceRefresh?: boolean;
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

    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Invalid user token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { limit = 5, forceRefresh = false }: MatchRequest = await req.json();

    // Check if we already have today's recommendations
    const today = new Date().toISOString().split('T')[0];
    const { data: existingRecommendations } = await supabaseClient
      .from('daily_recommendations')
      .select('*, internships(*)')
      .eq('user_id', user.id)
      .eq('recommendation_date', today)
      .order('match_score', { ascending: false });

    if (existingRecommendations && existingRecommendations.length > 0 && !forceRefresh) {
      return new Response(
        JSON.stringify({
          recommendations: existingRecommendations,
          cached: true,
          generated_at: existingRecommendations[0].created_at
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    // Get user's application history for context
    const { data: applications } = await supabaseClient
      .from('applications')
      .select('internship_id, status')
      .eq('user_id', user.id);

    const appliedInternshipIds = applications?.map(app => app.internship_id) || [];

    // Get all active internships
    const { data: internships } = await supabaseClient
      .from('internships')
      .select('*')
      .eq('is_active', true)
      .not('id', 'in', `(${appliedInternshipIds.join(',') || 'null'})`)
      .gte('deadline_date', today)
      .order('created_at', { ascending: false })
      .limit(50); // Get more for better matching

    if (!internships || internships.length === 0) {
      return new Response(
        JSON.stringify({ recommendations: [], message: 'No new internships available' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // AI-powered matching algorithm
    const scoredInternships = internships.map(internship => {
      let matchScore = 0;
      const reasons: string[] = [];

      // Skills matching (40% weight)
      if (profile.skills && profile.skills.length > 0 && internship.skills_required) {
        const userSkills = profile.skills.map((s: string) => s.toLowerCase());
        const requiredSkills = internship.skills_required.map((s: string) => s.toLowerCase());
        
        const matchingSkills = userSkills.filter(skill => 
          requiredSkills.some(req => 
            req.includes(skill) || skill.includes(req)
          )
        );

        if (matchingSkills.length > 0) {
          const skillMatchPercentage = (matchingSkills.length / Math.max(userSkills.length, requiredSkills.length)) * 100;
          matchScore += Math.min(40, skillMatchPercentage * 0.4);
          reasons.push(`${matchingSkills.length} skills match`);
        }
      }

      // Location preference (20% weight)
      if (profile.location_preference) {
        const userLocation = profile.location_preference.toLowerCase();
        if (
          (userLocation === 'remote' && internship.remote_allowed) ||
          (internship.location && internship.location.toLowerCase().includes(userLocation)) ||
          (userLocation.includes('any') && internship.location)
        ) {
          matchScore += 20;
          reasons.push('Location preference match');
        }
      }

      // Role preference (20% weight)
      if (profile.role_preference) {
        const userRole = profile.role_preference.toLowerCase();
        if (internship.title.toLowerCase().includes(userRole) || 
            userRole.includes(internship.title.toLowerCase().split(' ')[0])) {
          matchScore += 20;
          reasons.push('Role preference match');
        }
      }

      // Stipend expectation (10% weight)
      if (profile.expected_stipend && internship.stipend_min) {
        if (internship.stipend_min >= profile.expected_stipend * 0.8) { // Within 20% tolerance
          matchScore += 10;
          reasons.push('Stipend meets expectations');
        }
      }

      // Company reputation boost (5% weight)
      const topCompanies = ['google', 'microsoft', 'amazon', 'meta', 'apple', 'netflix', 'uber', 'airbnb'];
      if (topCompanies.some(company => internship.company_name.toLowerCase().includes(company))) {
        matchScore += 5;
        reasons.push('Top-tier company');
      }

      // Recent posting boost (5% weight)
      if (internship.created_at) {
        const daysSincePosted = (Date.now() - new Date(internship.created_at).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSincePosted <= 3) {
          matchScore += 5;
          reasons.push('Recently posted');
        }
      }

      return {
        ...internship,
        match_score: Math.round(matchScore),
        match_reasons: reasons
      };
    });

    // Sort by match score and get top matches
    const topMatches = scoredInternships
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, limit);

    // Store recommendations in database
    const recommendationsToStore = topMatches.map(match => ({
      user_id: user.id,
      internship_id: match.id,
      match_score: match.match_score,
      reasons: match.match_reasons,
      recommendation_date: today
    }));

    // Clear old recommendations for today and insert new ones
    if (forceRefresh) {
      await supabaseClient
        .from('daily_recommendations')
        .delete()
        .eq('user_id', user.id)
        .eq('recommendation_date', today);
    }

    const { error: insertError } = await supabaseClient
      .from('daily_recommendations')
      .insert(recommendationsToStore);

    if (insertError) {
      console.error('Error storing recommendations:', insertError);
    }

    return new Response(
      JSON.stringify({
        recommendations: topMatches,
        cached: false,
        generated_at: new Date().toISOString(),
        profile_completeness: {
          skills: !!profile.skills?.length,
          location: !!profile.location_preference,
          role: !!profile.role_preference,
          stipend: !!profile.expected_stipend
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Internship Matcher error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate recommendations' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
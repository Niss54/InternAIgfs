import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchFilters {
  location?: string;
  skills?: string[];
  role?: string;
  minStipend?: number;
  maxStipend?: number;
  remoteAllowed?: boolean;
  page?: number;
  limit?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      location,
      skills = [],
      role,
      minStipend,
      maxStipend,
      remoteAllowed,
      page = 1,
      limit = 20
    }: SearchFilters = await req.json();

    console.log('Search filters:', { location, skills, role, minStipend, maxStipend, remoteAllowed, page, limit });

    // Build the query
    let query = supabaseClient
      .from('internships')
      .select(`
        id,
        title,
        company_name,
        company_logo_url,
        location,
        remote_allowed,
        stipend_min,
        stipend_max,
        duration_months,
        description,
        requirements,
        skills_required,
        application_url,
        posted_date,
        deadline_date,
        created_at
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Apply location filter
    if (location && location.toLowerCase() !== 'remote') {
      query = query.or(`location.ilike.%${location}%,remote_allowed.eq.true`);
    } else if (location && location.toLowerCase() === 'remote') {
      query = query.eq('remote_allowed', true);
    }

    // Apply remote filter
    if (remoteAllowed !== undefined) {
      query = query.eq('remote_allowed', remoteAllowed);
    }

    // Apply role filter
    if (role) {
      query = query.ilike('title', `%${role}%`);
    }

    // Apply stipend filters
    if (minStipend !== undefined) {
      query = query.gte('stipend_min', minStipend);
    }
    if (maxStipend !== undefined) {
      query = query.lte('stipend_max', maxStipend);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: internships, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Filter by skills if provided (since PostgreSQL array operations can be complex)
    let filteredInternships = internships || [];
    if (skills.length > 0) {
      filteredInternships = filteredInternships.filter(internship => {
        if (!internship.skills_required || internship.skills_required.length === 0) {
          return false;
        }
        
        // Check if any of the user's skills match the required skills
        return skills.some(userSkill => 
          internship.skills_required.some((requiredSkill: string) => 
            requiredSkill.toLowerCase().includes(userSkill.toLowerCase()) ||
            userSkill.toLowerCase().includes(requiredSkill.toLowerCase())
          )
        );
      });
    }

    // Calculate match scores based on user preferences
    const internshipsWithScores = filteredInternships.map(internship => {
      let matchScore = 0;
      let matchReasons: string[] = [];

      // Location match
      if (location) {
        if (
          (location.toLowerCase() === 'remote' && internship.remote_allowed) ||
          (internship.location && internship.location.toLowerCase().includes(location.toLowerCase()))
        ) {
          matchScore += 30;
          matchReasons.push('Location match');
        }
      }

      // Skills match
      if (skills.length > 0 && internship.skills_required) {
        const matchingSkills = skills.filter(userSkill =>
          internship.skills_required.some((requiredSkill: string) =>
            requiredSkill.toLowerCase().includes(userSkill.toLowerCase()) ||
            userSkill.toLowerCase().includes(requiredSkill.toLowerCase())
          )
        );
        if (matchingSkills.length > 0) {
          matchScore += (matchingSkills.length / skills.length) * 40;
          matchReasons.push(`${matchingSkills.length} skills match`);
        }
      }

      // Role match
      if (role && internship.title.toLowerCase().includes(role.toLowerCase())) {
        matchScore += 20;
        matchReasons.push('Role match');
      }

      // Stipend match
      if (minStipend && internship.stipend_min && internship.stipend_min >= minStipend) {
        matchScore += 10;
        matchReasons.push('Stipend meets expectations');
      }

      return {
        ...internship,
        match_score: Math.round(matchScore),
        match_reasons: matchReasons
      };
    });

    // Sort by match score descending
    internshipsWithScores.sort((a, b) => b.match_score - a.match_score);

    console.log(`Found ${internshipsWithScores.length} internships`);

    return new Response(
      JSON.stringify({
        internships: internshipsWithScores,
        total_count: count || 0,
        page,
        limit,
        has_more: (count || 0) > page * limit
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in search-internships function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to search internships',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
/**
 * skillMatchingEngine.js
 * AI-powered skill matching system for intelligent internship recommendations
 * Matches user skills with internship requirements
 */

/**
 * Calculate match score between user profile and internship
 * @param {Object} userProfile - User profile from profileStore
 * @param {Object} internship - Internship listing object
 * @returns {number} Match score (0-100)
 */
function calculateMatchScore(userProfile, internship) {
    if (!userProfile || !internship) {
        return 0;
    }
    
    let totalScore = 0;
    let maxScore = 100;
    
    // 1. Skills Match (40 points) - Most important
    const skillScore = calculateSkillsMatch(userProfile.skills || [], internship.requiredSkills || []);
    totalScore += skillScore * 0.4;
    
    // 2. Role Match (25 points)
    const roleScore = calculateRoleMatch(userProfile.role, userProfile.targetRoles || [], internship.title, internship.category);
    totalScore += roleScore * 0.25;
    
    // 3. Education Match (20 points)
    const educationScore = calculateEducationMatch(userProfile, internship);
    totalScore += educationScore * 0.2;
    
    // 4. Branch/Domain Match (15 points)
    const branchScore = calculateBranchMatch(userProfile.branch, internship.domain || internship.category);
    totalScore += branchScore * 0.15;
    
    return Math.round(totalScore);
}

/**
 * Calculate skills match score
 * @param {Array} userSkills - User's skills
 * @param {Array} requiredSkills - Internship required skills
 * @returns {number} Score 0-100
 */
function calculateSkillsMatch(userSkills, requiredSkills) {
    if (!requiredSkills || requiredSkills.length === 0) {
        return 50; // Neutral score if no requirements
    }
    
    if (!userSkills || userSkills.length === 0) {
        return 0;
    }
    
    // Normalize skills to lowercase for comparison
    const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());
    const normalizedRequiredSkills = requiredSkills.map(s => s.toLowerCase().trim());
    
    // Count exact matches
    let matchCount = 0;
    normalizedRequiredSkills.forEach(reqSkill => {
        if (normalizedUserSkills.some(userSkill => 
            userSkill.includes(reqSkill) || reqSkill.includes(userSkill)
        )) {
            matchCount++;
        }
    });
    
    // Calculate percentage
    const matchPercentage = (matchCount / normalizedRequiredSkills.length) * 100;
    
    return Math.min(matchPercentage, 100);
}

/**
 * Calculate role match score
 * @param {string} userRole - User's target role
 * @param {Array} targetRoles - User's target roles list
 * @param {string} internshipTitle - Internship title
 * @param {string} internshipCategory - Internship category
 * @returns {number} Score 0-100
 */
function calculateRoleMatch(userRole, targetRoles, internshipTitle, internshipCategory) {
    if (!internshipTitle) {
        return 50;
    }
    
    const normalizedTitle = internshipTitle.toLowerCase();
    const normalizedCategory = (internshipCategory || '').toLowerCase();
    
    // Check user's primary role
    if (userRole) {
        const normalizedUserRole = userRole.toLowerCase();
        if (normalizedTitle.includes(normalizedUserRole) || normalizedUserRole.includes(normalizedTitle)) {
            return 100;
        }
    }
    
    // Check target roles list
    if (targetRoles && targetRoles.length > 0) {
        for (let role of targetRoles) {
            const normalizedRole = role.toLowerCase();
            if (normalizedTitle.includes(normalizedRole) || normalizedRole.includes(normalizedTitle)) {
                return 90;
            }
            if (normalizedCategory.includes(normalizedRole) || normalizedRole.includes(normalizedCategory)) {
                return 70;
            }
        }
    }
    
    return 30; // Low match if no role alignment
}

/**
 * Calculate education match score
 * @param {Object} userProfile - User profile
 * @param {Object} internship - Internship listing
 * @returns {number} Score 0-100
 */
function calculateEducationMatch(userProfile, internship) {
    const requiredEducation = internship.educationRequired || '';
    const userEducation = userProfile.graduationStatus || userProfile.educationStatus || '';
    
    if (!requiredEducation) {
        return 100; // No education requirement
    }
    
    const normalizedRequired = requiredEducation.toLowerCase();
    const normalizedUser = userEducation.toLowerCase();
    
    // Perfect match
    if (normalizedRequired === normalizedUser) {
        return 100;
    }
    
    // Acceptable matches
    if (normalizedRequired.includes('undergraduate') && normalizedUser.includes('undergraduate')) {
        return 100;
    }
    
    if (normalizedRequired.includes('graduate') && normalizedUser.includes('graduate')) {
        return 100;
    }
    
    if (normalizedRequired.includes('graduate') && normalizedUser.includes('completed')) {
        return 90; // Completed is better than required
    }
    
    return 60; // Partial match
}

/**
 * Calculate branch/domain match score
 * @param {string} userBranch - User's branch
 * @param {string} internshipDomain - Internship domain/category
 * @returns {number} Score 0-100
 */
function calculateBranchMatch(userBranch, internshipDomain) {
    if (!internshipDomain) {
        return 70; // Neutral if no domain specified
    }
    
    if (!userBranch) {
        return 50;
    }
    
    const normalizedBranch = userBranch.toLowerCase();
    const normalizedDomain = internshipDomain.toLowerCase();
    
    // Branch-domain mapping
    const branchMapping = {
        'computer science': ['software', 'web', 'app', 'data', 'ai', 'ml', 'tech', 'it'],
        'information technology': ['software', 'web', 'app', 'data', 'tech', 'it'],
        'electronics': ['hardware', 'embedded', 'iot', 'electronics'],
        'mechanical': ['mechanical', 'automobile', 'design', 'cad'],
        'civil': ['civil', 'construction', 'architecture'],
        'business': ['marketing', 'sales', 'management', 'finance'],
        'mba': ['marketing', 'sales', 'management', 'business', 'finance'],
        'bba': ['marketing', 'sales', 'management', 'business']
    };
    
    // Check direct match
    if (normalizedDomain.includes(normalizedBranch) || normalizedBranch.includes(normalizedDomain)) {
        return 100;
    }
    
    // Check mapping
    for (let [branch, domains] of Object.entries(branchMapping)) {
        if (normalizedBranch.includes(branch)) {
            for (let domain of domains) {
                if (normalizedDomain.includes(domain)) {
                    return 85;
                }
            }
        }
    }
    
    return 40; // Low match
}

/**
 * Get smart internship recommendations
 * @param {Object} userProfile - User profile from profileStore
 * @param {Array} allInternships - Array of all available internships
 * @param {number} minScore - Minimum match score threshold (default: 60)
 * @param {number} limit - Maximum number of results (default: 10)
 * @returns {Array} Sorted array of matched internships with scores
 */
function getSmartInternshipMatches(userProfile, allInternships, minScore = 60, limit = 10) {
    if (!userProfile || !allInternships || allInternships.length === 0) {
        return [];
    }
    
    // Calculate match score for each internship
    const scoredInternships = allInternships.map(internship => ({
        ...internship,
        matchScore: calculateMatchScore(userProfile, internship),
        matchDetails: {
            skillsMatch: calculateSkillsMatch(userProfile.skills || [], internship.requiredSkills || []),
            roleMatch: calculateRoleMatch(userProfile.role, userProfile.targetRoles || [], internship.title, internship.category),
            educationMatch: calculateEducationMatch(userProfile, internship),
            branchMatch: calculateBranchMatch(userProfile.branch, internship.domain || internship.category)
        }
    }));
    
    // Filter by minimum score and sort by score
    const filteredInternships = scoredInternships
        .filter(internship => internship.matchScore >= minScore)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    
    console.log(`Found ${filteredInternships.length} matching internships (min score: ${minScore})`);
    
    return filteredInternships;
}

/**
 * Get match category based on score
 * @param {number} score - Match score
 * @returns {string} Category: "excellent", "good", "fair", "poor"
 */
function getMatchCategory(score) {
    if (score >= 80) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 60) return 'fair';
    return 'poor';
}

/**
 * Get match explanation for user
 * @param {Object} matchDetails - Match details object
 * @returns {string} Human-readable explanation
 */
function getMatchExplanation(matchDetails) {
    const explanations = [];
    
    if (matchDetails.skillsMatch >= 80) {
        explanations.push('✅ Your skills are a strong match');
    } else if (matchDetails.skillsMatch >= 60) {
        explanations.push('⚠️ Your skills partially match');
    } else {
        explanations.push('❌ Skills need development');
    }
    
    if (matchDetails.roleMatch >= 80) {
        explanations.push('✅ Role aligns with your goals');
    } else if (matchDetails.roleMatch >= 60) {
        explanations.push('⚠️ Role somewhat related');
    }
    
    if (matchDetails.educationMatch >= 90) {
        explanations.push('✅ Education requirements met');
    }
    
    if (matchDetails.branchMatch >= 80) {
        explanations.push('✅ Your branch is highly relevant');
    }
    
    return explanations.join(' | ');
}

// For direct browser usage attach to window (modules should import from a module-aware source)
if (typeof window !== 'undefined') {
    window.skillMatchingEngine = {
        calculateMatchScore,
        getSmartInternshipMatches,
        getMatchCategory,
        getMatchExplanation
    };
}

// For vanilla JS / browser globals, attach to window
if (typeof window !== 'undefined') {
    window.skillMatchingEngine = {
        calculateMatchScore,
        calculateSkillsMatch,
        calculateRoleMatch,
        calculateEducationMatch,
        calculateBranchMatch,
        getSmartInternshipMatches,
        getMatchCategory,
        getMatchExplanation
    };
}

/**
 * EXAMPLE USAGE:
 * 
 * // 1. Get user profile
 * const userProfile = profileStore.getProfile();
 * 
 * // 2. Get all internships (from API or local data)
 * const allInternships = [
 *     {
 *         id: 'int1',
 *         title: 'Web Developer Intern',
 *         company: 'Tech Corp',
 *         category: 'Software Development',
 *         domain: 'Web Development',
 *         requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS'],
 *         educationRequired: 'Undergraduate',
 *         stipend: 10000
 *     },
 *     // ... more internships
 * ];
 * 
 * // 3. Get smart matches
 * const matches = skillMatchingEngine.getSmartInternshipMatches(
 *     userProfile,
 *     allInternships,
 *     60, // minimum score
 *     10  // max results
 * );
 * 
 * // 4. Display results
 * matches.forEach(internship => {
 *     console.log(`${internship.title} - Match: ${internship.matchScore}%`);
 *     console.log(skillMatchingEngine.getMatchExplanation(internship.matchDetails));
 * });
 * 
 */

/**
 * profileStore.js
 * Simple localStorage-based database for InternAI user profile
 * No backend database - all data stored in browser localStorage
 */

// Constants
const STORAGE_KEY = 'internai_user_profile';

/**
 * Get user profile from localStorage
 * @returns {Object|null} User profile object or null if not found
 */
function getProfile() {
    try {
        const profileJSON = localStorage.getItem(STORAGE_KEY);
        
        if (!profileJSON) {
            return null;
        }
        
        const profile = JSON.parse(profileJSON);
        return profile;
    } catch (error) {
        console.error('Error reading profile from localStorage:', error);
        // If JSON parsing fails, clear the corrupted data
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

/**
 * Save user profile to localStorage
 * @param {Object} profile - User profile object
 * @param {string} profile.id - User identifier (required)
 * @param {string} profile.name - User name (required)
 * @param {string} profile.collegeName - College name
 * @param {string} profile.educationStatus - Education status (e.g., "Undergraduate", "Graduate", "Completed")
 * @param {string} profile.branch - Branch/Major
 * @param {string[]} profile.achievements - List of achievements
 * @param {string[]} profile.targetRoles - List of target internship roles
 * @param {string[]} profile.skills - List of skills
 * @param {string} profile.shortDescription - Short bio (2-3 lines)
 * @returns {boolean} True if saved successfully, false otherwise
 */
function saveProfile(profile) {
    try {
        // Validate required fields
        if (!profile || typeof profile !== 'object') {
            console.error('Profile must be an object');
            return false;
        }
        
        if (!profile.id || typeof profile.id !== 'string') {
            console.error('Profile must have an "id" field (string)');
            return false;
        }
        
        if (!profile.name || typeof profile.name !== 'string') {
            console.error('Profile must have a "name" field (string)');
            return false;
        }
        
        // Ensure array fields are arrays
        const sanitizedProfile = {
            id: profile.id,
            name: profile.name,
            collegeName: profile.collegeName || '',
            educationStatus: profile.educationStatus || '',
            branch: profile.branch || '',
            achievements: Array.isArray(profile.achievements) ? profile.achievements : [],
            targetRoles: Array.isArray(profile.targetRoles) ? profile.targetRoles : [],
            skills: Array.isArray(profile.skills) ? profile.skills : [],
            shortDescription: profile.shortDescription || ''
        };
        
        const profileJSON = JSON.stringify(sanitizedProfile);
        localStorage.setItem(STORAGE_KEY, profileJSON);
        
        console.log('Profile saved successfully');
        return true;
    } catch (error) {
        console.error('Error saving profile to localStorage:', error);
        return false;
    }
}

/**
 * Update user profile with partial data
 * Merges the update with existing profile
 * @param {Object} partialUpdate - Partial profile object with fields to update
 * @returns {boolean} True if updated successfully, false otherwise
 */
function updateProfile(partialUpdate) {
    try {
        if (!partialUpdate || typeof partialUpdate !== 'object') {
            console.error('Update must be an object');
            return false;
        }
        
        // Get existing profile
        let currentProfile = getProfile();
        
        // If no existing profile, create a new one from the update
        if (!currentProfile) {
            // For new profile, we need at least id and name
            if (!partialUpdate.id || !partialUpdate.name) {
                console.error('Cannot create new profile without "id" and "name" fields');
                return false;
            }
            
            currentProfile = {
                id: '',
                name: '',
                collegeName: '',
                educationStatus: '',
                branch: '',
                achievements: [],
                targetRoles: [],
                skills: [],
                shortDescription: ''
            };
        }
        
        // Merge the update into current profile
        const updatedProfile = {
            ...currentProfile,
            ...partialUpdate
        };
        
        // Ensure array fields remain arrays after merge
        if (partialUpdate.achievements !== undefined) {
            updatedProfile.achievements = Array.isArray(partialUpdate.achievements) 
                ? partialUpdate.achievements 
                : currentProfile.achievements;
        }
        
        if (partialUpdate.targetRoles !== undefined) {
            updatedProfile.targetRoles = Array.isArray(partialUpdate.targetRoles) 
                ? partialUpdate.targetRoles 
                : currentProfile.targetRoles;
        }
        
        if (partialUpdate.skills !== undefined) {
            updatedProfile.skills = Array.isArray(partialUpdate.skills) 
                ? partialUpdate.skills 
                : currentProfile.skills;
        }
        
        // Save the updated profile
        return saveProfile(updatedProfile);
    } catch (error) {
        console.error('Error updating profile:', error);
        return false;
    }
}

/**
 * Clear user profile from localStorage
 * @returns {boolean} True if cleared successfully
 */
function clearProfile() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('Profile cleared successfully');
        return true;
    } catch (error) {
        console.error('Error clearing profile from localStorage:', error);
        return false;
    }
}

/**
 * Check if user profile exists
 * @returns {boolean} True if profile exists
 */
function hasProfile() {
    try {
        const profile = getProfile();
        return profile !== null && profile.id && profile.name;
    } catch (error) {
        return false;
    }
}

/**
 * Add item to an array field in profile
 * @param {string} field - Field name (achievements, targetRoles, or skills)
 * @param {string} value - Value to add
 * @returns {boolean} True if added successfully
 */
function addToArray(field, value) {
    try {
        const validFields = ['achievements', 'targetRoles', 'skills'];
        
        if (!validFields.includes(field)) {
            console.error(`Invalid field: ${field}. Must be one of: ${validFields.join(', ')}`);
            return false;
        }
        
        const profile = getProfile();
        
        if (!profile) {
            console.error('No profile exists. Create a profile first.');
            return false;
        }
        
        if (!profile[field].includes(value)) {
            profile[field].push(value);
            return saveProfile(profile);
        }
        
        return true; // Already exists
    } catch (error) {
        console.error(`Error adding to ${field}:`, error);
        return false;
    }
}

/**
 * Remove item from an array field in profile
 * @param {string} field - Field name (achievements, targetRoles, or skills)
 * @param {string} value - Value to remove
 * @returns {boolean} True if removed successfully
 */
function removeFromArray(field, value) {
    try {
        const validFields = ['achievements', 'targetRoles', 'skills'];
        
        if (!validFields.includes(field)) {
            console.error(`Invalid field: ${field}. Must be one of: ${validFields.join(', ')}`);
            return false;
        }
        
        const profile = getProfile();
        
        if (!profile) {
            console.error('No profile exists.');
            return false;
        }
        
        const index = profile[field].indexOf(value);
        
        if (index > -1) {
            profile[field].splice(index, 1);
            return saveProfile(profile);
        }
        
        return true; // Doesn't exist anyway
    } catch (error) {
        console.error(`Error removing from ${field}:`, error);
        return false;
    }
}

// Export functions (for ES6 modules)
// Uncomment if using ES6 module syntax:
// export { getProfile, saveProfile, updateProfile, clearProfile, hasProfile, addToArray, removeFromArray };

// For vanilla JS / browser globals, attach to window
if (typeof window !== 'undefined') {
    window.profileStore = {
        getProfile,
        saveProfile,
        updateProfile,
        clearProfile,
        hasProfile,
        addToArray,
        removeFromArray
    };
}

/**
 * EXAMPLE USAGE:
 * 
 * // 1. Create a new profile
 * const sampleProfile = {
 *     id: 'user123@example.com',
 *     name: 'Nisha Sharma',
 *     collegeName: 'IIT Delhi',
 *     educationStatus: 'Undergraduate',
 *     branch: 'Computer Science',
 *     achievements: [
 *         'Won first prize in hackathon',
 *         'Published research paper on AI',
 *         'Led college tech club'
 *     ],
 *     targetRoles: [
 *         'Web Developer Intern',
 *         'Data Analyst Intern',
 *         'AI/ML Intern'
 *     ],
 *     skills: [
 *         'JavaScript',
 *         'Python',
 *         'React',
 *         'Node.js',
 *         'Machine Learning',
 *         'Data Analysis'
 *     ],
 *     shortDescription: 'Passionate computer science student with strong interest in AI and web development. Looking for internship opportunities to apply my skills in real-world projects.'
 * };
 * 
 * // Save the profile
 * profileStore.saveProfile(sampleProfile);
 * 
 * // 2. Update profile - add new achievements and skills
 * profileStore.updateProfile({
 *     achievements: [
 *         'Won first prize in hackathon',
 *         'Published research paper on AI',
 *         'Led college tech club',
 *         'Completed 100 Days of Code challenge'
 *     ],
 *     skills: [
 *         'JavaScript',
 *         'Python',
 *         'React',
 *         'Node.js',
 *         'Machine Learning',
 *         'Data Analysis',
 *         'TypeScript',
 *         'MongoDB'
 *     ]
 * });
 * 
 * // 3. Get and log the profile
 * const currentProfile = profileStore.getProfile();
 * console.log('Current Profile:', currentProfile);
 * 
 * // 4. Check if profile exists
 * if (profileStore.hasProfile()) {
 *     console.log('User profile exists!');
 * }
 * 
 * // 5. Add individual items to arrays
 * profileStore.addToArray('skills', 'Docker');
 * profileStore.addToArray('targetRoles', 'DevOps Intern');
 * profileStore.addToArray('achievements', 'Contributed to open source projects');
 * 
 * // 6. Remove items from arrays
 * profileStore.removeFromArray('skills', 'MongoDB');
 * 
 * // 7. Update specific fields
 * profileStore.updateProfile({
 *     educationStatus: 'Graduate',
 *     shortDescription: 'Experienced computer science graduate seeking challenging internship opportunities in AI and full-stack development.'
 * });
 * 
 * // 8. Clear profile (when user logs out)
 * // profileStore.clearProfile();
 * 
 * // 9. Example of checking and creating profile if doesn't exist
 * if (!profileStore.hasProfile()) {
 *     profileStore.saveProfile({
 *         id: 'newuser@example.com',
 *         name: 'John Doe',
 *         collegeName: 'BITS Pilani',
 *         educationStatus: 'Undergraduate',
 *         branch: 'Electronics',
 *         achievements: [],
 *         targetRoles: ['Hardware Intern'],
 *         skills: ['C++', 'Arduino'],
 *         shortDescription: 'Electronics student passionate about embedded systems.'
 *     });
 * }
 * 
 */

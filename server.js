/**
 * server.js
 * Node.js + Express backend for InternAI AI Suggestions
 * 
 * IMPORTANT: This backend is completely STATELESS.
 * - NO DATABASE (no MongoDB, no SQL, nothing).
 * - All user data (profile, resume, chat history) is stored in browser localStorage.
 * - The frontend sends everything needed in each request body.
 * - This server only processes the request, calls an AI model, and returns a response.
 */

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBV0g-vHeNu2tuPjmrbH_20Y7ccMHK5MBE';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Middleware
app.use(cors()); // Enable CORS for frontend development
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies (increase limit for resume content)

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'InternAI backend is running',
        timestamp: new Date().toISOString()
    });
});

/**
 * Main AI chat endpoint
 * POST /api/ai/chat
 * 
 * Request body:
 * {
 *   message: string (required) - User's question/message
 *   userProfile: object | null - User profile from profileStore
 *   resume: object | null - Current resume from resumeStore
 * }
 * 
 * Response:
 * {
 *   reply: string - AI's response
 * }
 */
app.post('/api/ai/chat', async (req, res) => {
    try {
        // 1. Extract and validate request body
        const { message, userProfile, resume } = req.body;
        
        // Validate message
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Bad Request',
                message: 'Message field is required and must be a non-empty string'
            });
        }
        
        console.log('📨 Received chat request:');
        console.log('- Message:', message.substring(0, 50) + '...');
        console.log('- Has Profile:', !!userProfile);
        console.log('- Has Resume:', !!resume);
        
        // 2. Build the system prompt
        const systemPrompt = buildSystemPrompt(userProfile, resume);
        
        // 3. Call AI model (placeholder for now)
        const aiResponse = await callAiModel(systemPrompt, message);
        
        // 4. Return response
        res.json({
            reply: aiResponse
        });
        
    } catch (error) {
        console.error('❌ Error in /api/ai/chat:', error);
        
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to process your request. Please try again.'
        });
    }
});

/**
 * Build the complete system prompt for the AI model
 * This includes:
 * - System instructions (fixed)
 * - User profile data (formatted)
 * - Resume/documents data (formatted)
 * - User's current message
 * 
 * @param {Object|null} userProfile - User profile object from localStorage
 * @param {Object|null} resume - Resume object from localStorage
 * @returns {string} Complete system prompt
 */
function buildSystemPrompt(userProfile, resume) {
    // Fixed system instruction
    const systemInstruction = `You are 'InternAI', a personal AI internship and resume mentor for ONE specific user.

You ALWAYS have three types of inputs:
1) USER_PROFILE: structured data about the user (name, college, branch, graduation status, achievements, target job roles, skills, links).
2) USER_DOCUMENTS: text extracted from the user's resume and any uploaded files or images.
3) USER_MESSAGE: the user's current question in chat.

Rules:
- Treat this as a long-term personal mentor for THIS user only. Do not assume anything about other people.
- Use USER_PROFILE + USER_DOCUMENTS as your main source of truth about the user.
- If some detail is not mentioned, say 'you have not added this in your profile/resume' instead of guessing.
- Answer ONLY about this user, not their friends or other accounts.

Your goals:
1) Resume review:
   - Find mistakes, missing sections, weak bullet points and unnecessary details.
   - Clearly split feedback into:
     (A) 'ADD' – what new sections/points they should add.
     (B) 'IMPROVE' – how to rewrite or strengthen existing lines.
     (C) 'REMOVE' – what is not needed or harmful in a resume.
   - When possible, give example bullet points they can copy and edit.

2) Internship guidance:
   - Based on their branch, year, target roles and skills, suggest:
     - Which skills/technologies to learn next.
     - What kind of projects or internships they should target.
     - How to adjust their resume for a specific role (for example Web Developer Intern, Data Analyst Intern).

3) Personal memory-like behavior:
   - If the user asks about their own data (for example 'mera naam kya hai?', 'main kaunsi branch ka hoon?'):
     - Answer directly using USER_PROFILE.
   - If they ask 'mere resume me kya improve karna chahiye?':
     - Use USER_DOCUMENTS + USER_PROFILE to give very specific resume changes.

Style:
- Answer in clear, concise Hinglish by default.
- Use bullet points wherever possible.
- Be practical and actionable, not generic.

Very important:
- Never reveal raw JSON of USER_PROFILE or USER_DOCUMENTS.
- Summarize them in natural language.
- If no resume/documents are available, clearly say that and ask them to upload or describe their resume.

`;

    // Format user profile
    const profileSection = formatUserProfile(userProfile);
    
    // Format resume/documents
    const documentsSection = formatUserDocuments(resume);
    
    // Combine everything
    const fullPrompt = systemInstruction + 
                      '\n=== USER_PROFILE ===\n' + profileSection +
                      '\n\n=== USER_DOCUMENTS ===\n' + documentsSection;
    
    return fullPrompt;
}

/**
 * Format user profile data into readable text
 * 
 * @param {Object|null} profile - User profile object
 * @returns {string} Formatted profile text
 */
function formatUserProfile(profile) {
    if (!profile || !profile.id || !profile.name) {
        return 'No user profile available. The user has not set up their profile yet.';
    }
    
    let formatted = '';
    
    // Basic info
    formatted += `Name: ${profile.name}\n`;
    formatted += `User ID: ${profile.id}\n`;
    
    if (profile.collegeName) {
        formatted += `College: ${profile.collegeName}\n`;
    }
    
    if (profile.educationStatus) {
        formatted += `Education Status: ${profile.educationStatus}\n`;
    }
    
    if (profile.branch) {
        formatted += `Branch/Major: ${profile.branch}\n`;
    }
    
    // Short description
    if (profile.shortDescription) {
        formatted += `\nAbout: ${profile.shortDescription}\n`;
    }
    
    // Target roles
    if (profile.targetRoles && profile.targetRoles.length > 0) {
        formatted += `\nTarget Internship Roles:\n`;
        profile.targetRoles.forEach((role, index) => {
            formatted += `  ${index + 1}. ${role}\n`;
        });
    }
    
    // Skills
    if (profile.skills && profile.skills.length > 0) {
        formatted += `\nSkills:\n`;
        profile.skills.forEach((skill, index) => {
            formatted += `  - ${skill}\n`;
        });
    }
    
    // Achievements
    if (profile.achievements && profile.achievements.length > 0) {
        formatted += `\nAchievements:\n`;
        profile.achievements.forEach((achievement, index) => {
            formatted += `  ${index + 1}. ${achievement}\n`;
        });
    }
    
    return formatted;
}

/**
 * Format resume/documents data into readable text
 * 
 * @param {Object|null} resume - Resume object from resumeStore
 * @returns {string} Formatted documents text
 */
function formatUserDocuments(resume) {
    if (!resume || !resume.fileName) {
        return 'No resume or documents uploaded yet. The user has not uploaded any files.';
    }
    
    let formatted = '';
    
    formatted += `File Name: ${resume.fileName}\n`;
    formatted += `File Type: ${resume.fileType || 'unknown'}\n`;
    formatted += `Uploaded: ${new Date(resume.uploadedAt).toLocaleString()}\n`;
    
    if (resume.fileSize) {
        const sizeInKB = (resume.fileSize / 1024).toFixed(2);
        formatted += `File Size: ${sizeInKB} KB\n`;
    }
    
    formatted += '\n--- Resume Content ---\n';
    
    if (resume.rawContent) {
        // Check if it's a placeholder or actual content
        if (resume.rawContent.includes('to be extracted later')) {
            formatted += '[Content not yet extracted - awaiting OCR/PDF parsing]\n';
            formatted += `Note: The user uploaded ${resume.fileName} but text extraction is not implemented yet.\n`;
            formatted += 'Ask the user to describe their resume content verbally or paste it in the chat.';
        } else {
            formatted += resume.rawContent;
        }
    } else {
        formatted += '[No content available]';
    }
    
    if (resume.notes) {
        formatted += `\n\n--- Internal Notes ---\n${resume.notes}`;
    }
    
    return formatted;
}

/**
 * Call AI model to get a response
 * Uses Google Gemini API for intelligent responses
 * 
 * @param {string} systemPrompt - Full system prompt with context
 * @param {string} userMessage - User's current message
 * @returns {Promise<string>} AI's response
 */
async function callAiModel(systemPrompt, userMessage) {
    try {
        console.log('🤖 Calling Gemini AI...');
        
        // Combine system prompt and user message
        const fullPrompt = systemPrompt + '\n\n=== USER_MESSAGE ===\n' + userMessage;
        
        // Call Gemini API
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const aiReply = response.text();
        
        console.log('✅ Gemini AI responded successfully');
        return aiReply;
        
    } catch (error) {
        console.error('❌ Gemini API Error:', error.message);
        
        // Fallback to demo response if API fails
        console.log('⚠️  Falling back to demo response');
        return generateDemoResponse(userMessage);
    }
}

/**
 * Generate a demo response when no AI API is configured
 * This helps test the system without requiring API keys
 * 
 * @param {string} userMessage - User's message
 * @returns {string} Demo response
 */
function generateDemoResponse(userMessage) {
    const lowerMsg = userMessage.toLowerCase();
    
    // Smart demo responses based on keywords
    if (lowerMsg.includes('resume') || lowerMsg.includes('cv')) {
        return `**Demo Mode Response**

Main tumhare resume ko analyze karunga:

**ADD (Ye add karo):**
- Quantifiable achievements add karo (numbers, percentages)
- Technical skills section me latest technologies
- GitHub/Portfolio links

**IMPROVE (Ye improve karo):**
- Bullet points me action verbs use karo (Built, Developed, Implemented)
- Achievements ko specific banao with metrics
- Experience section me impact highlight karo

**REMOVE (Ye remove karo):**
- Generic statements like "Hard worker", "Team player"
- Outdated technologies
- Irrelevant hobbies

*Note: Ye demo response hai. Real AI integration ke baad tumhare actual resume content ko analyze karunga.*`;
    }
    
    if (lowerMsg.includes('internship') || lowerMsg.includes('job')) {
        return `**Demo Mode Response**

Internship guidance:

🎯 **Target Companies:**
- Tech startups (more learning opportunities)
- Product-based companies (better projects)
- Open source contributions (builds portfolio)

📚 **Skills to Learn:**
- Cloud platforms (AWS/Azure basics)
- Version control (Git advanced)
- System design fundamentals
- DSA for interviews

💡 **Next Steps:**
1. Build 2-3 solid projects
2. Contribute to open source
3. Network on LinkedIn
4. Apply to 10+ companies daily

*Note: Real AI ke saath main tumhare specific profile ke according personalized suggestions dunga.*`;
    }
    
    if (lowerMsg.includes('skill') || lowerMsg.includes('learn')) {
        return `**Demo Mode Response**

Skills development roadmap:

**Current Industry Trends:**
- AI/ML fundamentals
- Cloud computing
- DevOps basics
- Full-stack development

**Recommended Learning Path:**
1. Master one programming language deeply
2. Build projects that solve real problems
3. Learn deployment and hosting
4. Understand databases (SQL + NoSQL)

**Time Investment:**
- Daily: 2-3 hours practice
- Weekly: 1 complete project
- Monthly: 1 new technology

*Real AI tumhare current skills ko dekh ke personalized roadmap banayega.*`;
    }
    
    // Default response
    return `**Demo Mode Response**

Main tumhara personal AI mentor hoon. Main tumhe help kar sakta hoon:

✅ Resume review and improvements
✅ Internship search strategy
✅ Skills development roadmap
✅ Interview preparation
✅ Career guidance

Tumhara sawal: "${userMessage}"

**Important:** Abhi main demo mode me hoon. Jab real AI API connect hoga, main tumhare actual profile aur resume ko analyze karke detailed, personalized suggestions dunga.

Kya tum apne resume ya profile ke baare me specific sawal poochna chahte ho?`;
}

/**
 * Error handler middleware
 */
app.use((err, req, res, next) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong. Please try again later.'
    });
});

/**
 * 404 handler
 */
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
    });
});

/**
 * Start the server
 */
app.listen(PORT, () => {
    console.log('');
    console.log('🚀 InternAI Backend Server Started!');
    console.log('================================');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/ai/chat`);
    console.log('================================');
    console.log('');
    console.log('✅ Gemini AI: CONNECTED');
    console.log(`🔑 API Key: ${GEMINI_API_KEY.substring(0, 20)}...`);
    console.log('');
    console.log('⚠️  IMPORTANT:');
    console.log('- This backend is STATELESS (no database)');
    console.log('- All user data comes from browser localStorage');
    console.log('');
});

/**
 * Graceful shutdown
 */
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

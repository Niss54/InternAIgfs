# InternAI Backend Setup

## Overview
This is a **stateless Node.js + Express backend** for InternAI AI Suggestions feature.

**IMPORTANT:** 
- ❌ No database (no MongoDB, no SQL, nothing)
- ✅ All user data stored in browser localStorage
- ✅ Frontend sends profile + resume in each request
- ✅ Backend only processes and calls AI model

## Installation

1. Install dependencies:
```bash
npm install
```

2. (Optional) Install nodemon for development:
```bash
npm install --save-dev nodemon
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "message": "InternAI backend is running",
  "timestamp": "2025-12-14T10:30:00.000Z"
}
```

### AI Chat
```
POST /api/ai/chat
```

Request body:
```json
{
  "message": "Mere resume me kya improve karna chahiye?",
  "userProfile": {
    "id": "user123@example.com",
    "name": "Nisha Sharma",
    "collegeName": "IIT Delhi",
    "educationStatus": "Undergraduate",
    "branch": "Computer Science",
    "achievements": ["Won hackathon", "Research paper"],
    "targetRoles": ["Web Developer Intern", "Data Analyst Intern"],
    "skills": ["JavaScript", "Python", "React"],
    "shortDescription": "CS student interested in web development"
  },
  "resume": {
    "id": "resume_123",
    "fileName": "my_resume.pdf",
    "fileType": "application/pdf",
    "uploadedAt": "2025-12-14T10:00:00.000Z",
    "rawContent": "Name: Nisha Sharma\nEducation: B.Tech CSE\n...",
    "notes": null
  }
}
```

Response:
```json
{
  "reply": "Tumhare resume me ye improvements kar sakte ho:\n\nADD:\n- Quantifiable achievements..."
}
```

## Connecting Real AI API

Currently, the backend returns demo responses. To connect real AI:

### Option 1: Google Gemini

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Install Gemini SDK:
```bash
npm install @google/generative-ai
```

3. Set environment variable:
```bash
export GEMINI_API_KEY="your-api-key-here"
```

4. Uncomment Gemini code in `server.js` (around line 250)

### Option 2: OpenAI GPT

1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)

2. Install OpenAI SDK:
```bash
npm install openai
```

3. Set environment variable:
```bash
export OPENAI_API_KEY="your-api-key-here"
```

4. Uncomment OpenAI code in `server.js` (around line 260)

## Environment Variables

Create a `.env` file (optional):
```env
PORT=3000
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
```

Then install dotenv:
```bash
npm install dotenv
```

And add to top of server.js:
```javascript
require('dotenv').config();
```

## Frontend Integration

Update the fetch URL in `ai-suggestions.js`:

```javascript
const response = await fetch('http://localhost:3000/api/ai/chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
});
```

## Architecture

```
Frontend (Browser)                    Backend (Node.js)
┌─────────────────────┐              ┌──────────────────┐
│                     │              │                  │
│  localStorage       │              │  No Database     │
│  - Profile          │              │  (Stateless)     │
│  - Resume           │──Request──>  │                  │
│  - Chat History     │              │  Express Server  │
│                     │              │  ↓               │
│                     │              │  Format Prompt   │
│                     │              │  ↓               │
│                     │<──Response── │  Call AI Model   │
│                     │              │  (Gemini/GPT)    │
└─────────────────────┘              └──────────────────┘
```

## Testing

### Test with curl:
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how can you help me?",
    "userProfile": null,
    "resume": null
  }'
```

### Test with browser console:
```javascript
fetch('http://localhost:3000/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Test message',
    userProfile: null,
    resume: null
  })
})
.then(r => r.json())
.then(console.log);
```

## Error Handling

The backend handles:
- ✅ Missing/empty message → 400 Bad Request
- ✅ Invalid JSON → 400 Bad Request
- ✅ AI API errors → Returns demo response
- ✅ Unhandled errors → 500 Internal Server Error

## Notes

- **No session management** - each request is independent
- **No authentication** - implement if needed for production
- **No rate limiting** - add if needed for production
- **CORS enabled** - for localhost development only
- **10MB body limit** - for large resume files

## Production Deployment

For production, consider:
1. Add authentication (JWT tokens)
2. Add rate limiting (express-rate-limit)
3. Add request logging (morgan)
4. Add security headers (helmet)
5. Use HTTPS
6. Restrict CORS to your domain
7. Add monitoring (PM2, New Relic)

## Troubleshooting

**Port already in use:**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**CORS errors:**
- Make sure backend is running on port 3000
- Check CORS is enabled in server.js
- Update frontend fetch URL

**AI responses not working:**
- Check API key is set correctly
- Check API quota/billing
- Check network connection
- Look at server console logs

## License
ISC

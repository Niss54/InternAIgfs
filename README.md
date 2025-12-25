# 🚀 InternAI – AI Internship & Resume Mentor

## 📝 Project Overview
InternAI is a modern, AI-powered platform designed to help students and job seekers improve their resumes, get personalized internship suggestions, and receive actionable career guidance. The platform features:
- AI chat assistant for resume and career queries
- Resume upload and analysis
- User profile management
- Persistent chat history (localStorage)
- Admin panel (for privileged users)
- Modern onboarding with animated intro video

**Note:** Deployment pending. This project is currently in hackathon/demo mode and runs locally.



## 🛠️ Tech Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn-ui
- **Backend:** Node.js, Express, Google Gemini AI API (stateless, no DB)
- **Storage:** Browser localStorage (profile, resume, chat)
- **Other:** Custom splash screen, file upload, chatStore/profileStore/resumeStore modules

---

## ⚙️ How It Works (Agent Flow)
1. **User lands on site:**
   - Splash screen with intro video plays (only on first visit)
   - Auto-redirects to homepage
2. **User uploads resume:**
   - Drag & drop or select file (PDF/DOC/DOCX/TXT/JPG/PNG)
   - File metadata and (if possible) text extracted and saved in localStorage
3. **User sets up profile:**
   - Profile info (name, college, branch, skills, etc.) saved in localStorage
4. **User chats with AI:**
   - Chat history is saved in localStorage
   - Each message (with profile + resume) is sent to backend `/api/ai/chat`
   - Backend builds a prompt and calls Gemini AI (or returns demo response)
   - AI reply is shown in chat and saved in history
5. **Admin panel:**
   - Special routes for admin login and dashboard (if enabled)
   - Admin can manage users, see analytics, etc. (if implemented)

---

## 🧩 Project Features & Structure
- **Splash Screen:** `splash.html` with full-screen intro video
- **Homepage:** Modern UI, responsive, Tailwind CSS
- **AI Suggestions Page:** `ai-suggestions.html` for chat and resume upload
- **Profile Management:** `profileStore.js` (localStorage)
- **Resume Management:** `resumeStore.js` (localStorage)
- **Chat History:** `chatStore.js` (localStorage)
- **Backend:** `server.cjs` (Express, Gemini AI integration)
- **Admin Panel:** (if enabled) `/admin-login`, `/admin-dashboard`
- **.env:** All API keys and secrets (never committed)
- **.gitignore:** Protects sensitive files

---

## 🚦 Deployment Status
**Deployment pending.**
- Project runs locally via Vite dev server (`npm run dev`)
- Backend runs via Node.js (`node server.cjs`)
- For production, deploy frontend (Netlify/Vercel) and backend (Render/Heroku)

---

## 💡 How to Run Locally
```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Install dependencies
npm install

# 3. Start frontend (Vite)
npm run dev

# 4. Start backend (in another terminal)
node server.cjs

# 5. Open in browser
http://localhost:8080/
```

---

## 🏆 What Works
- [x] AI chat with Gemini integration (or demo mode)
- [x] Resume upload and analysis (localStorage)
- [x] User profile management (localStorage)
- [x] Persistent chat history (localStorage)
- [x] Splash screen with intro video
- [x] Modern, responsive UI
- [x] Admin panel (if enabled)
- [x] No database required (stateless backend)

---

## ❓ Need Help?
- Check browser console for errors
- See `SPLASH_SCREEN_GUIDE.md` for splash setup
- See `BACKEND_README.md` for backend/API setup
- For issues, contact project maintainer

---

**Hackathon Submission – All core features working locally!**



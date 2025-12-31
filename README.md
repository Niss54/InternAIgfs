# 🚀 InternAI – AI Internship & Resume Mentor

## 📝 Project Overview
InternAI is a modern, AI-powered platform designed to help students and job seekers improve their resumes, get personalized internship suggestions, and receive actionable career guidance. The platform features:
- AI chat assistant for resume and career queries
- Resume upload and analysis
- User profile management
***

## 1. One-liner
AI-assisted platform that helps students discover internships, improve resumes, and get data-driven career guidance.

## 2. Problem statement
Finding relevant internships and preparing an application is time-consuming for early-career students. Many candidates lack personalised guidance for resume improvement, interview readiness, and targeted internship discovery. This results in missed opportunities and inefficient job-search workflows.

## 3. Solution overview
InternAI provides a prototype dashboard combining internship discovery, resume analysis, and an AI chat assistant that offers personalised recommendations. The prototype focuses on a smooth onboarding and demo-ready experience so evaluators can quickly try core functionality.

## 4. Key features
- AI-powered resume analysis and suggestions
- Personalized internship recommendations and search
- Dashboard with stats, applications, and activity
- Networking hub for community posts and groups (prototype)
- Referrals and basic referral tracking dashboard
- Local demo mode with sample data and simplified auth

## 5. Prototype scope
This repository contains a hackathon prototype: an interactive frontend, demo backend endpoints, local storage for profiles/resumes/chats, and admin scaffolding. It is intended for evaluation and not for production use.

## 6. Tech stack
- Frontend: React, Vite, TypeScript, Tailwind CSS
- UI: shadcn/ui components, Lucide icons
- Backend (demo): Node.js / Express (stateless endpoints)
- Storage: Browser localStorage for profile, resume and chat

## 7. How to run locally
1. Clone the repo and enter the project directory.

```powershell
git clone <REPO_URL>
cd <PROJECT_FOLDER>
npm install
```

2. Start the frontend (Vite dev server):

```powershell
npm run dev
```

3. (Optional) Start the demo backend in a separate terminal if you plan to call server endpoints:

```powershell
node server.cjs
```

4. Open the local URL shown by Vite (commonly `http://localhost:5173/` or `http://localhost:8080/`).

## 8. Future scope
- Add persistent backend storage (e.g. Supabase or Postgres)
- Securely integrate production-grade AI APIs with proper rate-limiting
- Implement full authentication & authorization (JWT / OAuth)
- Add real-time networking (websockets) and notifications
- Add E2E tests and CI/CD for production readiness

## 9. Team / Author
- Team: Syntrix
- Built by: Nishant Maurya
- Role: Founder & Developer

## 10. Disclaimer
This project was developed as part of a hackathon / innovation challenge and is a prototype for demonstration and evaluation purposes only.

***


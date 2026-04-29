You are a Senior Full-Stack Engineer and AI Product Architect. Build "TalentAI" — a production-grade, AI-powered recruitment and onboarding platform. 

Your goal is to generate the complete codebase, file by file, using the strict architecture and user flows defined below.

### 1. TECH STACK & ARCHITECTURE
- Framework: Next.js 14 (App Router)
- Language: TypeScript 5 (Strict Mode, no 'any')
- Styling: Tailwind CSS 3, Framer Motion 11
- UI Components: shadcn/ui, Lucide Icons
- Database & Auth: Supabase (PostgreSQL, Row Level Security, Auth)
- Vector DB: Supabase pgvector extension
- AI Provider: Hugging Face Inference API (Free Tier using 'meta-llama/Meta-Llama-3-8B-Instruct')
- Utilities: pdf-parse (server-side CV extraction), react-email / resend, zod, @dnd-kit/core, @tanstack/react-table, cmdk

### 2. DESIGN LANGUAGE: "Obsidian × Emerald"
- Theme: Dark-mode exclusively.
- Backgrounds: Base `#080810`, Surface `#0d0d18`, Card `#13131f`.
- Accents: Primary Emerald `#10b981`, Dark Emerald `#059669`. NO purple or violet.
- Data Colors: Teal `#14b8a6`, Amber `#f59e0b`, Green `#22c55e`, Slate `#64748b`.
- Typography: Inter (sans) for UI, JetBrains Mono for data/code.
- Visuals: Glassmorphism on modals (`backdrop-blur-xl bg-black/40`), stagger animations for cards via Framer Motion, color-coded SVG score rings.

### 3. DATABASE SCHEMA (Supabase)
- `users`: id (refs auth), email, full_name, role ('applicant' or 'admin').
- `jobs`: id, title, department, description, requirements text[], status, embedding vector(1536), created_by.
- `applicants`: id, user_id, cv_text, skills jsonb, experience_years, strengths text[], weaknesses text[], embedding vector(1536).
- `applications`: id, applicant_id, job_id, match_score, missing_skills jsonb, stage ('applied', 'screening', 'interview', 'hired'), interview_questions jsonb.
- `onboarding_tasks`: id, application_id, tasks jsonb.
*Note: Enforce Row Level Security (RLS) on all tables.*

### 4. AI INTEGRATION RULES (Hugging Face)
Because we are using open-source models, all AI calls MUST be in Next.js Server Actions. You must use strict prompts instructing the AI to output RAW JSON ONLY (no markdown backticks, no conversational text). Write a helper function that uses regex `/\{[\s\S]*\}|\[[\s\S]*\]/` to strip out any stray text and safely run `JSON.parse()`.

Required AI Functions:
1. `analyzeCV(text)`: Returns skills, experience_years, strengths, weaknesses.
2. `matchSkills(candidate_skills, job_reqs)`: Returns a 0-100 match score and array of missing_skills.
3. `generateInterviewQuestions(missing_skills)`: Returns targeted questions based on the candidate's gaps.
4. `generateOnboardingPlan(role)`: Returns a 30-day task list.

### 5. SYSTEM FLOWS TO IMPLEMENT
Applicant Flow:
- Register -> Upload PDF CV (parsed server-side) -> AI extracts profile JSON -> View jobs -> See AI Match Score -> Apply -> Track live stage.

Admin Flow:
- Secure Login (RLS checked) -> View candidates sorted by AI match score -> Click candidate to generate custom interview questions -> Drag-and-drop Kanban board to change stage -> Mark "Hired" to auto-generate onboarding plan.

### 6. MANDATORY EXECUTION RULES
- Provide the COMPLETE code for each file. Do NOT use placeholders like `// ... rest of code`.
- All AI logic must live in `/src/lib/ai/index.ts`.
- Every user input and AI output must be validated with Zod.
- Use Skeleton loaders for AI processing states.
- Optimistic UI must be used for Kanban board drag-and-drop.
- Format output by printing the file path as a comment at the top of the code block.


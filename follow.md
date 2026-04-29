

### Phase 1: The Applicant Flow
This is the journey of a candidate interacting with the platform.

1. **Authentication:** * The user registers via the Next.js frontend. 
   * Supabase Auth creates the user and triggers a webhook to insert their profile into the `users` table with the role `applicant`.
2. **CV Upload:** * The applicant uploads a PDF resume. 
   * The file is sent via a Next.js Server Action to the backend, where `pdf-parse` extracts the raw text.
3. **AI Profile Analysis:** * The Next.js server sends the raw text to the Hugging Face API using the `analyzeCV` prompt. 
   * The AI returns a strict JSON object detailing their skills, strengths, weaknesses, and experience.
4. **Vector Storage:** * The candidate's JSON profile is saved to the Supabase `applicants` table. 
   * A vector embedding of their profile is generated and stored using `pgvector` for future semantic search.
5. **Job Discovery & Matching:** * The applicant browses the job board. 
   * For each job, a Server Action runs the `matchSkills` Hugging Face function, comparing the candidate's JSON profile to the job requirements. 
   * The UI displays a predicted 0-100 match score and a personalized "skill gap" roadmap.
6. **Application Tracking:** * The user clicks "Apply", inserting a record into the `applications` table. 
   * They can track their live status (e.g., "Screening," "Interview") on their dashboard via Supabase real-time subscriptions.

---

### Phase 2: The Admin Flow (HR/Recruiter)
This is the journey of the HR team managing the hiring pipeline.

1. **Secure Login:** * The admin logs in. Next.js Middleware checks their Supabase session and Row Level Security (RLS) ensures they have the `admin` role before allowing access to the `/admin` dashboard.
2. **Sourcing & Ranking:** * The admin views the candidates for an open role. 
   * The data table (`@tanstack/react-table`) automatically sorts candidates by their AI-generated `match_score`, allowing HR to triage the best fits instantly.
3. **Generate Interview Guide:** * The admin clicks on a candidate's profile and hits "Generate Questions." 
   * The Hugging Face API takes the candidate's specific `missing_skills` and generates targeted technical and behavioral interview questions to test those exact weaknesses.
4. **Kanban Pipeline:** * The admin drags a candidate from the "Applied" column to the "Interview" column. 
   * Optimistic UI makes the card snap instantly. 
   * In the background, a Server Action updates the Supabase database.
5. **Automated Stage Emails:** * Moving the candidate to a new stage triggers a webhook. 
   * Resend fires off a styled `react-email` template to the candidate, letting them know their application has progressed.
6. **Hired & Onboarding:** * The admin drops the candidate into the "Hired" column. 
   * This triggers the final AI function: Hugging Face generates a customized 30-day onboarding plan based on the job title and the candidate's profile, saving it to the `onboarding_tasks` table for the IT and HR teams to execute.


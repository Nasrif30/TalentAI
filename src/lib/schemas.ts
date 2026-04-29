import { z } from 'zod';

// Profile extracted from CV
export const CVProfileSchema = z.object({
  skills: z.array(z.string()),
  experience_years: z.number(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
});

// Job requirements extraction/matching
export const MatchResultSchema = z.object({
  match_score: z.number().min(0).max(100),
  missing_skills: z.array(z.string()),
});

// Interview Questions
export const InterviewQuestionsSchema = z.object({
  questions: z.array(
    z.object({
      skill: z.string(),
      question: z.string(),
      expected_answer_points: z.array(z.string()),
    })
  ),
});

// Onboarding Plan
export const OnboardingPlanSchema = z.object({
  tasks: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      description: z.string(),
    })
  ),
});

// User Input Validation Schemas
export const JobInputSchema = z.object({
  title: z.string().min(2),
  department: z.string().min(2),
  description: z.string().min(10),
  requirements: z.array(z.string()).min(1),
});

// AI Generated Job Output
export const GeneratedJobSchema = z.object({
  department: z.string(),
  description: z.string(),
  requirements: z.array(z.string()),
});

// AI Upskill Roadmap
export const UpskillRoadmapSchema = z.object({
  project_idea: z.object({
    title: z.string(),
    description: z.string(),
  }),
  study_concepts: z.array(z.string()),
});

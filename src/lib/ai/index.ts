'use server'

import { HfInference } from '@huggingface/inference'
import { z } from 'zod'
import { 
  CVProfileSchema, 
  MatchResultSchema, 
  InterviewQuestionsSchema, 
  OnboardingPlanSchema 
} from '../schemas'

const hf = new HfInference(process.env.HF_TOKEN)
const MODEL = 'meta-llama/Meta-Llama-3-8B-Instruct'

/**
 * Helper to safely extract JSON from LLM output using regex
 */
function extractJSON<T>(text: string): T {
  try {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
    if (!match) {
      throw new Error("No JSON found in response.")
    }
    return JSON.parse(match[0]) as T
  } catch (error) {
    console.error("Failed to parse JSON:", text)
    throw new Error("Failed to parse AI response into valid JSON")
  }
}

/**
 * 1. Analyze CV to extract skills, experience, strengths, and weaknesses.
 */
export async function analyzeCV(text: string) {
  const response = await hf.chatCompletion({
    model: MODEL,
    messages: [
      { 
        role: 'system', 
        content: 'You are an expert HR parser. Output ONLY valid JSON, no markdown formatting, no backticks, no explanations.\nRequired JSON format:\n{\n  "skills": ["skill1", "skill2"],\n  "experience_years": 5,\n  "strengths": ["strength1", "strength2"],\n  "weaknesses": ["weakness1"]\n}' 
      },
      { 
        role: 'user', 
        content: `Parse the following CV text:\n${text.substring(0, 4000)}` 
      }
    ],
    max_tokens: 512,
    temperature: 0.1,
  })

  const responseText = response.choices[0]?.message?.content || ""
  const rawJson = extractJSON<z.infer<typeof CVProfileSchema>>(responseText)
  return CVProfileSchema.parse(rawJson)
}

/**
 * 2. Match Candidate Skills against Job Requirements.
 */
export async function matchSkills(candidateSkills: string[], jobRequirements: string[]) {
  const response = await hf.chatCompletion({
    model: MODEL,
    messages: [
      { 
        role: 'system', 
        content: 'You are an expert Recruiter AI. Output ONLY valid JSON, no markdown formatting, no backticks, no explanations.\nCalculate a match score (0-100) and list missing skills based on the requirements.\nRequired JSON format:\n{\n  "match_score": 85,\n  "missing_skills": ["missing1", "missing2"]\n}' 
      },
      { 
        role: 'user', 
        content: `Candidate Skills: ${candidateSkills.join(', ')}\nJob Requirements: ${jobRequirements.join(', ')}` 
      }
    ],
    max_tokens: 256,
    temperature: 0.1,
  })

  const responseText = response.choices[0]?.message?.content || ""
  const rawJson = extractJSON<z.infer<typeof MatchResultSchema>>(responseText)
  return MatchResultSchema.parse(rawJson)
}

/**
 * 3. Generate targeted interview questions based on missing skills.
 */
export async function generateInterviewQuestions(missingSkills: string[]) {
  if (!missingSkills || missingSkills.length === 0) {
    return { questions: [] }
  }

  const response = await hf.chatCompletion({
    model: MODEL,
    messages: [
      { 
        role: 'system', 
        content: 'You are a Senior Technical Interviewer. Output ONLY valid JSON, no markdown formatting, no backticks, no explanations.\nCreate exactly 3 interview questions to test the candidate on the provided missing skills.\nRequired JSON format:\n{\n  "questions": [\n    {\n      "skill": "React",\n      "question": "How do you manage state in a complex React app?",\n      "expected_answer_points": ["Context API", "Redux", "Zustand"]\n    }\n  ]\n}' 
      },
      { 
        role: 'user', 
        content: `Missing Skills: ${missingSkills.join(', ')}` 
      }
    ],
    max_tokens: 1024,
    temperature: 0.7,
  })

  const responseText = response.choices[0]?.message?.content || ""
  const rawJson = extractJSON<z.infer<typeof InterviewQuestionsSchema>>(responseText)
  return InterviewQuestionsSchema.parse(rawJson)
}

/**
 * 4. Generate a 30-day onboarding plan based on role.
 */
export async function generateOnboardingPlan(role: string) {
  const response = await hf.chatCompletion({
    model: MODEL,
    messages: [
      { 
        role: 'system', 
        content: 'You are an expert HR Onboarding Manager. Output ONLY valid JSON, no markdown formatting, no backticks, no explanations.\nCreate a structured 30-day onboarding task list for the given role.\nRequired JSON format:\n{\n  "tasks": [\n    {\n      "day": 1,\n      "title": "Setup Equipment",\n      "description": "Get laptop and access credentials."\n    }\n  ]\n}' 
      },
      { 
        role: 'user', 
        content: `Role: ${role}` 
      }
    ],
    max_tokens: 1024,
    temperature: 0.7,
  })

  const responseText = response.choices[0]?.message?.content || ""
  const rawJson = extractJSON<z.infer<typeof OnboardingPlanSchema>>(responseText)
  return OnboardingPlanSchema.parse(rawJson)
}

/**
 * 5. Generate a full job post from a simple title.
 */
import { GeneratedJobSchema } from '../schemas'
export async function generateJobPost(title: string) {
  const response = await hf.chatCompletion({
    model: MODEL,
    messages: [
      { 
        role: 'system', 
        content: 'You are an expert Technical Recruiter. Output ONLY valid JSON, no markdown formatting, no backticks, no explanations.\nCreate a professional job description, department, and a list of required skills for the given job title.\nRequired JSON format:\n{\n  "department": "Engineering",\n  "description": "We are looking for a highly skilled...",\n  "requirements": ["React", "TypeScript", "Node.js"]\n}' 
      },
      { 
        role: 'user', 
        content: `Job Title: ${title}` 
      }
    ],
    max_tokens: 1024,
    temperature: 0.7,
  })

  const responseText = response.choices[0]?.message?.content || ""
  const rawJson = extractJSON<z.infer<typeof GeneratedJobSchema>>(responseText)
  return GeneratedJobSchema.parse(rawJson)
}

/**
 * 6. Generate an Upskill Roadmap for candidates who lack skills.
 */
import { UpskillRoadmapSchema } from '../schemas'
export async function generateUpskillRoadmap(missingSkills: string[], jobTitle: string) {
  const response = await hf.chatCompletion({
    model: MODEL,
    messages: [
      { 
        role: 'system', 
        content: 'You are an expert Career Coach. Output ONLY valid JSON, no markdown formatting, no backticks, no explanations.\nCreate an actionable project idea and a list of concepts to study to help the candidate learn the missing skills for this job.\nRequired JSON format:\n{\n  "project_idea": {\n    "title": "Build a Task App",\n    "description": "Create a full-stack..."\n  },\n  "study_concepts": ["React Hooks", "Postgres Joins"]\n}' 
      },
      { 
        role: 'user', 
        content: `Target Job: ${jobTitle}\nMissing Skills: ${missingSkills.join(', ')}` 
      }
    ],
    max_tokens: 1024,
    temperature: 0.7,
  })

  const responseText = response.choices[0]?.message?.content || ""
  const rawJson = extractJSON<z.infer<typeof UpskillRoadmapSchema>>(responseText)
  return UpskillRoadmapSchema.parse(rawJson)
}

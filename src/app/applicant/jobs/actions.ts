'use server'

import { createClient } from '@/lib/supabase/server'
import { matchSkills } from '@/lib/ai'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getJobsAndMatch() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 1. Get Applicant Profile
  const { data: applicant } = await supabase
    .from('applicants')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!applicant) {
    redirect('/applicant/profile')
  }

  // 2. Get Open Jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'open')

  // Get existing applications for this applicant
  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .eq('applicant_id', applicant.id)

  if (!jobs || jobs.length === 0) return { jobs: [], applicant, applications: [] }

  // 3. Run AI Matching for all jobs in parallel
  // This might hit rate limits on Free Tier HF, but we assume it works or we should just do it on demand.
  // We'll do it in parallel for simplicity as requested by flow.
  const jobsWithMatch = await Promise.all(
    jobs.map(async (job) => {
      try {
        const matchResult = await matchSkills(
          applicant.skills || [], 
          job.requirements || []
        )
        return {
          ...job,
          match_score: matchResult.match_score,
          missing_skills: matchResult.missing_skills
        }
      } catch (error) {
        console.error('Match error for job', job.id, error)
        return {
          ...job,
          match_score: 0,
          missing_skills: []
        }
      }
    })
  )

  // Sort by match score descending
  jobsWithMatch.sort((a, b) => b.match_score - a.match_score)

  return { jobs: jobsWithMatch, applicant, applications: applications || [] }
}

export async function applyForJob(jobId: string, applicantId: string, matchScore: number, missingSkills: string[]) {
  const supabase = await createClient()

  let upskillRoadmap = null
  if (missingSkills && missingSkills.length > 0) {
    try {
      // Get job title to provide context for the AI
      const { data: job } = await supabase.from('jobs').select('title').eq('id', jobId).single()
      if (job) {
        const ai = await import('@/lib/ai')
        upskillRoadmap = await ai.generateUpskillRoadmap(missingSkills, job.title)
      }
    } catch (e) {
      console.error('Failed to generate upskill roadmap', e)
    }
  }

  const { error } = await supabase
    .from('applications')
    .insert({
      applicant_id: applicantId,
      job_id: jobId,
      match_score: matchScore,
      missing_skills: missingSkills,
      upskill_roadmap: upskillRoadmap,
      stage: 'applied'
    })

  if (error) {
    if (error.code === '23505') {
      return { error: 'You have already applied for this role.' }
    }
    return { error: 'Failed to submit application.' }
  }

  revalidatePath('/applicant/jobs')
  return { success: true }
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateOnboardingPlan } from '@/lib/ai'
import { Resend } from 'resend'
import { StageChangeEmail } from '@/emails/StageChangeEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function getCandidates() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // In a real app we'd filter by admin, RLS handles this
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      applicants (*, users (full_name, email)),
      jobs (title, department)
    `)
    .order('match_score', { ascending: false })

  return applications || []
}

export async function getActiveJobs() {
  const supabase = await createClient()
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
  
  return jobs || []
}

export async function updateApplicationStage(applicationId: string, newStage: string) {
  const supabase = await createClient()

  const { data: app, error } = await supabase
    .from('applications')
    .update({ stage: newStage })
    .eq('id', applicationId)
    .select('*, jobs(title), applicants(users(full_name, email))')
    .single()

  if (error) {
    console.error('Failed to update stage:', error)
    return { error: 'Failed to update stage' }
  }

  // Trigger Email via Resend
  if (process.env.RESEND_API_KEY && app.applicants?.users?.email) {
    try {
      await resend.emails.send({
        from: 'TalentAI <onboarding@resend.dev>',
        to: app.applicants.users.email,
        subject: `Update on your application for ${app.jobs?.title}`,
        react: StageChangeEmail({
          candidateName: app.applicants.users.full_name || 'Candidate',
          jobTitle: app.jobs?.title || 'Position',
          newStage: newStage
        })
      })
    } catch (e) {
      console.error('Failed to send email:', e)
    }
  }

  // Trigger onboarding generation if hired
  if (newStage === 'hired') {
    try {
      const plan = await generateOnboardingPlan(app.jobs?.title || 'New Hire')
      await supabase
        .from('onboarding_tasks')
        .insert({
          application_id: applicationId,
          tasks: plan.tasks
        })
    } catch (e) {
      console.error('Failed to generate onboarding plan:', e)
    }
  }

  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function createJobWithAI(title: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  try {
    const jobData = await import('@/lib/ai').then(m => m.generateJobPost(title))
    
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title,
        department: jobData.department,
        description: jobData.description,
        requirements: jobData.requirements,
        status: 'open',
        created_by: user.id
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/dashboard')
    revalidatePath('/applicant/jobs')
    return { success: true, job: data }
  } catch (error: any) {
    console.error('Failed to create job:', error)
    return { error: error.message || 'Failed to generate job' }
  }
}

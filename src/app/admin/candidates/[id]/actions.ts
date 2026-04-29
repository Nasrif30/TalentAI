'use server'

import { createClient } from '@/lib/supabase/server'
import { generateInterviewQuestions as aiGenerateQuestions } from '@/lib/ai'
import { revalidatePath } from 'next/cache'

export async function getCandidateDetails(applicationId: string) {
  const supabase = await createClient()

  const { data: application } = await supabase
    .from('applications')
    .select(`
      *,
      applicants (*, users (full_name, email)),
      jobs (title, department, requirements),
      onboarding_tasks (*)
    `)
    .eq('id', applicationId)
    .single()

  return application
}

export async function generateAndSaveInterviewQuestions(applicationId: string, missingSkills: string[]) {
  const supabase = await createClient()

  try {
    const aiResult = await aiGenerateQuestions(missingSkills)
    
    await supabase
      .from('applications')
      .update({ interview_questions: aiResult.questions })
      .eq('id', applicationId)

    revalidatePath(`/admin/candidates/${applicationId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Failed to generate interview questions:', error)
    return { error: error.message || 'Failed to generate interview questions' }
  }
}

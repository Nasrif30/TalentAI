'use server'

import { createClient } from '@/lib/supabase/server'
import { analyzeCV } from '@/lib/ai'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { PDFParse as pdfParse } from 'pdf-parse'

export async function uploadAndParseCV(formData: FormData) {
  const supabase = await createClient()
  const file = formData.get('cv') as File

  if (!file || file.type !== 'application/pdf') {
    return { error: 'Please upload a valid PDF file.' }
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated.' }
  }

  try {
    // 1. Extract text from PDF
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const parser = new pdfParse({ data: buffer })
    const pdfData = await parser.getText()
    const text = pdfData.text

    if (!text || text.length < 50) {
      return { error: 'Could not extract enough text from the PDF. Is it an image-based PDF?' }
    }

    // 2. AI Profile Analysis
    const profileJson = await analyzeCV(text)

    // 3. Save to Supabase
    // Note: In a real app, you would also compute the embedding vector here using a local model or an API,
    // and insert it into `pgvector` embedding column. For this scope, we just insert the JSON.
    const { error: dbError } = await supabase
      .from('applicants')
      .upsert({
        user_id: user.id,
        cv_text: text,
        skills: profileJson.skills,
        experience_years: profileJson.experience_years,
        strengths: profileJson.strengths,
        weaknesses: profileJson.weaknesses,
      }, { onConflict: 'user_id' })

    if (dbError) {
      console.error('DB Error:', dbError)
      return { error: 'Failed to save profile to database.' }
    }

  } catch (error: any) {
    console.error('Processing error:', error)
    return { error: error.message || 'An error occurred while processing your CV.' }
  }

  revalidatePath('/applicant/jobs')
  redirect('/applicant/jobs')
}

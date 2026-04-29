'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { generateAndSaveInterviewQuestions } from '@/app/admin/candidates/[id]/actions'
import { BrainCircuit } from 'lucide-react'

export function GenerateQuestionsButton({ applicationId, missingSkills }: { applicationId: string, missingSkills: string[] }) {
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    await generateAndSaveInterviewQuestions(applicationId, missingSkills)
    setLoading(false)
  }

  return (
    <Button 
      onClick={handleGenerate} 
      disabled={loading || missingSkills.length === 0}
      className="bg-primary hover:bg-primary/90"
    >
      <BrainCircuit className="w-4 h-4 mr-2" />
      {loading ? 'Generating...' : 'Generate Technical Questions'}
    </Button>
  )
}

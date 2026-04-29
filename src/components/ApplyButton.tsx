'use client'

import { useState } from 'react'
import { applyForJob } from '@/app/applicant/jobs/actions'
import { Button } from '@/components/ui/button'

interface ApplyButtonProps {
  jobId: string
  applicantId: string
  matchScore: number
  missingSkills: string[]
}

export function ApplyButton({ jobId, applicantId, matchScore, missingSkills }: ApplyButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleApply() {
    setLoading(true)
    setError(null)
    
    const result = await applyForJob(jobId, applicantId, matchScore, missingSkills)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else if (result.success) {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Button className="w-full bg-data-green/20 text-data-green hover:bg-data-green/30" disabled>
        Applied Successfully
      </Button>
    )
  }

  return (
    <div className="w-full">
      {error && <p className="text-destructive text-xs mb-2 text-center">{error}</p>}
      <Button 
        onClick={handleApply} 
        disabled={loading} 
        className="w-full dark:bg-white/10 bg-black/10 hover:bg-primary/20 hover:text-primary transition-colors"
      >
        {loading ? 'Submitting...' : 'Apply Now'}
      </Button>
    </div>
  )
}

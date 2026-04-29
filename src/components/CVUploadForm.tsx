'use client'

import { useState } from 'react'
import { uploadAndParseCV } from '@/app/applicant/profile/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FileUp, BrainCircuit, CheckCircle2 } from 'lucide-react'

export function CVUploadForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await uploadAndParseCV(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-xl mx-auto glass dark:border-white/10 border-black/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
      <CardHeader>
        <CardTitle className="text-2xl flex items-center space-x-2">
          <FileUp className="w-6 h-6 text-primary" />
          <span>Upload your CV</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Upload your resume in PDF format. Our AI will automatically extract your skills, experience, and generate your candidate profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-6 py-4">
            <div className="flex items-center space-x-4 text-primary animate-pulse">
              <BrainCircuit className="w-8 h-8" />
              <span className="font-medium text-lg">AI is analyzing your profile...</span>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-[250px] dark:bg-white/5 bg-black/5" />
              <Skeleton className="h-4 w-[200px] dark:bg-white/5 bg-black/5" />
              <Skeleton className="h-4 w-full dark:bg-white/5 bg-black/5" />
              <Skeleton className="h-4 w-full dark:bg-white/5 bg-black/5" />
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Extracting technical skills</span>
            </div>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors bg-black/20">
              <input 
                type="file" 
                name="cv" 
                id="cv" 
                accept="application/pdf" 
                required 
                className="hidden"
                onChange={(e) => {
                  const fileName = e.target.files?.[0]?.name;
                  const label = document.getElementById('file-label');
                  if (label && fileName) label.innerText = fileName;
                }}
              />
              <label htmlFor="cv" className="cursor-pointer flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileUp className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <span id="file-label" className="text-lg font-medium">Click to select PDF</span>
                  <p className="text-sm text-muted-foreground mt-1">Maximum file size: 5MB</p>
                </div>
              </label>
            </div>

            {error && (
              <div className="p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" size="lg">
              Analyze Profile
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

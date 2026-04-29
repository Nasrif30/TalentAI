import { CVUploadForm } from '@/components/CVUploadForm'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <div className="z-10 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Complete Your Profile</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Let TalentAI analyze your professional background to match you with the perfect opportunities.
          </p>
        </div>
        <CVUploadForm />
      </div>
    </div>
  )
}

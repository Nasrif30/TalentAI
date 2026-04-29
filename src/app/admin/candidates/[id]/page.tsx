import { getCandidateDetails } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GenerateQuestionsButton } from '@/components/GenerateQuestionsButton'
import { User, Briefcase, FileText, CheckCircle2, Target, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function CandidateDetailPage({ params }: { params: { id: string } }) {
  // Await params to access the id properly in Next.js 15
  const { id } = await Promise.resolve(params);
  const application = await getCandidateDetails(id)

  if (!application) {
    return <div className="p-8 text-center">Candidate not found</div>
  }

  const applicant = application.applicants
  const user = applicant.users
  const job = application.jobs

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/admin/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Pipeline
      </Link>

      {/* Header Profile */}
      <div className="flex flex-col md:flex-row md:items-start justify-between bg-card p-6 md:p-8 rounded-2xl border dark:border-white/10 border-black/10 shadow-lg gap-6">
        <div className="flex flex-col md:flex-row md:space-x-6 items-start md:items-center gap-4 md:gap-0">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-4 border-background shrink-0">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.full_name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-muted-foreground">
              <span className="flex items-center text-sm"><Briefcase className="w-4 h-4 mr-1"/> Applied for: <strong className="text-foreground ml-1">{job.title}</strong></span>
              <Badge variant="outline" className="capitalize border-primary/20 text-primary bg-primary/5">{application.stage}</Badge>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right w-full md:w-auto dark:bg-black/20 bg-black/5 p-4 rounded-xl border dark:border-white/5 border-black/5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">AI Match Score</p>
          <div className="flex items-center justify-start md:justify-end gap-2">
            <span className={`text-4xl font-black ${application.match_score >= 80 ? 'text-data-green' : application.match_score >= 50 ? 'text-data-amber' : 'text-destructive'}`}>
              {application.match_score}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Skills & Profile */}
        <div className="md:col-span-1 space-y-8">
          <Card className="glass dark:border-white/10 border-black/10">
            <CardHeader>
              <CardTitle className="text-lg">Extracted Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills?.map((skill: string, i: number) => (
                    <Badge key={i} variant="secondary" className="dark:bg-white/10 bg-black/10">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Strengths</h4>
                <ul className="space-y-1 text-sm list-disc pl-4">
                  {applicant.strengths?.map((str: string, i: number) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Analysis & Onboarding */}
        <div className="md:col-span-2 space-y-8">
          {/* Missing Skills & Interview Questions */}
          <Card className="glass dark:border-white/10 border-black/10 border-t-primary/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  Targeted Interview Guide
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  AI generated questions based on missing skills.
                </p>
              </div>
              <GenerateQuestionsButton applicationId={application.id} missingSkills={application.missing_skills || []} />
            </CardHeader>
            <CardContent>
              {application.interview_questions ? (
                <div className="space-y-6">
                  {application.interview_questions.map((q: any, i: number) => (
                    <div key={i} className="dark:bg-black/20 bg-black/5 p-4 rounded-xl border dark:border-white/5 border-black/5">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="border-primary/50 text-primary">{q.skill}</Badge>
                      </div>
                      <p className="font-medium text-lg mb-3">{q.question}</p>
                      <div className="dark:bg-white/5 bg-black/5 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Expected Points</p>
                        <ul className="space-y-1">
                          {q.expected_answer_points?.map((pt: string, idx: number) => (
                            <li key={idx} className="text-sm flex items-start">
                              <CheckCircle2 className="w-4 h-4 text-accent mr-2 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border border-dashed dark:border-white/10 border-black/10 rounded-xl">
                  Click generate to create an AI technical interview guide.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Onboarding Plan (if Hired) */}
          {application.stage === 'hired' && application.onboarding_tasks && application.onboarding_tasks[0] && (
            <Card className="glass dark:border-white/10 border-black/10 border-t-data-green/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-data-green" />
                  30-Day Onboarding Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.onboarding_tasks[0].tasks.map((task: any, i: number) => (
                    <div key={i} className="flex space-x-4 p-4 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/5 border-black/5">
                      <div className="bg-data-green/20 text-data-green w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0">
                        D{task.day}
                      </div>
                      <div>
                        <h4 className="font-semibold">{task.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}

import { getJobsAndMatch } from './actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BrainCircuit, Briefcase, Zap, Compass, CheckCircle2, BookOpen, Target } from 'lucide-react'
import { ApplyButton } from '@/components/ApplyButton'
import { LogoutButton } from '@/components/LogoutButton'
import { ThemeToggle } from '@/components/ThemeToggle'

export default async function JobsPage() {
  const { jobs, applicant, applications } = await getJobsAndMatch()

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 max-w-7xl mx-auto transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Job Opportunities</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">AI-matched roles based on your verified profile.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <div className="bg-primary/10 border border-primary/20 px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center space-x-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs md:text-sm font-medium text-primary">Live Match Mode Active</span>
          </div>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 border border-dashed dark:border-white/10 border-black/10 rounded-2xl dark:bg-white/5 bg-black/5">
          <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium">No open jobs right now</h3>
          <p className="text-muted-foreground mt-2">Check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => {
            const isHighMatch = job.match_score >= 80;
            const existingApp = applications?.find((a: any) => a.job_id === job.id);
            const hasApplied = !!existingApp;
            const roadmap = existingApp?.upskill_roadmap;
            
            return (
              <Card key={job.id} className={`glass dark:border-white/10 border-black/10 relative overflow-hidden flex flex-col ${hasApplied ? 'ring-2 ring-primary/50 opacity-90' : ''}`}>
                {isHighMatch && !hasApplied && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg z-10 shadow-lg">
                    Top Match
                  </div>
                )}
                {hasApplied && (
                  <div className="absolute top-0 right-0 dark:bg-zinc-800 bg-zinc-200 dark:text-zinc-300 text-zinc-700 border-l border-b dark:border-white/10 border-black/10 text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                    Applied
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                      <CardDescription>{job.department}</CardDescription>
                    </div>
                    {/* SVG Score Ring */}
                    <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                        <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" 
                          strokeDasharray={150} 
                          strokeDashoffset={150 - (150 * job.match_score) / 100}
                          className={job.match_score >= 80 ? 'text-data-green' : job.match_score >= 50 ? 'text-data-amber' : 'text-destructive'} 
                        />
                      </svg>
                      <span className="absolute text-sm font-bold">{job.match_score}%</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 space-y-4">
                  {!hasApplied ? (
                    <>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {job.description}
                      </p>
                      
                      <div className="pt-2">
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center">
                          <BrainCircuit className="w-3 h-3 mr-1" />
                          Skill Gap Analysis
                        </h4>
                        {job.missing_skills.length === 0 ? (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Perfect Match
                          </Badge>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {job.missing_skills.map((skill: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">
                                Missing: {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : roadmap ? (
                    <div className="dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl p-4 animate-in fade-in zoom-in duration-500">
                      <h4 className="text-sm font-bold text-primary flex items-center mb-3">
                        <Compass className="w-4 h-4 mr-2" />
                        AI Upskill Coach
                      </h4>
                      <p className="text-xs text-muted-foreground mb-4">
                        You're missing some skills. Here's a custom roadmap to help you learn them for next time!
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-xs font-semibold flex items-center mb-2">
                            <Zap className="w-3 h-3 text-data-amber mr-1" />
                            Suggested Project
                          </h5>
                          <div className="bg-black/20 rounded p-3">
                            <span className="block text-sm font-medium mb-1">{roadmap.project_idea?.title}</span>
                            <span className="text-xs text-muted-foreground">{roadmap.project_idea?.description}</span>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-xs font-semibold flex items-center mb-2">
                            <BookOpen className="w-3 h-3 text-indigo-400 mr-1" />
                            Concepts to Study
                          </h5>
                          <ul className="space-y-1">
                            {roadmap.study_concepts?.map((concept: string, idx: number) => (
                              <li key={idx} className="text-xs flex items-center text-muted-foreground">
                                <CheckCircle2 className="w-3 h-3 text-primary mr-1.5 shrink-0" />
                                {concept}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col py-4">
                      <div className="flex items-center justify-between mb-4 border-b dark:border-white/10 border-black/10 pb-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase tracking-widest">Current Stage</span>
                          <span className="text-lg font-bold capitalize text-primary">{existingApp?.stage || 'Applied'}</span>
                        </div>
                        <CheckCircle2 className="w-8 h-8 text-primary opacity-50" />
                      </div>
                      
                      {existingApp?.stage === 'interview' && existingApp?.interview_questions ? (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="text-sm font-semibold flex items-center text-accent">
                            <Target className="w-4 h-4 mr-2" />
                            Your Interview Prep
                          </h4>
                          <p className="text-xs text-muted-foreground">The recruiter has prepared these technical questions for your upcoming interview.</p>
                          <div className="space-y-3 mt-2">
                            {existingApp.interview_questions.map((q: any, i: number) => (
                              <div key={i} className="bg-black/20 p-3 rounded-lg border dark:border-white/5 border-black/5">
                                <Badge variant="outline" className="mb-2 text-[10px] bg-primary/10 text-primary border-primary/20">{q.skill}</Badge>
                                <p className="text-sm font-medium">{q.question}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : existingApp?.stage === 'hired' && existingApp?.onboarding_tasks && existingApp?.onboarding_tasks[0] ? (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                          <h4 className="text-sm font-semibold flex items-center text-data-green">
                            <Compass className="w-4 h-4 mr-2" />
                            Your Onboarding Plan
                          </h4>
                          <div className="space-y-2 mt-2">
                            {existingApp.onboarding_tasks[0].tasks.slice(0, 2).map((task: any, i: number) => (
                              <div key={i} className="dark:bg-white/5 bg-black/5 p-2 rounded-lg border dark:border-white/5 border-black/5 flex gap-3 items-center">
                                <div className="bg-data-green/20 text-data-green text-xs font-bold px-2 py-1 rounded">D{task.day}</div>
                                <span className="text-sm">{task.title}</span>
                              </div>
                            ))}
                            <p className="text-xs text-center text-muted-foreground pt-2">Check your email for the full plan!</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Your application is currently being reviewed. We will notify you when your status changes.</p>
                      )}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="pt-4 border-t dark:border-white/10 border-black/10">
                  {!hasApplied ? (
                    <ApplyButton jobId={job.id} applicantId={applicant.id} matchScore={job.match_score} missingSkills={job.missing_skills} />
                  ) : (
                    <button disabled className="w-full dark:bg-zinc-800 bg-zinc-200 dark:text-zinc-400 text-zinc-600 py-2 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
                      Applied
                    </button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

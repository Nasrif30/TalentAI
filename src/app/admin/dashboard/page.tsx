import { getCandidates, getActiveJobs } from './actions'
import { KanbanBoard } from '@/components/KanbanBoard'
import { LayoutDashboard, Briefcase } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

import { JobGeneratorModal } from '@/components/JobGeneratorModal'
import { LogoutButton } from '@/components/LogoutButton'
import { ThemeToggle } from '@/components/ThemeToggle'

export default async function AdminDashboard() {
  const applications = await getCandidates()
  const activeJobs = await getActiveJobs()

  return (
    <div className="min-h-screen bg-background text-foreground p-8 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Recruitment Pipeline</h1>
              <p className="text-sm md:text-base text-muted-foreground">Manage candidates and AI matching scores.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <JobGeneratorModal />
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>

        {activeJobs.length > 0 && (
          <div className="mb-8 p-4 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Active AI Roles
            </h2>
            <div className="flex flex-wrap gap-3">
              {activeJobs.map((job) => (
                <div key={job.id} className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                  {job.title}
                  <Badge variant="secondary" className="bg-primary/20 hover:bg-primary/30 ml-2">
                    {job.department}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <KanbanBoard initialApplications={applications} />
      </div>
    </div>
  )
}

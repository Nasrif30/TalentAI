'use client'

import { useState, useTransition } from 'react'
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core'
import { updateApplicationStage } from '@/app/admin/dashboard/actions'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const STAGES = ['applied', 'screening', 'interview', 'hired']

export function KanbanBoard({ initialApplications }: { initialApplications: any[] }) {
  const [applications, setApplications] = useState(initialApplications)
  const [isPending, startTransition] = useTransition()

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    const applicationId = active.id as string
    const newStage = over.id as string

    const appIndex = applications.findIndex(app => app.id === applicationId)
    if (appIndex === -1 || applications[appIndex].stage === newStage) return

    // Optimistic update
    const previousState = [...applications]
    const nextState = [...applications]
    nextState[appIndex] = { ...nextState[appIndex], stage: newStage }
    setApplications(nextState)

    // Server update
    startTransition(async () => {
      const result = await updateApplicationStage(applicationId, newStage)
      if (result.error) {
        // Revert on error
        setApplications(previousState)
      }
    })
  }

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STAGES.map((stage) => (
          <KanbanColumn key={stage} id={stage} title={stage} applications={applications.filter(a => a.stage === stage)} />
        ))}
      </div>
    </DndContext>
  )
}

import { useDroppable, useDraggable } from '@dnd-kit/core'
import Link from 'next/link'
import { motion } from 'framer-motion'

function KanbanColumn({ id, title, applications }: { id: string, title: string, applications: any[] }) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      ref={setNodeRef} 
      className="dark:bg-white/5 bg-black/5 rounded-xl p-4 min-h-[300px] md:min-h-[500px] border dark:border-white/10 border-black/10 flex flex-col"
    >
      <h3 className="font-semibold text-lg capitalize mb-4 text-muted-foreground flex items-center justify-between">
        {title}
        <Badge variant="secondary" className="bg-primary/10 text-primary">{applications.length}</Badge>
      </h3>
      <div className="space-y-4 flex-1">
        {applications.map(app => (
          <KanbanCard key={app.id} application={app} />
        ))}
      </div>
    </motion.div>
  )
}

function KanbanCard({ application }: { application: any }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: application.id,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
  } : undefined

  const applicant = application.applicants?.users
  const job = application.jobs

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing outline-none">
      <motion.div 
        layoutId={`card-${application.id}`}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="glass dark:border-white/10 border-black/10 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-sm">{applicant?.full_name || 'Unknown Candidate'}</h4>
              <div className={`text-xs font-bold px-2 py-0.5 rounded ${application.match_score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {application.match_score}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{job?.title}</p>
            <div className="flex justify-end">
              <Link 
                href={`/admin/candidates/${application.id}`}
                className="text-[10px] uppercase tracking-wider text-indigo-400 hover:text-indigo-300 font-semibold"
                onPointerDown={(e) => e.stopPropagation()}
              >
                View Details &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

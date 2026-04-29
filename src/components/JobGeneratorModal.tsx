'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Sparkles, X, Loader2, Briefcase } from 'lucide-react'
import { createJobWithAI } from '@/app/admin/dashboard/actions'

export function JobGeneratorModal() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await createJobWithAI(title)
      if (result.error) {
        setError(result.error)
      } else {
        setOpen(false)
        setTitle('')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate job')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
          <Sparkles className="w-4 h-4" />
          Create Job with AI
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-800 dark:bg-zinc-950 bg-white p-6 shadow-2xl sm:rounded-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <Dialog.Title className="text-xl font-semibold leading-none tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              AI Job Generator
            </Dialog.Title>
            <Dialog.Description className="text-sm dark:text-zinc-400 text-zinc-600 pt-2">
              Simply type a job title. Our AI will instantly write the description, define the requirements, and publish it to your job board.
            </Dialog.Description>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium dark:text-zinc-300 text-zinc-700">
                Job Title
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Senior Full Stack Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 pl-10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 p-3 rounded-md border border-red-400/20">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium dark:text-zinc-300 text-zinc-700 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isLoading || !title.trim()}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate & Publish
                  </>
                )}
              </button>
            </div>
          </form>

          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4 dark:text-zinc-400 text-zinc-600" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

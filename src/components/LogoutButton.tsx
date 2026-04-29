'use client'

import { logout } from '@/app/auth/actions'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="flex items-center gap-2 text-sm font-medium dark:text-zinc-400 text-zinc-600 hover:text-white transition-colors dark:bg-white/5 bg-black/5 hover:dark:bg-white/10 bg-black/10 px-3 py-1.5 rounded-lg border dark:border-white/5 border-black/5"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  )
}

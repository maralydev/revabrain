'use client'

import { Sidebar } from './Sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Sidebar />
      <main className="ml-[200px] min-h-screen">
        {children}
      </main>
    </div>
  )
}

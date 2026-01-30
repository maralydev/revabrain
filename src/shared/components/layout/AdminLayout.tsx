'use client'

import { Sidebar, type UserInfo } from './Sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
  userInfo?: UserInfo
}

export function AdminLayout({ children, userInfo }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Sidebar userInfo={userInfo} />
      <main className="ml-[200px] min-h-screen">
        {children}
      </main>
    </div>
  )
}

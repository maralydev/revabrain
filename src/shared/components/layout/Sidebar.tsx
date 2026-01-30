'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { logout } from '@/modules/auth/actions'
import { CalendarIcon, UsersIcon, TeamIcon, SettingsIcon, DocumentIcon, ChevronRightIcon } from '../ui/Icons'

export interface UserInfo {
  naam: string
  email: string
  rol: string
  isAdmin: boolean
}

const mainNavItems = [
  { href: '/admin/agenda', label: 'Agenda', icon: CalendarIcon },
  { href: '/admin/patient', label: 'Patiënten', icon: UsersIcon },
  { href: '/admin/team', label: 'Team', icon: TeamIcon },
  { href: '/cms', label: 'Website CMS', icon: DocumentIcon },
]

const settingsSubItems = [
  { href: '/admin/settings/disciplines', label: 'Disciplines' },
  { href: '/admin/settings/afspraak-types', label: 'Afspraak types' },
  { href: '/admin/settings/behandelingen', label: 'Behandelingen' },
  { href: '/admin/settings/contact', label: 'Contact info' },
  { href: '/admin/settings/content', label: 'Pagina content' },
  { href: '/admin/audit-log', label: 'Audit log' },
]

interface SidebarProps {
  userInfo?: UserInfo
}

export function Sidebar({ userInfo }: SidebarProps) {
  const pathname = usePathname()
  const [settingsOpen, setSettingsOpen] = useState(
    pathname?.startsWith('/admin/settings') || pathname?.startsWith('/admin/audit-log') || false
  )
  const [loggingOut, setLoggingOut] = useState(false)

  const isSettingsActive = pathname?.startsWith('/admin/settings') || pathname?.startsWith('/admin/audit-log')

  const initials = userInfo?.naam
    ? userInfo.naam.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const rolLabel = userInfo?.rol === 'ZORGVERLENER' ? 'Zorgverlener' : userInfo?.rol === 'SECRETARIAAT' ? 'Secretariaat' : 'Gebruiker'

  async function handleLogout() {
    setLoggingOut(true)
    await logout()
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col shadow-2xl z-40">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-white/10">
        <Link href="/admin/agenda" className="flex items-center gap-2 group">
          <div className="relative">
            <Image
              src="/images/logo.png"
              alt="RevaBrain"
              width={36}
              height={36}
              className="rounded-lg transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div>
            <span className="text-white font-bold text-lg">Reva</span>
            <span className="text-[var(--rb-accent)] font-bold text-lg">Brain</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 relative overflow-hidden
                ${isActive
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--rb-accent)] rounded-r-full" />
              )}
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[var(--rb-accent)]' : 'group-hover:text-[var(--rb-accent)]'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}

        {/* Settings with sub-menu */}
        <div>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`
              w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
              transition-all duration-200 relative overflow-hidden
              ${isSettingsActive
                ? 'bg-white/10 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            {isSettingsActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--rb-accent)] rounded-r-full" />
            )}
            <SettingsIcon className={`w-5 h-5 transition-colors ${isSettingsActive ? 'text-[var(--rb-accent)]' : 'group-hover:text-[var(--rb-accent)]'}`} />
            <span className="flex-1 text-left">Instellingen</span>
            <ChevronRightIcon className={`w-4 h-4 transition-transform duration-200 ${settingsOpen ? 'rotate-90' : ''}`} />
          </button>

          {settingsOpen && (
            <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-0.5">
              {settingsSubItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      block px-3 py-2 rounded-lg text-xs font-medium transition-colors
                      ${isActive
                        ? 'text-[var(--rb-accent)] bg-white/5'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-accent)] flex items-center justify-center text-white text-xs font-bold shadow-lg flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userInfo?.naam || 'Gebruiker'}</p>
            <p className="text-xs text-slate-400">{userInfo?.isAdmin ? 'Admin' : rolLabel}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50"
        >
          {loggingOut ? (
            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          )}
          Uitloggen
        </button>
      </div>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { CalendarIcon, UsersIcon, TeamIcon, SettingsIcon, DocumentIcon } from '../ui/Icons'

const navItems = [
  { href: '/admin/agenda', label: 'Agenda', icon: CalendarIcon },
  { href: '/admin/patienten', label: 'Patiënten', icon: UsersIcon },
  { href: '/admin/team', label: 'Team', icon: TeamIcon },
  { href: '/cms', label: 'Website CMS', icon: DocumentIcon },
  { href: '/admin/instellingen', label: 'Instellingen', icon: SettingsIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col shadow-2xl">
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
            <div className="absolute inset-0 rounded-lg bg-[var(--rb-accent)] opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-40" />
          </div>
          <div>
            <span className="text-white font-bold text-lg">Reva</span>
            <span className="text-[var(--rb-accent)] font-bold text-lg">Brain</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
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
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--rb-accent)] rounded-r-full" />
              )}

              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[var(--rb-accent)]' : 'group-hover:text-[var(--rb-accent)]'}`} />
              <span>{item.label}</span>

              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--rb-accent)]/0 via-[var(--rb-accent)]/5 to-[var(--rb-accent)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-accent)] flex items-center justify-center text-white text-sm font-bold shadow-lg">
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Abdul Miya</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

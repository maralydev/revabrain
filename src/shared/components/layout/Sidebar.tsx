'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarIcon, UsersIcon, TeamIcon, SettingsIcon, DocumentIcon } from '../ui/Icons'

const navItems = [
  { href: '/admin/agenda', label: 'Agenda', icon: CalendarIcon },
  { href: '/admin/patienten', label: 'Patiënten', icon: UsersIcon },
  { href: '/admin/team', label: 'Team', icon: TeamIcon },
  { href: '/admin/settings/content', label: 'Website CMS', icon: DocumentIcon },
  { href: '/admin/instellingen', label: 'Instellingen', icon: SettingsIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="text-xl font-bold" style={{ color: 'var(--rb-primary)' }}>
          RevaBrain
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--rb-light)] text-[var(--rb-primary)] border-r-2 border-[var(--rb-primary)]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--rb-primary)] flex items-center justify-center text-white text-sm font-medium">
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Abdul Miya</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

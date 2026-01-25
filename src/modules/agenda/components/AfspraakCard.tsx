'use client'

import { Afspraak, STATUS_CONFIG } from '../types'

interface AfspraakCardProps {
  afspraak: Afspraak
  onClick?: () => void
}

export function AfspraakCard({ afspraak, onClick }: AfspraakCardProps) {
  const statusConfig = STATUS_CONFIG[afspraak.status]
  const isAdmin = afspraak.type === 'ADMIN'

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })
  }

  const endTime = new Date(afspraak.datum.getTime() + afspraak.duur * 60000)

  if (isAdmin) {
    return (
      <div
        onClick={onClick}
        className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-3 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span className="font-medium text-gray-600">
              {afspraak.adminTitel || 'Admin'}
            </span>
            <div className="text-sm text-gray-400 mt-0.5">
              {formatTime(afspraak.datum)} - {formatTime(endTime)}
            </div>
          </div>
          <div className="w-5 h-5 flex-shrink-0 text-gray-400">
            <LockIcon />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
      style={{ borderLeftWidth: '4px', borderLeftColor: statusConfig.color }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 truncate">
              {afspraak.patientNaam}
            </span>
            {afspraak.isHerhalend && (
              <span className="text-xs px-1.5 py-0.5 bg-[var(--rb-light)] text-[var(--rb-primary)] rounded">
                {afspraak.sessieNummer}/{afspraak.totaalSessies}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 mt-0.5">
            {formatTime(afspraak.datum)} - {formatTime(endTime)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {afspraak.type} - {afspraak.roc}
          </div>
        </div>
        <div
          className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
          style={{ backgroundColor: statusConfig.color }}
          title={statusConfig.label}
        />
      </div>
    </div>
  )
}

function LockIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

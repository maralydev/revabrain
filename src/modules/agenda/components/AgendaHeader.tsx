'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/components/ui/Icons'

export type AgendaView = 'DAG' | 'WEEK'

interface AgendaHeaderProps {
  currentDate: Date
  view: AgendaView
  onPrevDay: () => void
  onNextDay: () => void
  onToday: () => void
  onViewChange: (view: AgendaView) => void
  onNieuweAfspraak?: () => void
}

export function AgendaHeader({
  currentDate,
  view,
  onPrevDay,
  onNextDay,
  onToday,
  onViewChange,
  onNieuweAfspraak
}: AgendaHeaderProps) {
  const formatDate = (date: Date) => {
    if (view === 'WEEK') {
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 6)
      return `${date.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })}`
    }
    return date.toLocaleDateString('nl-BE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const isToday = () => {
    const today = new Date()
    return currentDate.toDateString() === today.toDateString()
  }

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-30">
      <div className="px-8 py-5 flex items-center justify-between">
        {/* Left: Date & Today button */}
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 capitalize">
              {formatDate(currentDate)}
            </h1>
          </div>

          {!isToday() && (
            <button
              onClick={onToday}
              className="px-4 py-2 text-sm font-medium text-[var(--rb-primary)] bg-[var(--rb-primary)]/10 rounded-full hover:bg-[var(--rb-primary)]/20 transition-all duration-200"
            >
              Vandaag
            </button>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => onViewChange('DAG')}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${view === 'DAG'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }
              `}
            >
              Dag
            </button>
            <button
              onClick={() => onViewChange('WEEK')}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${view === 'WEEK'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }
              `}
            >
              Week
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            <button
              onClick={onPrevDay}
              className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
              aria-label="Vorige"
            >
              <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={onNextDay}
              className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
              aria-label="Volgende"
            >
              <ChevronRightIcon className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* New appointment */}
          <button
            onClick={onNieuweAfspraak}
            className="
              flex items-center gap-2 px-5 py-2.5
              bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)]
              text-white text-sm font-semibold rounded-xl
              shadow-lg shadow-[var(--rb-primary)]/25
              hover:shadow-xl hover:shadow-[var(--rb-primary)]/30 hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-200
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nieuwe afspraak
          </button>
        </div>
      </div>
    </header>
  )
}

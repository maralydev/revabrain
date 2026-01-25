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
      // For week view, show week range
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

  const navLabel = view === 'DAG' ? 'dag' : 'week'

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-900 capitalize">
          {formatDate(currentDate)}
        </h1>
        {!isToday() && (
          <button
            onClick={onToday}
            className="text-sm text-[var(--rb-primary)] hover:underline"
          >
            Vandaag
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* View Toggle */}
        <div className="flex mr-4 border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => onViewChange('DAG')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              view === 'DAG'
                ? 'bg-[#2879D8] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Dag
          </button>
          <button
            onClick={() => onViewChange('WEEK')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              view === 'WEEK'
                ? 'bg-[#2879D8] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Week
          </button>
        </div>

        <button
          onClick={onPrevDay}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={`Vorige ${navLabel}`}
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={onNextDay}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={`Volgende ${navLabel}`}
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={onNieuweAfspraak}
          className="ml-4 px-4 py-2 bg-[var(--rb-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--rb-primary-dark)] transition-colors"
        >
          + Nieuwe afspraak
        </button>
      </div>
    </header>
  )
}

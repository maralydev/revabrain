'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/components/ui/Icons'

interface AgendaHeaderProps {
  currentDate: Date
  onPrevDay: () => void
  onNextDay: () => void
  onToday: () => void
  onNieuweAfspraak?: () => void
}

export function AgendaHeader({
  currentDate,
  onPrevDay,
  onNextDay,
  onToday,
  onNieuweAfspraak
}: AgendaHeaderProps) {
  const formatDate = (date: Date) => {
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
        <button
          onClick={onPrevDay}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Vorige dag"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={onNextDay}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Volgende dag"
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

'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  AgendaHeader,
  DagView,
  WeekView,
  useAgendaDatum,
  useAfspraken,
  useZorgverleners,
  type Afspraak,
  type AgendaView,
} from '@/modules/agenda'
import { getAfsprakenByWeek } from '@/modules/afspraak/queries'

export default function AgendaPage() {
  const router = useRouter()
  const [view, setView] = useState<AgendaView>('DAG')
  const [weekAfspraken, setWeekAfspraken] = useState<Afspraak[]>([])
  const [weekLoading, setWeekLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const {
    currentDate,
    gaNaarVorigeDag,
    gaNaarVolgendeDag,
    gaNaarVandaag,
  } = useAgendaDatum()

  const { afspraken: dagAfspraken, isLoading: dagLoading, refetch: refetchDag } = useAfspraken(currentDate)
  const { zorgverleners } = useZorgverleners()

  // Refresh function
  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1)
    if (view === 'DAG') {
      refetchDag?.()
    }
  }, [view, refetchDag])

  // Load week data when in week view
  useEffect(() => {
    if (view !== 'WEEK') return

    async function loadWeekAfspraken() {
      try {
        setWeekLoading(true)
        const startOfWeek = new Date(currentDate)
        startOfWeek.setHours(0, 0, 0, 0)
        // Adjust to Monday (start of week)
        const dayOfWeek = startOfWeek.getDay()
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
        startOfWeek.setDate(startOfWeek.getDate() + diff)

        const data = await getAfsprakenByWeek(startOfWeek)

        // Transform to Afspraak type
        const transformed: Afspraak[] = data.map((a: any) => ({
          id: a.id,
          datum: new Date(a.datum),
          duur: a.duur,
          type: a.type,
          status: a.status,
          patientNaam: a.patient ? `${a.patient.voornaam} ${a.patient.achternaam}` : undefined,
          patientId: a.patientId || undefined,
          zorgverlenerNaam: `${a.zorgverlener.voornaam} ${a.zorgverlener.achternaam}`,
          zorgverlenerId: a.zorgverlenerId,
        }))

        setWeekAfspraken(transformed)
      } catch (err) {
        console.error('Error loading week afspraken:', err)
      } finally {
        setWeekLoading(false)
      }
    }

    loadWeekAfspraken()
  }, [view, currentDate, refreshKey])

  const handleNavigation = useCallback((direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      gaNaarVandaag()
    } else if (view === 'DAG') {
      direction === 'prev' ? gaNaarVorigeDag() : gaNaarVolgendeDag()
    } else {
      // Week view: move by 7 days
      if (direction === 'prev') {
        for (let i = 0; i < 7; i++) gaNaarVorigeDag()
      } else {
        for (let i = 0; i < 7; i++) gaNaarVolgendeDag()
      }
    }
  }, [view, gaNaarVorigeDag, gaNaarVolgendeDag, gaNaarVandaag])

  const handleNieuweAfspraak = () => {
    router.push('/admin/afspraak/nieuw')
  }

  const handleAfspraakClick = (afspraak: Afspraak) => {
    router.push(`/admin/afspraak/${afspraak.id}/edit`)
  }

  const getStartOfWeek = (date: Date) => {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const dayOfWeek = start.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    start.setDate(start.getDate() + diff)
    return start
  }

  return (
    <div className="h-screen flex flex-col">
      <AgendaHeader
        currentDate={view === 'WEEK' ? getStartOfWeek(currentDate) : currentDate}
        view={view}
        onPrevDay={() => handleNavigation('prev')}
        onNextDay={() => handleNavigation('next')}
        onToday={() => handleNavigation('today')}
        onViewChange={setView}
        onNieuweAfspraak={handleNieuweAfspraak}
      />
      {view === 'DAG' ? (
        <DagView
          datum={currentDate}
          zorgverleners={zorgverleners}
          afspraken={dagAfspraken}
          onAfspraakClick={handleAfspraakClick}
          onRefresh={handleRefresh}
        />
      ) : (
        <WeekView
          startDatum={getStartOfWeek(currentDate)}
          zorgverleners={zorgverleners}
          afspraken={weekAfspraken}
          onAfspraakClick={handleAfspraakClick}
        />
      )}
    </div>
  )
}

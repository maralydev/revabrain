'use client'

import {
  AgendaHeader,
  DagView,
  useAgendaDatum,
  useAfspraken,
  useZorgverleners,
} from '@/modules/agenda'

export default function AgendaPage() {
  const {
    currentDate,
    gaNaarVorigeDag,
    gaNaarVolgendeDag,
    gaNaarVandaag,
  } = useAgendaDatum()

  const { afspraken } = useAfspraken(currentDate)
  const { zorgverleners } = useZorgverleners()

  const handleNieuweAfspraak = () => {
    // TODO: Open modal
    console.log('Nieuwe afspraak')
  }

  return (
    <div className="h-screen flex flex-col">
      <AgendaHeader
        currentDate={currentDate}
        onPrevDay={gaNaarVorigeDag}
        onNextDay={gaNaarVolgendeDag}
        onToday={gaNaarVandaag}
        onNieuweAfspraak={handleNieuweAfspraak}
      />
      <DagView
        datum={currentDate}
        zorgverleners={zorgverleners}
        afspraken={afspraken}
      />
    </div>
  )
}

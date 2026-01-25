'use client'

import { Afspraak, Zorgverlener } from '../types'
import { AfspraakCard } from './AfspraakCard'

interface WeekViewProps {
  startDatum: Date
  zorgverleners: Zorgverlener[]
  afspraken: Afspraak[]
  onAfspraakClick?: (afspraak: Afspraak) => void
}

const UREN = Array.from({ length: 12 }, (_, i) => i + 8) // 8:00 - 19:00

export function WeekView({ startDatum, zorgverleners, afspraken, onAfspraakClick }: WeekViewProps) {
  // Generate 7 days starting from startDatum
  const dagen = Array.from({ length: 7 }, (_, i) => {
    const dag = new Date(startDatum)
    dag.setDate(dag.getDate() + i)
    return dag
  })

  const getAfsprakenVoorDagEnUur = (datum: Date, uur: number) => {
    const dagStart = new Date(datum)
    dagStart.setHours(0, 0, 0, 0)
    const dagEind = new Date(datum)
    dagEind.setHours(23, 59, 59, 999)

    return afspraken.filter(a => {
      const afspraakDatum = new Date(a.datum)
      const afspraakUur = afspraakDatum.getHours()
      const inDag = afspraakDatum >= dagStart && afspraakDatum <= dagEind
      return inDag && afspraakUur === uur
    })
  }

  const formatDagHeader = (datum: Date) => {
    return datum.toLocaleDateString('nl-BE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  }

  const isVandaag = (datum: Date) => {
    const today = new Date()
    return datum.toDateString() === today.toDateString()
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[1000px]">
        {/* Header met dagen */}
        <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="w-20 flex-shrink-0 p-3 border-r border-gray-200" />
          {dagen.map(dag => (
            <div
              key={dag.toISOString()}
              className={`flex-1 p-3 border-r border-gray-200 min-w-[140px] ${
                isVandaag(dag) ? 'bg-blue-50' : ''
              }`}
            >
              <div className="text-center">
                <div className={`font-medium ${isVandaag(dag) ? 'text-[#2879D8]' : 'text-gray-900'}`}>
                  {formatDagHeader(dag)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tijdslots */}
        {UREN.map(uur => (
          <div key={uur} className="flex border-b border-gray-100">
            <div className="w-20 flex-shrink-0 p-2 text-sm text-gray-500 text-right pr-4 border-r border-gray-200">
              {uur}:00
            </div>
            {dagen.map(dag => {
              const afsprakenInSlot = getAfsprakenVoorDagEnUur(dag, uur)
              return (
                <div
                  key={dag.toISOString()}
                  className={`flex-1 min-w-[140px] min-h-[60px] p-1 border-r border-gray-100 hover:bg-gray-50 transition-colors ${
                    isVandaag(dag) ? 'bg-blue-50/30' : 'bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    {afsprakenInSlot.map(a => (
                      <AfspraakCard
                        key={a.id}
                        afspraak={a}
                        onClick={() => onAfspraakClick?.(a)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

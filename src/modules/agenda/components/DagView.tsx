'use client'

import { Afspraak, Zorgverlener } from '../types'
import { AfspraakCard } from './AfspraakCard'

interface DagViewProps {
  datum: Date
  zorgverleners: Zorgverlener[]
  afspraken: Afspraak[]
  onAfspraakClick?: (afspraak: Afspraak) => void
}

const UREN = Array.from({ length: 12 }, (_, i) => i + 8) // 8:00 - 19:00

export function DagView({ datum, zorgverleners, afspraken, onAfspraakClick }: DagViewProps) {
  const getAfsprakenVoorUur = (zorgverlenerId: number, uur: number) => {
    return afspraken.filter(a => {
      const afspraakUur = a.datum.getHours()
      return a.zorgverlenerId === zorgverlenerId && afspraakUur === uur
    })
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[800px]">
        {/* Header met zorgverleners */}
        <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="w-20 flex-shrink-0 p-3 border-r border-gray-200" />
          {zorgverleners.map(zv => (
            <div
              key={zv.id}
              className="flex-1 p-3 border-r border-gray-200 min-w-[200px]"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: zv.kleur }}
                />
                <span className="font-medium text-gray-900">
                  {zv.voornaam} {zv.achternaam}
                </span>
              </div>
              <span className="text-xs text-gray-500">{zv.discipline}</span>
            </div>
          ))}
        </div>

        {/* Tijdslots */}
        {UREN.map(uur => (
          <div key={uur} className="flex border-b border-gray-100">
            <div className="w-20 flex-shrink-0 p-2 text-sm text-gray-500 text-right pr-4 border-r border-gray-200">
              {uur}:00
            </div>
            {zorgverleners.map(zv => {
              const afsprakenInUur = getAfsprakenVoorUur(zv.id, uur)
              return (
                <div
                  key={zv.id}
                  className="flex-1 min-w-[200px] min-h-[80px] p-1 border-r border-gray-100 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    {afsprakenInUur.map(a => (
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

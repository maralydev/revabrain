'use client'

import { useState } from 'react'
import { Afspraak, Zorgverlener } from '../types'
import { AfspraakCard } from './AfspraakCard'
import { QuickAfspraakModal } from './QuickAfspraakModal'

interface DagViewProps {
  datum: Date
  zorgverleners: Zorgverlener[]
  afspraken: Afspraak[]
  onAfspraakClick?: (afspraak: Afspraak) => void
  onRefresh?: () => void
}

const UREN = Array.from({ length: 12 }, (_, i) => i + 8) // 8:00 - 19:00

export function DagView({ datum, zorgverleners, afspraken, onAfspraakClick, onRefresh }: DagViewProps) {
  const [quickModal, setQuickModal] = useState<{
    isOpen: boolean
    datum: Date
    zorgverlenerId: number
    zorgverlenerNaam: string
  } | null>(null)

  const getAfsprakenVoorUur = (zorgverlenerId: number, uur: number) => {
    return afspraken.filter(a => {
      const afspraakUur = a.datum.getHours()
      return a.zorgverlenerId === zorgverlenerId && afspraakUur === uur
    })
  }

  const handleSlotClick = (zorgverlener: Zorgverlener, uur: number) => {
    // Create date for this timeslot
    const slotDatum = new Date(datum)
    slotDatum.setHours(uur, 0, 0, 0)

    setQuickModal({
      isOpen: true,
      datum: slotDatum,
      zorgverlenerId: zorgverlener.id,
      zorgverlenerNaam: `${zorgverlener.voornaam} ${zorgverlener.achternaam}`,
    })
  }

  const handleModalClose = () => {
    setQuickModal(null)
  }

  const handleModalSuccess = () => {
    setQuickModal(null)
    onRefresh?.()
  }

  return (
    <>
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
                const hasAfspraken = afsprakenInUur.length > 0

                return (
                  <div
                    key={zv.id}
                    onClick={() => !hasAfspraken && handleSlotClick(zv, uur)}
                    className={`
                      flex-1 min-w-[200px] min-h-[80px] p-1 border-r border-gray-100 bg-white
                      transition-colors relative group
                      ${!hasAfspraken ? 'cursor-pointer hover:bg-[var(--rb-light)]/50' : ''}
                    `}
                  >
                    {/* Add button overlay for empty slots */}
                    {!hasAfspraken && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1 text-[var(--rb-primary)] text-sm font-medium">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Afspraak</span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      {afsprakenInUur.map(a => (
                        <AfspraakCard
                          key={a.id}
                          afspraak={a}
                          onClick={() => onAfspraakClick?.(a)}
                          onStatusChange={onRefresh}
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

      {/* Quick Afspraak Modal */}
      {quickModal && (
        <QuickAfspraakModal
          isOpen={quickModal.isOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          datum={quickModal.datum}
          zorgverlenerId={quickModal.zorgverlenerId}
          zorgverlenerNaam={quickModal.zorgverlenerNaam}
        />
      )}
    </>
  )
}

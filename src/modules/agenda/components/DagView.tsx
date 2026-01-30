'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Afspraak, Zorgverlener } from '../types'
import { QuickAfspraakModal } from './QuickAfspraakModal'
import { DagViewAfspraak } from './DagViewAfspraak'
import { updateAfspraak } from '@/modules/afspraak/actions'

interface DagViewProps {
  datum: Date
  zorgverleners: Zorgverlener[]
  afspraken: Afspraak[]
  onAfspraakClick?: (afspraak: Afspraak) => void
  onRefresh?: () => void
}

// Configuration
const START_HOUR = 8
const END_HOUR = 19
const SLOT_MINUTES = 15
const PIXELS_PER_SLOT = 20
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * (60 / SLOT_MINUTES)
const MIN_DURATION_SLOTS = 2

type DragMode = 'move' | 'resize'

interface DragState {
  afspraak: Afspraak
  mode: DragMode
  startY: number
  startSlot: number
  originalSlot: number
  originalDuurSlots: number
  zorgverlenerId: number
}

interface DropPreview {
  slot: number
  duurSlots: number
  zorgverlenerId: number
}

export function DagView({ datum, zorgverleners, afspraken, onAfspraakClick, onRefresh }: DagViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [dropPreview, setDropPreview] = useState<DropPreview | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [hoverSlot, setHoverSlot] = useState<{ slot: number; zorgverlenerId: number } | null>(null)

  const [quickModal, setQuickModal] = useState<{
    isOpen: boolean
    datum: Date
    zorgverlenerId: number
    zorgverlenerNaam: string
  } | null>(null)

  const timeToSlot = useCallback((date: Date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return ((hours - START_HOUR) * 60 + minutes) / SLOT_MINUTES
  }, [])

  const slotToTime = useCallback((slot: number, baseDate: Date) => {
    const totalMinutes = slot * SLOT_MINUTES
    const hours = START_HOUR + Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const date = new Date(baseDate)
    date.setHours(hours, minutes, 0, 0)
    return date
  }, [])

  const slotToTimeString = (slot: number) => {
    const totalMinutes = slot * SLOT_MINUTES
    const hours = START_HOUR + Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const getAfsprakenVoorZorgverlener = useCallback((zorgverlenerId: number) => {
    return afspraken.filter(a => a.zorgverlenerId === zorgverlenerId)
  }, [afspraken])

  const getAfspraakStyle = useCallback((afspraak: Afspraak) => {
    const startSlot = timeToSlot(afspraak.datum)
    const duurSlots = afspraak.duur / SLOT_MINUTES
    return {
      top: startSlot * PIXELS_PER_SLOT,
      height: duurSlots * PIXELS_PER_SLOT - 2,
      startSlot,
      duurSlots,
    }
  }, [timeToSlot])

  const handleDragStart = useCallback((e: React.MouseEvent, afspraak: Afspraak) => {
    e.preventDefault()
    e.stopPropagation()

    const startSlot = timeToSlot(afspraak.datum)
    const duurSlots = afspraak.duur / SLOT_MINUTES

    setDragState({
      afspraak,
      mode: 'move',
      startY: e.clientY,
      startSlot,
      originalSlot: startSlot,
      originalDuurSlots: duurSlots,
      zorgverlenerId: afspraak.zorgverlenerId,
    })
    setDropPreview({
      slot: startSlot,
      duurSlots,
      zorgverlenerId: afspraak.zorgverlenerId,
    })
  }, [timeToSlot])

  const handleResizeStart = useCallback((e: React.MouseEvent, afspraak: Afspraak) => {
    e.preventDefault()
    e.stopPropagation()

    const startSlot = timeToSlot(afspraak.datum)
    const duurSlots = afspraak.duur / SLOT_MINUTES

    setDragState({
      afspraak,
      mode: 'resize',
      startY: e.clientY,
      startSlot,
      originalSlot: startSlot,
      originalDuurSlots: duurSlots,
      zorgverlenerId: afspraak.zorgverlenerId,
    })
    setDropPreview({
      slot: startSlot,
      duurSlots,
      zorgverlenerId: afspraak.zorgverlenerId,
    })
  }, [timeToSlot])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState || !containerRef.current) return

    const deltaY = e.clientY - dragState.startY
    const deltaSlots = Math.round(deltaY / PIXELS_PER_SLOT)

    if (dragState.mode === 'move') {
      let newSlot = dragState.originalSlot + deltaSlots
      newSlot = Math.max(0, Math.min(newSlot, TOTAL_SLOTS - dragState.originalDuurSlots))

      const columns = containerRef.current.querySelectorAll('[data-zorgverlener-id]')
      let newZorgverlenerId = dragState.zorgverlenerId

      columns.forEach((col) => {
        const rect = col.getBoundingClientRect()
        if (e.clientX >= rect.left && e.clientX <= rect.right) {
          newZorgverlenerId = parseInt(col.getAttribute('data-zorgverlener-id') || '0')
        }
      })

      setDropPreview({
        slot: newSlot,
        duurSlots: dragState.originalDuurSlots,
        zorgverlenerId: newZorgverlenerId,
      })
    } else {
      let newDuurSlots = dragState.originalDuurSlots + deltaSlots
      newDuurSlots = Math.max(MIN_DURATION_SLOTS, newDuurSlots)
      const maxDuurSlots = TOTAL_SLOTS - dragState.originalSlot
      newDuurSlots = Math.min(newDuurSlots, maxDuurSlots)

      setDropPreview({
        slot: dragState.originalSlot,
        duurSlots: newDuurSlots,
        zorgverlenerId: dragState.zorgverlenerId,
      })
    }
  }, [dragState])

  const handleMouseUp = useCallback(async () => {
    if (!dragState || !dropPreview) {
      setDragState(null)
      setDropPreview(null)
      return
    }

    const slotChanged = dropPreview.slot !== dragState.originalSlot
    const duurChanged = dropPreview.duurSlots !== dragState.originalDuurSlots
    const zorgverlenerChanged = dropPreview.zorgverlenerId !== dragState.zorgverlenerId

    if (slotChanged || duurChanged || zorgverlenerChanged) {
      setIsUpdating(true)
      try {
        const newDatum = slotToTime(dropPreview.slot, datum)
        const newDuur = dropPreview.duurSlots * SLOT_MINUTES

        const result = await updateAfspraak({
          afspraakId: dragState.afspraak.id,
          datum: newDatum,
          duur: newDuur as 30 | 45 | 60 | 90,
        })

        if (result.success) {
          onRefresh?.()
        }
      } catch (err) {
        console.error('Drag update failed:', err)
      } finally {
        setIsUpdating(false)
      }
    }

    setDragState(null)
    setDropPreview(null)
  }, [dragState, dropPreview, datum, slotToTime, onRefresh])

  useEffect(() => {
    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = dragState.mode === 'move' ? 'grabbing' : 'ns-resize'
      document.body.style.userSelect = 'none'

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [dragState, handleMouseMove, handleMouseUp])

  const handleGridMouseMove = useCallback((e: React.MouseEvent, zorgverlenerId: number) => {
    if (dragState) return

    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const y = e.clientY - rect.top
    const slot = Math.floor(y / PIXELS_PER_SLOT)

    setHoverSlot({ slot, zorgverlenerId })
  }, [dragState])

  const handleSlotClick = useCallback((e: React.MouseEvent, zorgverlener: Zorgverlener) => {
    if (dragState) return
    if ((e.target as HTMLElement).closest('[data-afspraak]')) return

    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const slot = Math.floor(clickY / PIXELS_PER_SLOT)
    const clickTime = slotToTime(slot, datum)

    setQuickModal({
      isOpen: true,
      datum: clickTime,
      zorgverlenerId: zorgverlener.id,
      zorgverlenerNaam: `${zorgverlener.voornaam} ${zorgverlener.achternaam}`,
    })
  }, [dragState, datum, slotToTime])

  const timeLabels = []
  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    timeLabels.push(
      <div
        key={hour}
        className="h-[80px] text-xs font-medium text-gray-400 text-right pr-3 flex items-start pt-2"
      >
        {hour}:00
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 overflow-auto bg-gray-50" ref={containerRef}>
        <div className="min-w-[800px] p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex border-b border-gray-200 bg-white sticky top-0 z-20">
              <div className="w-20 flex-shrink-0 p-4 border-r border-gray-100" />
              {zorgverleners.map(zv => (
                <div
                  key={zv.id}
                  className="flex-1 p-4 border-r border-gray-100 min-w-[220px] last:border-r-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm"
                      style={{ backgroundColor: zv.kleur || '#3b82f6' }}
                    >
                      {zv.voornaam.charAt(0)}{zv.achternaam.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-gray-800 block truncate">
                        {zv.voornaam} {zv.achternaam}
                      </span>
                      <span className="text-xs text-gray-500">{zv.discipline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Time grid */}
            <div className="flex">
              {/* Time column */}
              <div className="w-20 flex-shrink-0 border-r border-gray-100 bg-gray-50">
                {timeLabels}
              </div>

              {/* Zorgverlener columns */}
              {zorgverleners.map(zv => {
                const zvAfspraken = getAfsprakenVoorZorgverlener(zv.id)

                return (
                  <div
                    key={zv.id}
                    data-zorgverlener-id={zv.id}
                    className="flex-1 min-w-[220px] border-r border-gray-100 last:border-r-0 relative bg-white cursor-pointer"
                    style={{ height: TOTAL_SLOTS * PIXELS_PER_SLOT }}
                    onClick={(e) => handleSlotClick(e, zv)}
                    onMouseMove={(e) => handleGridMouseMove(e, zv.id)}
                    onMouseLeave={() => setHoverSlot(null)}
                  >
                    {/* Hour lines */}
                    {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute left-0 right-0 border-b border-gray-100"
                        style={{ top: i * 4 * PIXELS_PER_SLOT }}
                      />
                    ))}

                    {/* Half hour lines */}
                    {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
                      <div
                        key={`half-${i}`}
                        className="absolute left-0 right-0 border-b border-dashed border-gray-50"
                        style={{ top: (i * 4 + 2) * PIXELS_PER_SLOT }}
                      />
                    ))}

                    {/* Hover indicator */}
                    {hoverSlot && hoverSlot.zorgverlenerId === zv.id && !dragState && (
                      <div
                        className="absolute left-2 right-2 h-[38px] bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg pointer-events-none flex items-center justify-center"
                        style={{ top: hoverSlot.slot * PIXELS_PER_SLOT }}
                      >
                        <span className="text-xs font-medium text-blue-600">
                          + {slotToTimeString(hoverSlot.slot)}
                        </span>
                      </div>
                    )}

                    {/* Drop preview */}
                    {dropPreview && dropPreview.zorgverlenerId === zv.id && dragState && (
                      <div
                        className="absolute left-2 right-2 bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg z-30 pointer-events-none flex items-center justify-center"
                        style={{
                          top: dropPreview.slot * PIXELS_PER_SLOT,
                          height: dropPreview.duurSlots * PIXELS_PER_SLOT - 2,
                        }}
                      >
                        <span className="text-xs font-medium text-blue-700">
                          {slotToTimeString(dropPreview.slot)} - {slotToTimeString(dropPreview.slot + dropPreview.duurSlots)}
                        </span>
                      </div>
                    )}

                    {/* Afspraken */}
                    {zvAfspraken.map(afspraak => {
                      const style = getAfspraakStyle(afspraak)
                      const isDragging = dragState?.afspraak.id === afspraak.id

                      return (
                        <DagViewAfspraak
                          key={afspraak.id}
                          afspraak={afspraak}
                          style={style}
                          isDragging={isDragging}
                          onDragStart={(e) => handleDragStart(e, afspraak)}
                          onResizeStart={(e) => handleResizeStart(e, afspraak)}
                          onClick={() => onAfspraakClick?.(afspraak)}
                          onStatusChange={() => onRefresh?.()}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isUpdating && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl px-6 py-4 shadow-xl flex items-center gap-4">
            <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-700 font-medium">
              {dragState?.mode === 'resize' ? 'Duur aanpassen...' : 'Afspraak verplaatsen...'}
            </span>
          </div>
        </div>
      )}

      {/* Quick Afspraak Modal */}
      {quickModal && (
        <QuickAfspraakModal
          isOpen={quickModal.isOpen}
          onClose={() => setQuickModal(null)}
          onSuccess={() => {
            setQuickModal(null)
            onRefresh?.()
          }}
          datum={quickModal.datum}
          zorgverlenerId={quickModal.zorgverlenerId}
          zorgverlenerNaam={quickModal.zorgverlenerNaam}
        />
      )}
    </>
  )
}

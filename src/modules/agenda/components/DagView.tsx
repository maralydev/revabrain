'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Afspraak, Zorgverlener, STATUS_CONFIG } from '../types'
import { QuickAfspraakModal } from './QuickAfspraakModal'
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
const SLOT_MINUTES = 15 // 15-minute slots for precision
const PIXELS_PER_SLOT = 20 // Height of each 15-min slot
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * (60 / SLOT_MINUTES)
const MIN_DURATION_SLOTS = 2 // Minimum 30 minutes

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

  // Convert time to slot index
  const timeToSlot = useCallback((date: Date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return ((hours - START_HOUR) * 60 + minutes) / SLOT_MINUTES
  }, [])

  // Convert slot index to time
  const slotToTime = useCallback((slot: number, baseDate: Date) => {
    const totalMinutes = slot * SLOT_MINUTES
    const hours = START_HOUR + Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const date = new Date(baseDate)
    date.setHours(hours, minutes, 0, 0)
    return date
  }, [])

  // Format time display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })
  }

  // Format slot to time string
  const slotToTimeString = (slot: number) => {
    const totalMinutes = slot * SLOT_MINUTES
    const hours = START_HOUR + Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  // Get afspraken for a zorgverlener
  const getAfsprakenVoorZorgverlener = useCallback((zorgverlenerId: number) => {
    return afspraken.filter(a => a.zorgverlenerId === zorgverlenerId)
  }, [afspraken])

  // Calculate position and height for an afspraak
  const getAfspraakStyle = useCallback((afspraak: Afspraak) => {
    const startSlot = timeToSlot(afspraak.datum)
    const duurSlots = afspraak.duur / SLOT_MINUTES
    return {
      top: startSlot * PIXELS_PER_SLOT,
      height: duurSlots * PIXELS_PER_SLOT - 2, // -2 for gap
      startSlot,
      duurSlots,
    }
  }, [timeToSlot])

  // Handle drag start (move)
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

  // Handle resize start
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

  // Handle drag/resize move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState || !containerRef.current) return

    const deltaY = e.clientY - dragState.startY
    const deltaSlots = Math.round(deltaY / PIXELS_PER_SLOT)

    if (dragState.mode === 'move') {
      // Moving: change start slot
      let newSlot = dragState.originalSlot + deltaSlots
      newSlot = Math.max(0, Math.min(newSlot, TOTAL_SLOTS - dragState.originalDuurSlots))

      // Find which zorgverlener column we're over
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
      // Resizing: change duration
      let newDuurSlots = dragState.originalDuurSlots + deltaSlots
      newDuurSlots = Math.max(MIN_DURATION_SLOTS, newDuurSlots)

      // Don't exceed end of day
      const maxDuurSlots = TOTAL_SLOTS - dragState.originalSlot
      newDuurSlots = Math.min(newDuurSlots, maxDuurSlots)

      setDropPreview({
        slot: dragState.originalSlot,
        duurSlots: newDuurSlots,
        zorgverlenerId: dragState.zorgverlenerId,
      })
    }
  }, [dragState])

  // Handle drag/resize end
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
          duur: newDuur as 30 | 45 | 60 | 90, // Cast - backend accepts any valid duration
        })

        if (result.success) {
          onRefresh?.()
        } else {
          console.error('Update failed:', result.error)
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

  // Set up global mouse listeners for dragging
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

  // Handle mouse move over grid for hover effect
  const handleGridMouseMove = useCallback((e: React.MouseEvent, zorgverlenerId: number) => {
    if (dragState) return

    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const y = e.clientY - rect.top
    const slot = Math.floor(y / PIXELS_PER_SLOT)

    setHoverSlot({ slot, zorgverlenerId })
  }, [dragState])

  // Handle click on empty slot
  const handleSlotClick = useCallback((e: React.MouseEvent, zorgverlener: Zorgverlener) => {
    if (dragState) return

    // Check if clicking on an afspraak
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

  // Generate time labels
  const timeLabels = []
  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    timeLabels.push(
      <div
        key={hour}
        className="h-[80px] text-xs text-gray-500 text-right pr-2 border-b border-gray-100 flex items-start pt-1"
      >
        {hour}:00
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 overflow-auto bg-gray-50" ref={containerRef}>
        <div className="min-w-[800px]">
          {/* Header with zorgverleners */}
          <div className="flex border-b border-gray-200 bg-white sticky top-0 z-20">
            <div className="w-16 flex-shrink-0 p-3 border-r border-gray-200" />
            {zorgverleners.map(zv => (
              <div
                key={zv.id}
                className="flex-1 p-3 border-r border-gray-200 min-w-[200px]"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: zv.kleur }}
                  />
                  <span className="font-medium text-gray-900 truncate">
                    {zv.voornaam} {zv.achternaam}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{zv.discipline}</span>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="flex">
            {/* Time column */}
            <div className="w-16 flex-shrink-0 border-r border-gray-200 bg-white">
              {timeLabels}
            </div>

            {/* Zorgverlener columns */}
            {zorgverleners.map(zv => {
              const zvAfspraken = getAfsprakenVoorZorgverlener(zv.id)

              return (
                <div
                  key={zv.id}
                  data-zorgverlener-id={zv.id}
                  className="flex-1 min-w-[200px] border-r border-gray-100 relative bg-white cursor-pointer"
                  style={{ height: TOTAL_SLOTS * PIXELS_PER_SLOT }}
                  onClick={(e) => handleSlotClick(e, zv)}
                  onMouseMove={(e) => handleGridMouseMove(e, zv.id)}
                  onMouseLeave={() => setHoverSlot(null)}
                >
                  {/* Hour lines */}
                  {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 border-b border-gray-200"
                      style={{ top: i * 4 * PIXELS_PER_SLOT }}
                    />
                  ))}

                  {/* Half hour lines */}
                  {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
                    <div
                      key={`half-${i}`}
                      className="absolute left-0 right-0 border-b border-dashed border-gray-100"
                      style={{ top: (i * 4 + 2) * PIXELS_PER_SLOT }}
                    />
                  ))}

                  {/* Hover indicator */}
                  {hoverSlot && hoverSlot.zorgverlenerId === zv.id && !dragState && (
                    <div
                      className="absolute left-1 right-1 h-[38px] bg-[var(--rb-light)]/50 border-2 border-dashed border-[var(--rb-primary)]/30 rounded-lg pointer-events-none flex items-center justify-center"
                      style={{ top: hoverSlot.slot * PIXELS_PER_SLOT }}
                    >
                      <span className="text-xs text-[var(--rb-primary)] font-medium">
                        + {slotToTimeString(hoverSlot.slot)}
                      </span>
                    </div>
                  )}

                  {/* Drop preview */}
                  {dropPreview && dropPreview.zorgverlenerId === zv.id && dragState && (
                    <div
                      className="absolute left-1 right-1 bg-[var(--rb-primary)]/20 border-2 border-dashed border-[var(--rb-primary)] rounded-lg z-30 pointer-events-none flex flex-col items-center justify-center"
                      style={{
                        top: dropPreview.slot * PIXELS_PER_SLOT,
                        height: dropPreview.duurSlots * PIXELS_PER_SLOT - 2,
                      }}
                    >
                      <span className="text-xs font-medium text-[var(--rb-primary)]">
                        {slotToTimeString(dropPreview.slot)} - {slotToTimeString(dropPreview.slot + dropPreview.duurSlots)}
                      </span>
                      <span className="text-xs text-[var(--rb-primary)]/70">
                        {dropPreview.duurSlots * SLOT_MINUTES} min
                      </span>
                    </div>
                  )}

                  {/* Afspraken */}
                  {zvAfspraken.map(afspraak => {
                    const style = getAfspraakStyle(afspraak)
                    const isDragging = dragState?.afspraak.id === afspraak.id
                    const statusConfig = STATUS_CONFIG[afspraak.status]
                    const isCancelled = afspraak.status === 'GEANNULEERD'

                    return (
                      <div
                        key={afspraak.id}
                        data-afspraak
                        className={`
                          absolute left-1 right-1 rounded-lg overflow-hidden group
                          transition-all duration-200
                          ${isDragging ? 'opacity-30 z-0' : 'z-10'}
                          ${isCancelled ? 'opacity-50' : 'hover:shadow-lg hover:z-20'}
                        `}
                        style={{
                          top: style.top,
                          height: style.height,
                          backgroundColor: statusConfig.bgColor,
                          borderLeft: `4px solid ${statusConfig.color}`,
                        }}
                      >
                        {/* Main content area - drag to move */}
                        <div
                          className={`
                            p-2 h-full flex flex-col cursor-grab active:cursor-grabbing
                            ${isCancelled ? 'pointer-events-none' : ''}
                          `}
                          onMouseDown={(e) => !isCancelled && handleDragStart(e, afspraak)}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!dragState && !isCancelled) onAfspraakClick?.(afspraak)
                          }}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className={`font-medium text-sm text-gray-900 truncate ${isCancelled ? 'line-through' : ''}`}>
                              {afspraak.patientNaam}
                            </span>
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                              style={{ backgroundColor: statusConfig.color }}
                              title={statusConfig.label}
                            />
                          </div>
                          <div className={`text-xs text-gray-500 mt-0.5 ${isCancelled ? 'line-through' : ''}`}>
                            {formatTime(afspraak.datum)} - {formatTime(new Date(afspraak.datum.getTime() + afspraak.duur * 60000))}
                          </div>
                          {style.height > 60 && (
                            <div className={`text-xs text-gray-400 mt-1 ${isCancelled ? 'line-through' : ''}`}>
                              {afspraak.type} • {afspraak.duur} min
                            </div>
                          )}

                          {/* Drag hint */}
                          {style.height > 40 && !isCancelled && (
                            <div className="mt-auto flex justify-center opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                              <div className="flex gap-0.5">
                                <div className="w-1 h-1 rounded-full bg-gray-400" />
                                <div className="w-1 h-1 rounded-full bg-gray-400" />
                                <div className="w-1 h-1 rounded-full bg-gray-400" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Resize handle (bottom) */}
                        {!isCancelled && (
                          <div
                            className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            onMouseDown={(e) => handleResizeStart(e, afspraak)}
                          >
                            <div className="w-8 h-1 bg-gray-400/50 rounded-full" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isUpdating && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-700">
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

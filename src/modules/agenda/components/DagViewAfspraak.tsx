'use client'

import { useState, useRef, useEffect } from 'react'
import { Afspraak, AfspraakStatus, STATUS_CONFIG } from '../types'
import { updateAfspraakStatus, cancelAfspraak } from '@/modules/afspraak/actions'

interface DagViewAfspraakProps {
  afspraak: Afspraak
  style: { top: number; height: number }
  isDragging: boolean
  onDragStart: (e: React.MouseEvent) => void
  onResizeStart: (e: React.MouseEvent) => void
  onClick: () => void
  onStatusChange: () => void
}

// Status flow - typical progression
const STATUS_ORDER: AfspraakStatus[] = [
  'TE_BEVESTIGEN',
  'BEVESTIGD',
  'IN_WACHTZAAL',
  'BINNEN',
  'AFGEWERKT',
]

export function DagViewAfspraak({
  afspraak,
  style,
  isDragging,
  onDragStart,
  onResizeStart,
  onClick,
  onStatusChange,
}: DagViewAfspraakProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [flashColor, setFlashColor] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const statusConfig = STATUS_CONFIG[afspraak.status]
  const isCancelled = afspraak.status === 'GEANNULEERD'

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowStatusMenu(false)
        setShowCancelConfirm(false)
      }
    }
    if (showStatusMenu || showCancelConfirm) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showStatusMenu, showCancelConfirm])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })
  }

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!isCancelled) {
      setShowStatusMenu(!showStatusMenu)
      setShowCancelConfirm(false)
    }
  }

  const handleStatusChange = async (newStatus: AfspraakStatus) => {
    if (isUpdating) return

    setIsUpdating(true)
    setShowStatusMenu(false)

    // Flash animation
    const newConfig = STATUS_CONFIG[newStatus]
    setFlashColor(newConfig.color)

    try {
      const result = await updateAfspraakStatus(afspraak.id, newStatus)
      if (result.success) {
        onStatusChange()
      }
    } catch (err) {
      console.error('Status update failed:', err)
    } finally {
      setIsUpdating(false)
      setTimeout(() => setFlashColor(null), 500)
    }
  }

  const handleCancel = async () => {
    if (isUpdating) return

    setIsUpdating(true)
    setShowCancelConfirm(false)

    try {
      const result = await cancelAfspraak(afspraak.id)
      if (result.success) {
        onStatusChange()
      }
    } catch (err) {
      console.error('Cancel failed:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div
      ref={menuRef}
      data-afspraak
      className={`
        absolute left-1 right-1 rounded-lg overflow-visible group
        transition-all duration-200
        ${isDragging ? 'opacity-30 z-0' : 'z-10'}
        ${isCancelled ? 'opacity-50' : 'hover:shadow-lg hover:z-20'}
      `}
      style={{
        top: style.top,
        height: style.height,
        backgroundColor: flashColor ? `${flashColor}30` : statusConfig.bgColor,
        borderLeft: `4px solid ${flashColor || statusConfig.color}`,
        transition: flashColor ? 'background-color 0.3s, border-color 0.3s' : undefined,
      }}
    >
      {/* Loading overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/60 rounded-lg flex items-center justify-center z-30">
          <div className="w-4 h-4 border-2 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Main content area - drag to move */}
      <div
        className={`
          p-2 h-full flex flex-col cursor-grab active:cursor-grabbing
          ${isCancelled ? 'pointer-events-none' : ''}
        `}
        onMouseDown={(e) => {
          // Don't start drag if clicking on status button
          if ((e.target as HTMLElement).closest('[data-status-btn]')) return
          if (!isCancelled) onDragStart(e)
        }}
        onClick={(e) => {
          e.stopPropagation()
          // Don't navigate if clicking status button
          if ((e.target as HTMLElement).closest('[data-status-btn]')) return
          if (!showStatusMenu && !showCancelConfirm && !isCancelled) onClick()
        }}
      >
        <div className="flex items-start justify-between gap-1">
          <span className={`font-medium text-sm text-gray-900 truncate ${isCancelled ? 'line-through' : ''}`}>
            {afspraak.patientNaam}
          </span>

          {/* Status button */}
          <button
            data-status-btn
            onClick={handleStatusClick}
            disabled={isCancelled}
            className={`
              flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium
              transition-all duration-200 flex-shrink-0
              ${isCancelled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'hover:scale-105 cursor-pointer'
              }
            `}
            style={{
              backgroundColor: isCancelled ? undefined : `${statusConfig.color}20`,
              color: isCancelled ? undefined : statusConfig.color,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: statusConfig.color }}
            />
            {style.height > 50 && (
              <>
                <span className="hidden sm:inline">{statusConfig.label}</span>
                <ChevronIcon className="w-2.5 h-2.5" />
              </>
            )}
          </button>
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
          onMouseDown={(e) => {
            e.stopPropagation()
            onResizeStart(e)
          }}
        >
          <div className="w-8 h-1 bg-gray-400/50 rounded-full" />
        </div>
      )}

      {/* Status dropdown menu */}
      {showStatusMenu && !isCancelled && (
        <div
          className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[140px] animate-in fade-in slide-in-from-top-2 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {STATUS_ORDER.map((status) => {
            const config = STATUS_CONFIG[status]
            const isActive = status === afspraak.status
            return (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`
                  w-full px-3 py-2 flex items-center gap-2 text-sm text-left
                  transition-colors
                  ${isActive ? 'bg-gray-50' : 'hover:bg-gray-50'}
                `}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: config.color }}
                />
                <span className={isActive ? 'font-medium' : ''}>{config.label}</span>
                {isActive && <CheckIcon className="w-4 h-4 ml-auto text-[var(--rb-primary)]" />}
              </button>
            )
          })}

          <div className="border-t border-gray-100 my-1" />

          {/* No-show */}
          <button
            onClick={() => handleStatusChange('NO_SHOW')}
            className="w-full px-3 py-2 flex items-center gap-2 text-sm text-left hover:bg-red-50 text-red-600"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
            No-show
          </button>

          {/* Cancel */}
          <button
            onClick={() => {
              setShowStatusMenu(false)
              setShowCancelConfirm(true)
            }}
            className="w-full px-3 py-2 flex items-center gap-2 text-sm text-left hover:bg-gray-50 text-gray-500"
          >
            <TrashIcon className="w-4 h-4" />
            Annuleren
          </button>
        </div>
      )}

      {/* Cancel confirmation */}
      {showCancelConfirm && (
        <div
          className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-3 min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-sm text-gray-700 mb-3">Afspraak annuleren?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCancelConfirm(false)}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Nee
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Ja
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Icons
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  )
}

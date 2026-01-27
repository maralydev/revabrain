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
        absolute left-2 right-2 rounded-xl overflow-visible group
        transition-all duration-300 ease-out
        ${isDragging ? 'opacity-30 z-0 scale-95' : 'z-10'}
        ${isCancelled ? 'opacity-40' : 'hover:shadow-xl hover:shadow-slate-200/50 hover:z-20 hover:scale-[1.02]'}
      `}
      style={{
        top: style.top,
        height: style.height,
        backgroundColor: flashColor ? `${flashColor}15` : `${statusConfig.color}08`,
        borderLeft: `4px solid ${flashColor || statusConfig.color}`,
        boxShadow: !isCancelled && !isDragging ? `0 2px 8px ${statusConfig.color}15` : undefined,
        transition: flashColor ? 'all 0.3s ease-out' : undefined,
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 rounded-xl opacity-30 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${statusConfig.color}08 0%, transparent 100%)`
        }}
      />

      {/* Loading overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-30">
          <div className="w-5 h-5 border-2 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Main content area - drag to move */}
      <div
        className={`
          relative p-3 h-full flex flex-col cursor-grab active:cursor-grabbing
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
        <div className="flex items-start justify-between gap-2">
          <span className={`font-semibold text-sm text-slate-800 truncate ${isCancelled ? 'line-through text-slate-400' : ''}`}>
            {afspraak.patientNaam}
          </span>

          {/* Status button - modern pill style */}
          <button
            data-status-btn
            onClick={handleStatusClick}
            disabled={isCancelled}
            className={`
              flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold
              transition-all duration-200 flex-shrink-0 backdrop-blur-sm
              ${isCancelled
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'hover:scale-105 hover:shadow-sm cursor-pointer active:scale-95'
              }
            `}
            style={{
              backgroundColor: isCancelled ? undefined : `${statusConfig.color}18`,
              color: isCancelled ? undefined : statusConfig.color,
            }}
          >
            <span
              className="w-2 h-2 rounded-full ring-2 ring-white/50"
              style={{ backgroundColor: statusConfig.color }}
            />
            {style.height > 50 && (
              <>
                <span className="hidden sm:inline">{statusConfig.label}</span>
                <ChevronIcon className="w-2.5 h-2.5 opacity-60" />
              </>
            )}
          </button>
        </div>

        <div className={`text-xs text-slate-500 mt-1 font-medium ${isCancelled ? 'line-through text-slate-300' : ''}`}>
          {formatTime(afspraak.datum)} - {formatTime(new Date(afspraak.datum.getTime() + afspraak.duur * 60000))}
        </div>

        {style.height > 60 && (
          <div className={`text-xs text-slate-400 mt-1.5 flex items-center gap-2 ${isCancelled ? 'line-through text-slate-300' : ''}`}>
            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px]">{afspraak.type}</span>
            <span>{afspraak.duur} min</span>
          </div>
        )}

        {/* Drag hint - modern dots */}
        {style.height > 40 && !isCancelled && (
          <div className="mt-auto flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 pt-1">
            <div className="flex gap-1 px-3 py-1 bg-slate-100/80 rounded-full">
              <div className="w-1 h-1 rounded-full bg-slate-400" />
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="w-1 h-1 rounded-full bg-slate-400" />
            </div>
          </div>
        )}
      </div>

      {/* Resize handle (bottom) - improved */}
      {!isCancelled && (
        <div
          className="absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize bg-gradient-to-t from-slate-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center rounded-b-xl"
          onMouseDown={(e) => {
            e.stopPropagation()
            onResizeStart(e)
          }}
        >
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>
      )}

      {/* Status dropdown menu - glassmorphism style */}
      {showStatusMenu && !isCancelled && (
        <div
          className="absolute right-0 top-full mt-2 z-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-200"
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
                  w-full px-4 py-2.5 flex items-center gap-3 text-sm text-left
                  transition-all duration-150
                  ${isActive ? 'bg-slate-50' : 'hover:bg-slate-50'}
                `}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: config.color }}
                />
                <span className={`flex-1 ${isActive ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{config.label}</span>
                {isActive && <CheckIcon className="w-4 h-4 text-[var(--rb-primary)]" />}
              </button>
            )
          })}

          <div className="border-t border-slate-100 my-2 mx-3" />

          {/* No-show */}
          <button
            onClick={() => handleStatusChange('NO_SHOW')}
            className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-left hover:bg-red-50 text-red-600 transition-colors"
          >
            <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 ring-2 ring-white shadow-sm" />
            <span className="font-medium">No-show</span>
          </button>

          {/* Cancel */}
          <button
            onClick={() => {
              setShowStatusMenu(false)
              setShowCancelConfirm(true)
            }}
            className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-left hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            <span>Annuleren</span>
          </button>
        </div>
      )}

      {/* Cancel confirmation - modern dialog */}
      {showCancelConfirm && (
        <div
          className="absolute right-0 top-full mt-2 z-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-sm font-medium text-slate-700 mb-4">Afspraak annuleren?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCancelConfirm(false)}
              className="flex-1 px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 text-slate-600"
            >
              Nee
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-200 transition-all duration-200"
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

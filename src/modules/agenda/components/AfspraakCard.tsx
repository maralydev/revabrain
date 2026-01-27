'use client'

import { useState, useRef, useEffect } from 'react'
import { Afspraak, AfspraakStatus, STATUS_CONFIG } from '../types'
import { updateAfspraakStatus, cancelAfspraak } from '@/modules/afspraak/actions'

interface AfspraakCardProps {
  afspraak: Afspraak
  onClick?: () => void
  onStatusChange?: () => void
  onDelete?: () => void
  compact?: boolean
}

export function AfspraakCard({ afspraak, onClick, onStatusChange, onDelete, compact = false }: AfspraakCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [flashColor, setFlashColor] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const statusConfig = STATUS_CONFIG[afspraak.status]
  const isAdmin = afspraak.type === 'ADMIN'
  const isCancelled = afspraak.status === 'GEANNULEERD'

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowStatusMenu(false)
        setShowDeleteConfirm(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })
  }

  const endTime = new Date(afspraak.datum.getTime() + afspraak.duur * 60000)

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
        onStatusChange?.()
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
    setShowDeleteConfirm(false)

    try {
      const result = await cancelAfspraak(afspraak.id)
      if (result.success) {
        onStatusChange?.()
      }
    } catch (err) {
      console.error('Cancel failed:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger onClick if clicking on menu elements
    if ((e.target as HTMLElement).closest('.status-menu-trigger') ||
        (e.target as HTMLElement).closest('.status-menu')) {
      return
    }
    onClick?.()
  }

  // Status flow - typical progression
  const statusOrder: AfspraakStatus[] = [
    'TE_BEVESTIGEN',
    'BEVESTIGD',
    'IN_WACHTZAAL',
    'BINNEN',
    'AFGEWERKT',
  ]

  // Admin card
  if (isAdmin) {
    return (
      <div
        onClick={handleCardClick}
        className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-2 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span className="font-medium text-gray-600 text-sm truncate block">
              {afspraak.adminTitel || 'Admin'}
            </span>
            <div className="text-xs text-gray-400">
              {formatTime(afspraak.datum)} - {formatTime(endTime)}
            </div>
          </div>
          <LockIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>
      </div>
    )
  }

  // Regular appointment card
  return (
    <div
      ref={menuRef}
      onClick={handleCardClick}
      className={`
        relative bg-white rounded-lg border border-gray-200 cursor-pointer
        transition-all duration-300
        ${isCancelled ? 'opacity-50' : 'hover:shadow-md'}
        ${isUpdating ? 'scale-[0.98]' : ''}
        ${compact ? 'p-2' : 'p-3'}
      `}
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: flashColor || statusConfig.color,
        backgroundColor: flashColor ? `${flashColor}15` : undefined,
      }}
    >
      {/* Loading overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center z-10">
          <div className="w-5 h-5 border-2 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Patient name */}
          <div className="flex items-center gap-2">
            <span className={`font-medium text-gray-900 truncate ${compact ? 'text-sm' : ''} ${isCancelled ? 'line-through' : ''}`}>
              {afspraak.patientNaam}
            </span>
            {afspraak.isHerhalend && (
              <span className="text-xs px-1.5 py-0.5 bg-[var(--rb-light)] text-[var(--rb-primary)] rounded flex-shrink-0">
                {afspraak.sessieNummer}/{afspraak.totaalSessies}
              </span>
            )}
            {afspraak.isAlert && (
              <AlertIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
          </div>

          {/* Time */}
          <div className={`text-gray-500 mt-0.5 ${compact ? 'text-xs' : 'text-sm'} ${isCancelled ? 'line-through' : ''}`}>
            {formatTime(afspraak.datum)} - {formatTime(endTime)}
          </div>

          {/* Type (only in non-compact mode) */}
          {!compact && (
            <div className={`text-xs text-gray-400 mt-1 ${isCancelled ? 'line-through' : ''}`}>
              {afspraak.type} {afspraak.roc && `- ${afspraak.roc}`}
            </div>
          )}
        </div>

        {/* Status button / Menu trigger */}
        <div className="relative status-menu-trigger flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowStatusMenu(!showStatusMenu)
              setShowDeleteConfirm(false)
            }}
            disabled={isCancelled}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
              transition-all duration-200
              ${isCancelled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'hover:opacity-80 cursor-pointer'
              }
            `}
            style={{
              backgroundColor: isCancelled ? undefined : statusConfig.bgColor,
              color: isCancelled ? undefined : statusConfig.color,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusConfig.color }} />
            {!compact && <span>{statusConfig.label}</span>}
            {!isCancelled && (
              <ChevronDownIcon className="w-3 h-3" />
            )}
          </button>

          {/* Status dropdown menu */}
          {showStatusMenu && !isCancelled && (
            <div className="status-menu absolute right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-150">
              {statusOrder.map((status) => {
                const config = STATUS_CONFIG[status]
                const isActive = status === afspraak.status
                return (
                  <button
                    key={status}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStatusChange(status)
                    }}
                    className={`
                      w-full px-3 py-2 flex items-center gap-2 text-sm text-left
                      transition-colors
                      ${isActive ? 'bg-gray-50' : 'hover:bg-gray-50'}
                    `}
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className={isActive ? 'font-medium' : ''}>{config.label}</span>
                    {isActive && (
                      <CheckIcon className="w-4 h-4 ml-auto text-[var(--rb-primary)]" />
                    )}
                  </button>
                )
              })}

              {/* Divider */}
              <div className="border-t border-gray-100 my-1" />

              {/* No-show */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleStatusChange('NO_SHOW')
                }}
                className="w-full px-3 py-2 flex items-center gap-2 text-sm text-left hover:bg-red-50 text-red-600"
              >
                <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                No-show
              </button>

              {/* Cancel */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowStatusMenu(false)
                  setShowDeleteConfirm(true)
                }}
                className="w-full px-3 py-2 flex items-center gap-2 text-sm text-left hover:bg-gray-50 text-gray-500"
              >
                <TrashIcon className="w-4 h-4" />
                Annuleren
              </button>
            </div>
          )}

          {/* Delete confirmation */}
          {showDeleteConfirm && (
            <div className="status-menu absolute right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lg border border-gray-200 p-3 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-150">
              <p className="text-sm text-gray-700 mb-3">
                Afspraak annuleren?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDeleteConfirm(false)
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Nee
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCancel()
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Ja
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Icons
function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
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

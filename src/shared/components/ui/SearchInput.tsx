'use client'

import { useRef, useEffect } from 'react'
import { SearchIcon } from './Icons'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  loading?: boolean
  autoFocus?: boolean
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Zoeken...',
  loading = false,
  autoFocus = false,
  className = '',
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-11 pr-10 py-2.5 rounded-xl
          border border-slate-200 bg-slate-50
          text-sm text-slate-900 placeholder:text-slate-400
          transition-all duration-200
          focus:bg-white focus:border-[var(--rb-primary)] focus:ring-2 focus:ring-[var(--rb-primary)]/20 focus:outline-none
        "
      />
      {loading && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          <svg className="w-4 h-4 animate-spin text-[var(--rb-primary)]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { createAfspraak, CreateAfspraakInput } from '@/modules/afspraak/actions'
import { AfspraakType, TYPE_CONFIG } from '../types'

interface Patient {
  id: number
  voornaam: string
  achternaam: string
  geboortedatum?: Date
}

interface QuickAfspraakModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  datum: Date
  zorgverlenerId: number
  zorgverlenerNaam: string
}

const DUUR_OPTIES = [
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 uur' },
  { value: 90, label: '1,5 uur' },
]

export function QuickAfspraakModal({
  isOpen,
  onClose,
  onSuccess,
  datum,
  zorgverlenerId,
  zorgverlenerNaam,
}: QuickAfspraakModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const [type, setType] = useState<AfspraakType>('CONSULTATIE')
  const [duur, setDuur] = useState<30 | 45 | 60 | 90>(30)
  const [notities, setNotities] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Search patients
  useEffect(() => {
    if (searchTerm.length < 2) {
      setPatients([])
      setShowDropdown(false)
      return
    }

    const searchPatients = async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/patienten/search?q=${encodeURIComponent(searchTerm)}`)
        if (res.ok) {
          const data = await res.json()
          setPatients(data)
          setShowDropdown(true)
        }
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setIsSearching(false)
      }
    }

    const debounce = setTimeout(searchPatients, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
      setSelectedPatient(null)
      setPatients([])
      setType('CONSULTATIE')
      setDuur(30)
      setNotities('')
      setError(null)
    }
  }, [isOpen])

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setSearchTerm(`${patient.voornaam} ${patient.achternaam}`)
    setShowDropdown(false)
  }

  const handleSubmit = async () => {
    if (!selectedPatient) {
      setError('Selecteer een patiënt')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const input: CreateAfspraakInput = {
        patientId: selectedPatient.id,
        datum: datum,
        duur: duur,
        type: type,
        notities: notities || undefined,
      }

      const result = await createAfspraak(input)

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        if (result.conflicts && result.conflicts.length > 0) {
          setError(`Conflict: ${result.conflicts[0].patientNaam || 'Afspraak op dit tijdstip'}`)
        } else {
          setError(result.error || 'Er is een fout opgetreden')
        }
      }
    } catch (err) {
      setError('Er is een fout opgetreden')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-300/30 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-white/50">
        {/* Header - modern gradient */}
        <div className="bg-gradient-to-br from-[var(--rb-primary)] via-[var(--rb-primary)] to-[var(--rb-accent)] text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Nieuwe afspraak</h2>
              <p className="text-sm text-white/80 mt-1 font-medium">
                {formatDate(datum)} om {formatTime(datum)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 -mr-2 -mt-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-white/90">{zorgverlenerNaam}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Patient Search - enhanced */}
          <div ref={searchRef} className="relative">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Patiënt zoeken
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setSelectedPatient(null)
                }}
                placeholder="Typ naam of geboortedatum..."
                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200 text-slate-800 placeholder:text-slate-400"
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {selectedPatient && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Dropdown - glassmorphism */}
            {showDropdown && patients.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 max-h-52 overflow-auto">
                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className="w-full px-4 py-3.5 text-left hover:bg-slate-50 transition-all duration-150 first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    <div className="font-semibold text-slate-800">
                      {patient.voornaam} {patient.achternaam}
                    </div>
                    {patient.geboortedatum && (
                      <div className="text-sm text-slate-500 mt-0.5">
                        °{new Date(patient.geboortedatum).toLocaleDateString('nl-BE')}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {showDropdown && searchTerm.length >= 2 && patients.length === 0 && !isSearching && (
              <div className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 p-4 text-center text-slate-500">
                Geen patiënten gevonden
              </div>
            )}
          </div>

          {/* Type - modern card style */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Type afspraak
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(TYPE_CONFIG) as [AfspraakType, { label: string; icon: string }][])
                .filter(([key]) => key !== 'ADMIN')
                .map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setType(key)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200
                    ${type === key
                      ? 'bg-gradient-to-br from-[var(--rb-primary)]/10 to-[var(--rb-accent)]/10 border-2 border-[var(--rb-primary)] text-[var(--rb-primary)] shadow-sm'
                      : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                    }
                  `}
                >
                  <span className="text-lg">{config.icon}</span>
                  <span className="font-semibold text-sm">{config.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duur - pill buttons */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Duur
            </label>
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
              {DUUR_OPTIES.map((optie) => (
                <button
                  key={optie.value}
                  type="button"
                  onClick={() => setDuur(optie.value as 30 | 45 | 60 | 90)}
                  className={`
                    flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                    ${duur === optie.value
                      ? 'bg-white text-[var(--rb-primary)] shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                    }
                  `}
                >
                  {optie.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notities - subtle input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Notities <span className="text-slate-400 font-normal">(optioneel)</span>
            </label>
            <textarea
              value={notities}
              onChange={(e) => setNotities(e.target.value)}
              rows={2}
              placeholder="Bijkomende info..."
              className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200 resize-none text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Error - improved styling */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-3 border border-red-100">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* Footer - clean and modern */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3.5 bg-slate-100 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-all duration-200"
          >
            Annuleren
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedPatient}
            className="flex-1 px-4 py-3.5 bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[var(--rb-primary)]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Bezig...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Toevoegen</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

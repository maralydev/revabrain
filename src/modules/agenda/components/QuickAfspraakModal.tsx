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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)] text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Nieuwe afspraak</h2>
              <p className="text-sm text-white/80">
                {formatDate(datum)} om {formatTime(datum)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-2 text-sm text-white/70">
            Zorgverlener: {zorgverlenerNaam}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Patient Search */}
          <div ref={searchRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patiënt zoeken
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setSelectedPatient(null)
                }}
                placeholder="Typ naam of geboortedatum..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-transparent transition-all"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {selectedPatient && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Dropdown */}
            {showDropdown && patients.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto">
                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className="w-full px-4 py-3 text-left hover:bg-[var(--rb-light)] transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="font-medium text-gray-900">
                      {patient.voornaam} {patient.achternaam}
                    </div>
                    {patient.geboortedatum && (
                      <div className="text-sm text-gray-500">
                        °{new Date(patient.geboortedatum).toLocaleDateString('nl-BE')}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {showDropdown && searchTerm.length >= 2 && patients.length === 0 && !isSearching && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
                Geen patiënten gevonden
              </div>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type afspraak
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(TYPE_CONFIG) as [AfspraakType, { label: string; icon: string }][])
                .filter(([key]) => key !== 'ADMIN')
                .map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setType(key)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all
                    ${type === key
                      ? 'border-[var(--rb-primary)] bg-[var(--rb-light)] text-[var(--rb-primary)]'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <span>{config.icon}</span>
                  <span className="font-medium">{config.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duur
            </label>
            <div className="flex gap-2">
              {DUUR_OPTIES.map((optie) => (
                <button
                  key={optie.value}
                  type="button"
                  onClick={() => setDuur(optie.value as 30 | 45 | 60 | 90)}
                  className={`
                    flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all
                    ${duur === optie.value
                      ? 'border-[var(--rb-primary)] bg-[var(--rb-light)] text-[var(--rb-primary)]'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {optie.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notities (optioneel)
            </label>
            <textarea
              value={notities}
              onChange={(e) => setNotities(e.target.value)}
              rows={2}
              placeholder="Bijkomende info..."
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Annuleren
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedPatient}
            className="flex-1 px-4 py-3 bg-[var(--rb-primary)] text-white rounded-xl font-medium hover:bg-[var(--rb-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Bezig...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Toevoegen
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

/**
 * Agenda Module - Custom Hooks
 *
 * React hooks voor agenda functionaliteit
 */

import { useState, useCallback, useMemo } from 'react'
import type { Afspraak, Zorgverlener } from '../types'
import { DUMMY_AFSPRAKEN, DUMMY_ZORGVERLENERS } from '../data/dummyData'

/**
 * Hook voor datum navigatie in de agenda
 */
export function useAgendaDatum(initialDate: Date = new Date()) {
  const [currentDate, setCurrentDate] = useState(initialDate)

  const gaNaarVorigeDag = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() - 1)
      return newDate
    })
  }, [])

  const gaNaarVolgendeDag = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() + 1)
      return newDate
    })
  }, [])

  const gaNaarVandaag = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  const gaNaarDatum = useCallback((datum: Date) => {
    setCurrentDate(datum)
  }, [])

  const isVandaag = useMemo(() => {
    const today = new Date()
    return currentDate.toDateString() === today.toDateString()
  }, [currentDate])

  return {
    currentDate,
    gaNaarVorigeDag,
    gaNaarVolgendeDag,
    gaNaarVandaag,
    gaNaarDatum,
    isVandaag,
  }
}

/**
 * Hook voor het ophalen van afspraken
 *
 * TODO: Vervang door React Query / SWR met echte API calls
 */
export function useAfspraken(datum: Date, zorgverlenerId?: number) {
  // Tijdelijk: gebruik dummy data
  // Later: useSWR of useQuery met agendaService
  const afspraken = useMemo(() => {
    const startVanDag = new Date(datum)
    startVanDag.setHours(0, 0, 0, 0)

    const eindVanDag = new Date(datum)
    eindVanDag.setHours(23, 59, 59, 999)

    return DUMMY_AFSPRAKEN.filter(a => {
      const inDag = a.datum >= startVanDag && a.datum <= eindVanDag
      const vanZorgverlener = zorgverlenerId ? a.zorgverlenerId === zorgverlenerId : true
      return inDag && vanZorgverlener
    })
  }, [datum, zorgverlenerId])

  return {
    afspraken,
    isLoading: false,
    error: null,
    refetch: () => {},
  }
}

/**
 * Hook voor het ophalen van zorgverleners
 */
export function useZorgverleners() {
  // Tijdelijk: gebruik dummy data
  return {
    zorgverleners: DUMMY_ZORGVERLENERS,
    isLoading: false,
    error: null,
  }
}

/**
 * Hook voor agenda operaties (CRUD)
 */
export function useAgendaOperaties() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const maakAfspraak = useCallback(async (data: unknown) => {
    setIsLoading(true)
    setError(null)
    try {
      // TODO: agendaService.maakAfspraak(data)
      console.log('Maak afspraak:', data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Er ging iets mis')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const verplaatsAfspraak = useCallback(async (id: number, nieuweDatum: Date) => {
    setIsLoading(true)
    setError(null)
    try {
      // TODO: agendaService.verplaatsAfspraak(id, nieuweDatum)
      console.log('Verplaats afspraak:', id, nieuweDatum)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Er ging iets mis')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const annuleerAfspraak = useCallback(async (id: number) => {
    setIsLoading(true)
    setError(null)
    try {
      // TODO: agendaService.annuleerAfspraak(id)
      console.log('Annuleer afspraak:', id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Er ging iets mis')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    maakAfspraak,
    verplaatsAfspraak,
    annuleerAfspraak,
    isLoading,
    error,
  }
}

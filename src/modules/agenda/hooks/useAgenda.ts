'use client'

/**
 * Agenda Module - Custom Hooks
 *
 * React hooks voor agenda functionaliteit
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import type { Afspraak, AfspraakType, AfspraakStatus, Zorgverlener } from '../types'

export type AgendaView = 'DAG' | 'WEEK'
import { getAfsprakenByDate } from '@/modules/afspraak/queries'
import { getActieveTeamleden } from '@/modules/teamlid/queries'
import type { Teamlid } from '@prisma/client'
import type { AfspraakWithRelations } from '@/modules/afspraak/queries'

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
 */
export function useAfspraken(datum: Date, zorgverlenerId?: number) {
  const [afspraken, setAfspraken] = useState<Afspraak[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAfspraken = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getAfsprakenByDate(datum)

      // Transform AfspraakWithRelations to Afspraak type
      const transformed: Afspraak[] = data.map((a: AfspraakWithRelations) => ({
        id: a.id,
        datum: new Date(a.datum),
        duur: a.duur,
        type: a.type as AfspraakType,
        status: a.status as AfspraakStatus,
        patientNaam: a.patient ? `${a.patient.voornaam} ${a.patient.achternaam}` : undefined,
        patientId: a.patientId || undefined,
        zorgverlenerNaam: `${a.zorgverlener.voornaam} ${a.zorgverlener.achternaam}`,
        zorgverlenerId: a.zorgverlenerId,
        isAlert: a.isAlert || false,
        // isHerhalend, sessieNummer, totaalSessies not yet implemented
      }))

      // Filter by zorgverlenerId if provided
      const filtered = zorgverlenerId
        ? transformed.filter(a => a.zorgverlenerId === zorgverlenerId)
        : transformed

      setAfspraken(filtered)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setIsLoading(false)
    }
  }, [datum, zorgverlenerId])

  useEffect(() => {
    loadAfspraken()
  }, [loadAfspraken])

  return {
    afspraken,
    isLoading,
    error,
    refetch: loadAfspraken,
  }
}

/**
 * Hook voor het ophalen van zorgverleners
 */
export function useZorgverleners() {
  const [zorgverleners, setZorgverleners] = useState<Zorgverlener[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadZorgverleners() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getActieveTeamleden()

        // Transform Teamlid to Zorgverlener type
        const transformed: Zorgverlener[] = data.map((t: Teamlid, index: number) => {
          // Assign colors cyclically
          const colors = ['#2879D8', '#59ECB7', '#9C27B0', '#FFC107', '#4CAF50']
          return {
            id: t.id,
            voornaam: t.voornaam,
            achternaam: t.achternaam,
            discipline: t.discipline || 'Zorgverlener',
            kleur: colors[index % colors.length],
          }
        })

        setZorgverleners(transformed)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
      } finally {
        setIsLoading(false)
      }
    }

    loadZorgverleners()
  }, [])

  return {
    zorgverleners,
    isLoading,
    error,
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

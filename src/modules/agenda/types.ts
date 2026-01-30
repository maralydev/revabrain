/**
 * Agenda Module - Type Definities
 *
 * Centrale types voor het agenda systeem
 */

export type AfspraakStatus =
  | 'TE_BEVESTIGEN'
  | 'BEVESTIGD'
  | 'IN_WACHTZAAL'
  | 'BINNEN'
  | 'AFGEWERKT'
  | 'NO_SHOW'
  | 'GEANNULEERD'

export type AfspraakType = 'INTAKE' | 'CONSULTATIE' | 'HUISBEZOEK' | 'ADMIN'

export interface Afspraak {
  id: number
  datum: Date
  duur: number
  type: AfspraakType
  status: AfspraakStatus
  patientNaam?: string
  patientId?: number
  zorgverlenerNaam: string
  zorgverlenerId: number
  roc?: string
  adminTitel?: string
  isHerhalend?: boolean
  sessieNummer?: number
  totaalSessies?: number
  isAlert?: boolean
}

export interface Zorgverlener {
  id: number
  voornaam: string
  achternaam: string
  discipline: string
  kleur: string
}

export interface AfspraakFormData {
  patientId: number
  zorgverlenerId: number
  datum: Date
  duur: number
  type: AfspraakType
  roc?: string
  isHerhalend: boolean
  aantalSessies?: number
}

export const STATUS_CONFIG: Record<AfspraakStatus, { label: string; color: string; bgColor: string }> = {
  TE_BEVESTIGEN: { label: 'Te bevestigen', color: '#FFC107', bgColor: '#FFF8E1' },
  BEVESTIGD: { label: 'Bevestigd', color: '#2879D8', bgColor: '#E7F6FC' },
  IN_WACHTZAAL: { label: 'Wachtzaal', color: '#9C27B0', bgColor: '#F3E5F5' },
  BINNEN: { label: 'Binnen', color: '#59ECB7', bgColor: '#E8F5E9' },
  AFGEWERKT: { label: 'Afgewerkt', color: '#4CAF50', bgColor: '#E8F5E9' },
  NO_SHOW: { label: 'No-show', color: '#F44336', bgColor: '#FFEBEE' },
  GEANNULEERD: { label: 'Geannuleerd', color: '#9E9E9E', bgColor: '#F5F5F5' },
}

export const TYPE_CONFIG: Record<AfspraakType, { label: string }> = {
  INTAKE: { label: 'Intake' },
  CONSULTATIE: { label: 'Consultatie' },
  HUISBEZOEK: { label: 'Huisbezoek' },
  ADMIN: { label: 'Admin' },
}

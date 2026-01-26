/**
 * Agenda Module - Dummy Data
 *
 * Tijdelijke test data - wordt vervangen door database queries
 */

import { Afspraak, Zorgverlener } from '../types'

export const DUMMY_ZORGVERLENERS: Zorgverlener[] = [
  { id: 1, voornaam: 'Sarah', achternaam: 'De Vries', discipline: 'Logopedie', kleur: '#2879D8' },
  { id: 2, voornaam: 'Jan', achternaam: 'Peeters', discipline: 'Kinesitherapie', kleur: '#59ECB7' },
  { id: 3, voornaam: 'Emma', achternaam: 'Janssen', discipline: 'Ergotherapie', kleur: '#9C27B0' },
]

const today = new Date()
today.setHours(0, 0, 0, 0)

const createDate = (hours: number, minutes: number = 0) => {
  const date = new Date(today)
  date.setHours(hours, minutes)
  return date
}

export const DUMMY_AFSPRAKEN: Afspraak[] = [
  {
    id: 1,
    datum: createDate(9, 0),
    duur: 45,
    type: 'CONSULTATIE',
    status: 'BEVESTIGD',
    patientNaam: 'Karel Willems',
    patientId: 1,
    zorgverlenerNaam: 'Sarah De Vries',
    zorgverlenerId: 1,
    roc: 'Afasie',
    isHerhalend: true,
    sessieNummer: 4,
    totaalSessies: 12,
  },
  {
    id: 2,
    datum: createDate(9, 30),
    duur: 30,
    type: 'CONSULTATIE',
    status: 'IN_WACHTZAAL',
    patientNaam: 'Marie Claes',
    patientId: 2,
    zorgverlenerNaam: 'Jan Peeters',
    zorgverlenerId: 2,
    roc: 'Revalidatie',
  },
  {
    id: 3,
    datum: createDate(10, 0),
    duur: 60,
    type: 'INTAKE',
    status: 'TE_BEVESTIGEN',
    patientNaam: 'Peter Van den Berg',
    patientId: 3,
    zorgverlenerNaam: 'Sarah De Vries',
    zorgverlenerId: 1,
    roc: 'Dysarthrie',
  },
  {
    id: 4,
    datum: createDate(11, 0),
    duur: 45,
    type: 'CONSULTATIE',
    status: 'BEVESTIGD',
    patientNaam: 'Anna Martens',
    patientId: 4,
    zorgverlenerNaam: 'Emma Janssen',
    zorgverlenerId: 3,
    roc: 'Cognitieve revalidatie',
    isHerhalend: true,
    sessieNummer: 8,
    totaalSessies: 10,
  },
  {
    id: 5,
    datum: createDate(14, 0),
    duur: 30,
    type: 'HUISBEZOEK',
    status: 'BEVESTIGD',
    patientNaam: 'Louis Dubois',
    patientId: 5,
    zorgverlenerNaam: 'Jan Peeters',
    zorgverlenerId: 2,
    roc: 'Mobiliteit',
  },
  {
    id: 6,
    datum: createDate(15, 30),
    duur: 45,
    type: 'CONSULTATIE',
    status: 'AFGEWERKT',
    patientNaam: 'Sophie Hermans',
    patientId: 6,
    zorgverlenerNaam: 'Sarah De Vries',
    zorgverlenerId: 1,
    roc: 'Stotteren',
    isHerhalend: true,
    sessieNummer: 12,
    totaalSessies: 12,
  },
  {
    id: 7,
    datum: createDate(12, 0),
    duur: 60,
    type: 'ADMIN',
    status: 'BEVESTIGD',
    zorgverlenerNaam: 'Sarah De Vries',
    zorgverlenerId: 1,
    adminTitel: 'Teamvergadering',
  },
  {
    id: 8,
    datum: createDate(12, 0),
    duur: 60,
    type: 'ADMIN',
    status: 'BEVESTIGD',
    zorgverlenerNaam: 'Jan Peeters',
    zorgverlenerId: 2,
    adminTitel: 'Teamvergadering',
  },
  {
    id: 9,
    datum: createDate(12, 0),
    duur: 60,
    type: 'ADMIN',
    status: 'BEVESTIGD',
    zorgverlenerNaam: 'Emma Janssen',
    zorgverlenerId: 3,
    adminTitel: 'Teamvergadering',
  },
  {
    id: 10,
    datum: createDate(16, 0),
    duur: 30,
    type: 'ADMIN',
    status: 'BEVESTIGD',
    zorgverlenerNaam: 'Sarah De Vries',
    zorgverlenerId: 1,
    adminTitel: 'Administratie',
  },
]

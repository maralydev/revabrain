/**
 * Agenda Module - Service Layer
 *
 * Bevat alle business logic voor het agenda systeem.
 * Components gebruiken deze service, niet direct de database.
 */

import type { Afspraak, AfspraakFormData, AfspraakStatus, Zorgverlener } from '../types'

// Tijdelijk: import dummy data (later: Prisma queries)
import { DUMMY_AFSPRAKEN, DUMMY_ZORGVERLENERS } from '../data/dummyData'

/**
 * Agenda Service
 *
 * Alle operaties voor het agenda systeem
 */
export const agendaService = {
  /**
   * Haalt alle afspraken op voor een specifieke dag
   */
  async getAfsprakenVoorDag(datum: Date, zorgverlenerId?: number): Promise<Afspraak[]> {
    const startVanDag = new Date(datum)
    startVanDag.setHours(0, 0, 0, 0)

    const eindVanDag = new Date(datum)
    eindVanDag.setHours(23, 59, 59, 999)

    // TODO: Vervang door Prisma query
    return DUMMY_AFSPRAKEN.filter(a => {
      const inDag = a.datum >= startVanDag && a.datum <= eindVanDag
      const vanZorgverlener = zorgverlenerId ? a.zorgverlenerId === zorgverlenerId : true
      return inDag && vanZorgverlener
    })
  },

  /**
   * Haalt alle afspraken op voor een week
   */
  async getAfsprakenVoorWeek(startDatum: Date, zorgverlenerId?: number): Promise<Afspraak[]> {
    const eindDatum = new Date(startDatum)
    eindDatum.setDate(eindDatum.getDate() + 7)

    // TODO: Vervang door Prisma query
    return DUMMY_AFSPRAKEN.filter(a => {
      const inWeek = a.datum >= startDatum && a.datum < eindDatum
      const vanZorgverlener = zorgverlenerId ? a.zorgverlenerId === zorgverlenerId : true
      return inWeek && vanZorgverlener
    })
  },

  /**
   * Haalt alle zorgverleners op
   */
  async getZorgverleners(): Promise<Zorgverlener[]> {
    // TODO: Vervang door Prisma query
    return DUMMY_ZORGVERLENERS
  },

  /**
   * Maakt een nieuwe afspraak aan
   */
  async maakAfspraak(data: AfspraakFormData): Promise<Afspraak> {
    // Validatie
    this.validateAfspraakInput(data)

    // Check conflict
    const conflict = await this.checkConflict(data.datum, data.zorgverlenerId, data.duur)
    if (conflict) {
      throw new Error('Er is al een afspraak op dit tijdstip')
    }

    // TODO: Vervang door Prisma create
    const nieuweAfspraak: Afspraak = {
      id: Date.now(),
      datum: data.datum,
      duur: data.duur,
      type: data.type,
      status: 'TE_BEVESTIGEN',
      zorgverlenerId: data.zorgverlenerId,
      zorgverlenerNaam: '', // TODO: lookup
      patientId: data.patientId,
      patientNaam: '', // TODO: lookup
      roc: data.roc,
      isHerhalend: data.isHerhalend,
      totaalSessies: data.aantalSessies,
      sessieNummer: data.isHerhalend ? 1 : undefined,
    }

    return nieuweAfspraak
  },

  /**
   * Verplaatst een afspraak naar een nieuw tijdstip
   */
  async verplaatsAfspraak(id: number, nieuweDatum: Date): Promise<Afspraak> {
    // TODO: Haal afspraak op uit database
    const afspraak = DUMMY_AFSPRAKEN.find(a => a.id === id)
    if (!afspraak) {
      throw new Error('Afspraak niet gevonden')
    }

    // Check conflict
    const conflict = await this.checkConflict(nieuweDatum, afspraak.zorgverlenerId, afspraak.duur, id)
    if (conflict) {
      throw new Error('Er is al een afspraak op dit tijdstip')
    }

    // TODO: Vervang door Prisma update
    afspraak.datum = nieuweDatum

    return afspraak
  },

  /**
   * Wijzigt de status van een afspraak
   */
  async wijzigStatus(id: number, nieuweStatus: AfspraakStatus): Promise<Afspraak> {
    // TODO: Vervang door Prisma update
    const afspraak = DUMMY_AFSPRAKEN.find(a => a.id === id)
    if (!afspraak) {
      throw new Error('Afspraak niet gevonden')
    }

    afspraak.status = nieuweStatus
    return afspraak
  },

  /**
   * Annuleert een afspraak
   */
  async annuleerAfspraak(id: number): Promise<void> {
    await this.wijzigStatus(id, 'GEANNULEERD')
  },

  /**
   * Controleert of er een conflict is met bestaande afspraken
   */
  async checkConflict(
    datum: Date,
    zorgverlenerId: number,
    duur: number,
    excludeId?: number
  ): Promise<boolean> {
    const eindTijd = new Date(datum.getTime() + duur * 60000)

    // TODO: Vervang door Prisma query
    const conflicten = DUMMY_AFSPRAKEN.filter(a => {
      if (a.id === excludeId) return false
      if (a.zorgverlenerId !== zorgverlenerId) return false
      if (a.status === 'GEANNULEERD') return false

      const aEind = new Date(a.datum.getTime() + a.duur * 60000)

      // Check overlap
      return datum < aEind && eindTijd > a.datum
    })

    return conflicten.length > 0
  },

  /**
   * Berekent de effectieve status van een afspraak
   * (bijv. VERLOPEN als de tijd voorbij is)
   */
  berekenEffectieveStatus(afspraak: Afspraak): AfspraakStatus {
    const nu = new Date()

    // Definitieve statussen blijven ongewijzigd
    if (afspraak.status === 'GEANNULEERD' || afspraak.status === 'AFGEWERKT') {
      return afspraak.status
    }

    // Check of afspraak al voorbij is
    const eindTijd = new Date(afspraak.datum.getTime() + afspraak.duur * 60000)
    if (eindTijd < nu) {
      return 'NO_SHOW'
    }

    return afspraak.status
  },

  /**
   * Valideert afspraak input
   */
  validateAfspraakInput(data: AfspraakFormData): void {
    if (!data.patientId && data.type !== 'ADMIN') {
      throw new Error('Selecteer een patiënt')
    }
    if (!data.zorgverlenerId) {
      throw new Error('Selecteer een zorgverlener')
    }
    if (!data.datum) {
      throw new Error('Selecteer een datum en tijd')
    }
    if (!data.duur || data.duur < 15) {
      throw new Error('Duur moet minimaal 15 minuten zijn')
    }
    if (data.isHerhalend && (!data.aantalSessies || data.aantalSessies < 2)) {
      throw new Error('Herhalende reeks moet minimaal 2 sessies bevatten')
    }
  },
}

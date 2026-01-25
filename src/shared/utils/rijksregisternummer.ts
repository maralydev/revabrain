/**
 * Shared Utils - Belgisch Rijksregisternummer
 *
 * Validatie en hulpfuncties voor RR
 *
 * Formaat: JJMMDD-XXX-CC
 * - JJMMDD: Geboortedatum (jaar, maand, dag)
 * - XXX: Volgnummer (001-997 voor mannen, 002-998 voor vrouwen)
 * - CC: Checksum (97 - (eerste 9 cijfers modulo 97))
 *
 * Voor personen geboren na 2000 wordt 2000000000 toegevoegd vóór de modulo berekening
 */

/**
 * Valideert een Belgisch rijksregisternummer
 */
export function valideerRijksregisternummer(rr: string): boolean {
  const schoon = rr.replace(/\D/g, '')

  if (schoon.length !== 11) {
    return false
  }

  const basisNummer = schoon.substring(0, 9)
  const checksum = parseInt(schoon.substring(9, 11), 10)

  // Probeer eerst zonder 2000000000 (geboren voor 2000)
  let berekend = 97 - (parseInt(basisNummer, 10) % 97)
  if (berekend === checksum) {
    return true
  }

  // Probeer met 2000000000 (geboren na 2000)
  berekend = 97 - ((2000000000 + parseInt(basisNummer, 10)) % 97)
  if (berekend === checksum) {
    return true
  }

  return false
}

/**
 * Haalt de geboortedatum uit een rijksregisternummer
 */
export function geboortedatumUitRR(rr: string): Date | null {
  const schoon = rr.replace(/\D/g, '')

  if (schoon.length !== 11) {
    return null
  }

  let jaar = parseInt(schoon.substring(0, 2), 10)
  const maand = parseInt(schoon.substring(2, 4), 10)
  const dag = parseInt(schoon.substring(4, 6), 10)

  const basisNummer = schoon.substring(0, 9)
  const checksum = parseInt(schoon.substring(9, 11), 10)

  // Check voor 2000+
  const berekend2000 = 97 - ((2000000000 + parseInt(basisNummer, 10)) % 97)
  if (berekend2000 === checksum) {
    jaar = 2000 + jaar
  } else {
    jaar = 1900 + jaar
  }

  const datum = new Date(jaar, maand - 1, dag)
  if (
    datum.getFullYear() !== jaar ||
    datum.getMonth() !== maand - 1 ||
    datum.getDate() !== dag
  ) {
    return null
  }

  return datum
}

/**
 * Bepaalt het geslacht uit een rijksregisternummer
 */
export function geslachtUitRR(rr: string): 'M' | 'V' | null {
  const schoon = rr.replace(/\D/g, '')

  if (schoon.length !== 11) {
    return null
  }

  const volgnummer = parseInt(schoon.substring(6, 9), 10)
  return volgnummer % 2 === 1 ? 'M' : 'V'
}

/**
 * Formatteert een rijksregisternummer in leesbaar formaat
 */
export function formatteerRR(rr: string): string {
  const schoon = rr.replace(/\D/g, '')

  if (schoon.length !== 11) {
    return rr
  }

  return `${schoon.substring(0, 2)}.${schoon.substring(2, 4)}.${schoon.substring(4, 6)}-${schoon.substring(6, 9)}.${schoon.substring(9, 11)}`
}

/**
 * Berekent de leeftijd op basis van een geboortedatum
 */
export function berekenLeeftijd(geboortedatum: Date, opDatum: Date = new Date()): number {
  let leeftijd = opDatum.getFullYear() - geboortedatum.getFullYear()
  const maandVerschil = opDatum.getMonth() - geboortedatum.getMonth()

  if (maandVerschil < 0 || (maandVerschil === 0 && opDatum.getDate() < geboortedatum.getDate())) {
    leeftijd--
  }

  return leeftijd
}

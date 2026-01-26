/**
 * Shared Utils - Date Helpers
 *
 * Hulpfuncties voor datum manipulatie
 */

/**
 * Formatteert een datum in Nederlands formaat
 */
export function formatDatumNL(datum: Date, options?: Intl.DateTimeFormatOptions): string {
  return datum.toLocaleDateString('nl-BE', options)
}

/**
 * Formatteert een tijd in Nederlands formaat
 */
export function formatTijdNL(datum: Date): string {
  return datum.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Formatteert een volledige datum met dag naam
 */
export function formatVolledigeDatum(datum: Date): string {
  return datum.toLocaleDateString('nl-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

/**
 * Geeft de start van een dag (00:00:00)
 */
export function startVanDag(datum: Date): Date {
  const result = new Date(datum)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Geeft het einde van een dag (23:59:59.999)
 */
export function eindVanDag(datum: Date): Date {
  const result = new Date(datum)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * Geeft de start van een week (maandag)
 */
export function startVanWeek(datum: Date): Date {
  const result = new Date(datum)
  const dag = result.getDay()
  const verschil = dag === 0 ? -6 : 1 - dag // Maandag = 1, Zondag = 0
  result.setDate(result.getDate() + verschil)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Voegt minuten toe aan een datum
 */
export function voegMinutenToe(datum: Date, minuten: number): Date {
  return new Date(datum.getTime() + minuten * 60000)
}

/**
 * Voegt dagen toe aan een datum
 */
export function voegDagenToe(datum: Date, dagen: number): Date {
  const result = new Date(datum)
  result.setDate(result.getDate() + dagen)
  return result
}

/**
 * Controleert of twee datums dezelfde dag zijn
 */
export function isDezelfdedag(datum1: Date, datum2: Date): boolean {
  return datum1.toDateString() === datum2.toDateString()
}

/**
 * Controleert of een datum vandaag is
 */
export function isVandaag(datum: Date): boolean {
  return isDezelfdedag(datum, new Date())
}

/**
 * Controleert of een datum in het verleden is
 */
export function isVerleden(datum: Date): boolean {
  return datum < new Date()
}

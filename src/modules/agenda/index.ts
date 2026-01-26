/**
 * Agenda Module - Public API
 *
 * Dit bestand definieert wat andere modules mogen importeren.
 * Alles wat hier NIET geëxporteerd wordt is intern.
 */

// === Components ===
export { AfspraakCard } from './components/AfspraakCard'
export { AgendaHeader, type AgendaView } from './components/AgendaHeader'
export { DagView } from './components/DagView'
export { WeekView } from './components/WeekView'

// === Hooks ===
export {
  useAgendaDatum,
  useAfspraken,
  useZorgverleners,
  useAgendaOperaties,
} from './hooks/useAgenda'

// === Services ===
export { agendaService } from './services/agendaService'

// === Types ===
export type {
  Afspraak,
  AfspraakStatus,
  AfspraakType,
  AfspraakFormData,
  Zorgverlener,
} from './types'

export { STATUS_CONFIG, TYPE_CONFIG } from './types'

// === Data (alleen voor development) ===
export { DUMMY_AFSPRAKEN, DUMMY_ZORGVERLENERS } from './data/dummyData'

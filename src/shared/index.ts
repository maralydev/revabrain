/**
 * Shared Module - Public API
 *
 * Herbruikbare componenten en utilities voor alle modules
 */

// === Layout Components ===
export { AdminLayout } from './components/layout/AdminLayout'
export { Sidebar } from './components/layout/Sidebar'

// === UI Components ===
export {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LockIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  TeamIcon,
  UsersIcon,
  XMarkIcon,
} from './components/ui/Icons'

// === Utils ===
export {
  valideerRijksregisternummer,
  geboortedatumUitRR,
  geslachtUitRR,
  formatteerRR,
  berekenLeeftijd,
} from './utils/rijksregisternummer'

export {
  formatDatumNL,
  formatTijdNL,
  formatVolledigeDatum,
  startVanDag,
  eindVanDag,
  startVanWeek,
  voegMinutenToe,
  voegDagenToe,
  isDezelfdedag,
  isVandaag,
  isVerleden,
} from './utils/dateHelpers'

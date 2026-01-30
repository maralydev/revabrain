/**
 * Shared Module - Public API
 *
 * Herbruikbare componenten en utilities voor alle modules
 */

// === Layout Components ===
export { AdminLayout } from './components/layout/AdminLayout'
export { Sidebar, type UserInfo } from './components/layout/Sidebar'

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
  DocumentIcon,
} from './components/ui/Icons'

export { Button } from './components/ui/Button'
export { Card } from './components/ui/Card'
export { Input, Textarea } from './components/ui/Input'
export { Modal } from './components/ui/Modal'
export { Badge } from './components/ui/Badge'
export { PageHeader } from './components/ui/PageHeader'
export { SearchInput } from './components/ui/SearchInput'
export { Alert } from './components/ui/Alert'
export { Spinner } from './components/ui/Spinner'
export { EmptyState } from './components/ui/EmptyState'

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

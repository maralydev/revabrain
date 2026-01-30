export interface NavItem {
  href: string
  labelKey: string
  fallback: string
}

export const publicNavItems: NavItem[] = [
  { href: '/', labelKey: 'nav.home', fallback: 'Home' },
  { href: '/team', labelKey: 'nav.team', fallback: 'Team' },
  { href: '/verwijzers', labelKey: 'nav.referrers', fallback: 'Voor verwijzers' },
  { href: '/treatments', labelKey: 'nav.treatments', fallback: 'Behandelingen' },
  { href: '/disciplines', labelKey: 'nav.disciplines', fallback: 'Disciplines' },
  { href: '/costs', labelKey: 'nav.costs', fallback: 'Tarieven' },
]

export const contactNavItem: NavItem = {
  href: '/contact',
  labelKey: 'nav.contact',
  fallback: 'Contact',
}

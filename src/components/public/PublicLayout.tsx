'use client'

import { ReactNode } from 'react'
import { I18nProvider } from '@/i18n/client'
import { UtilityBar } from './UtilityBar'
import { PublicHeader } from './PublicHeader'
import ScrollToTop from './ScrollToTop'
import Footer, { type FooterData } from './Footer'

interface PublicLayoutProps {
  children: ReactNode
  footerData?: FooterData | null
}

function PublicLayoutContent({ children, footerData }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <UtilityBar />
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <Footer data={footerData} />
      <ScrollToTop />
    </div>
  )
}

export default function PublicLayout({ children, footerData }: PublicLayoutProps) {
  return (
    <I18nProvider>
      <PublicLayoutContent footerData={footerData}>{children}</PublicLayoutContent>
    </I18nProvider>
  )
}

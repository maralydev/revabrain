'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useI18n } from '@/i18n/client'
import { publicNavItems, contactNavItem } from '@/shared/config/navigation'
import { MobileMenu } from './MobileMenu'

export function PublicHeader() {
  const { t } = useI18n()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const isHomepage = pathname === '/'
  const showDarkMode = isHomepage && !isScrolled && !mobileMenuOpen

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`
          fixed left-0 right-0 z-50 transition-all duration-500
          ${isScrolled ? 'top-0' : 'top-[40px]'}
          ${showDarkMode ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md shadow-sm'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="relative z-10 flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/images/logo.png"
                  alt="RevaBrain logo"
                  width={44}
                  height={44}
                  priority
                  className="rounded-xl transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-xl bg-[var(--rb-accent)] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-30" />
              </div>
              <div className="hidden sm:block">
                <span className={`font-bold text-xl transition-colors duration-300 ${showDarkMode ? 'text-white' : 'text-[var(--rb-dark)]'}`}>
                  Reva
                </span>
                <span className="font-bold text-xl text-[var(--rb-primary)]">Brain</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${showDarkMode
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : pathname === item.href
                        ? 'text-[var(--rb-primary)] bg-[var(--rb-light)]'
                        : 'text-slate-600 hover:text-[var(--rb-primary)] hover:bg-slate-50'
                    }
                  `}
                >
                  {t(item.labelKey) || item.fallback}
                </Link>
              ))}
              <Link
                href={contactNavItem.href}
                className={`
                  ml-3 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                  ${showDarkMode
                    ? 'bg-white text-[var(--rb-dark)] hover:bg-[var(--rb-accent)] hover:shadow-lg'
                    : 'bg-[var(--rb-primary)] text-white hover:bg-[var(--rb-primary-dark)] hover:shadow-lg hover:shadow-[var(--rb-primary)]/20'
                  }
                `}
              >
                {t(contactNavItem.labelKey) || contactNavItem.fallback}
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`
                lg:hidden relative z-10 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300
                ${mobileMenuOpen ? 'bg-[var(--rb-light)]' : showDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'}
              `}
              aria-label="Menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`w-full h-0.5 rounded-full transition-all duration-300 origin-left ${
                  mobileMenuOpen ? 'rotate-45 translate-x-px bg-[var(--rb-primary)]' : showDarkMode ? 'bg-white' : 'bg-slate-800'
                }`} />
                <span className={`w-full h-0.5 rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0 translate-x-4' : showDarkMode ? 'bg-white' : 'bg-slate-800'
                }`} />
                <span className={`w-full h-0.5 rounded-full transition-all duration-300 origin-left ${
                  mobileMenuOpen ? '-rotate-45 translate-x-px bg-[var(--rb-primary)]' : showDarkMode ? 'bg-white' : 'bg-slate-800'
                }`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}

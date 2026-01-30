'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useI18n } from '@/i18n/client'
import { publicNavItems, contactNavItem } from '@/shared/config/navigation'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t } = useI18n()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div
      className={`
        lg:hidden fixed inset-x-0 top-20 bottom-0 z-40
        transition-all duration-400
        ${open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
      `}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-[var(--rb-dark)]/40 backdrop-blur-sm transition-opacity duration-400 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={`
          relative mx-4 mt-4 p-6 glass rounded-2xl
          transition-all duration-400
          ${open ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}
        `}
      >
        <nav className="flex flex-col gap-1">
          {publicNavItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="text-base font-medium text-slate-800 py-3.5 px-4 rounded-xl hover:bg-[var(--rb-light)] hover:text-[var(--rb-primary)] transition-all duration-200"
              style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
            >
              {t(item.labelKey) || item.fallback}
            </Link>
          ))}
          <Link
            href={contactNavItem.href}
            onClick={onClose}
            className="mt-3 text-center py-3.5 bg-[var(--rb-primary)] text-white rounded-xl font-semibold hover:bg-[var(--rb-primary-dark)] transition-all duration-200"
          >
            {t(contactNavItem.labelKey) || contactNavItem.fallback}
          </Link>
        </nav>
      </div>
    </div>
  )
}

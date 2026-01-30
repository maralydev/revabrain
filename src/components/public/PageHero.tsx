import { ReactNode } from 'react'

interface PageHeroProps {
  title: string
  badge?: string
  description?: string
  align?: 'center' | 'left'
  children?: ReactNode
}

export default function PageHero({
  title,
  badge,
  description,
  align = 'center',
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--rb-dark)] via-[var(--rb-primary)] to-[var(--rb-dark)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(89,236,183,0.08),transparent_70%)]" />

      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 ${align === 'center' ? 'text-center' : ''}`}>
        <div className={align === 'center' ? 'max-w-3xl mx-auto' : 'max-w-3xl'}>
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span className="text-sm text-white/90 font-medium">{badge}</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>

          {description && (
            <p className="text-lg lg:text-xl text-white/80 leading-relaxed">
              {description}
            </p>
          )}

          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>

      {/* Accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--rb-primary)] via-[var(--rb-accent)] to-[var(--rb-primary)]" />
    </section>
  )
}

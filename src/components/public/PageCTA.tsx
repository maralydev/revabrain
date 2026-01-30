import { ReactNode } from 'react'

interface PageCTAProps {
  title: string
  description?: string
  children: ReactNode
}

export default function PageCTA({ title, description, children }: PageCTAProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--rb-dark)] via-[var(--rb-primary)] to-[var(--rb-dark)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(89,236,183,0.1),transparent_70%)]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          {title}
        </h2>

        {description && (
          <p className="text-lg text-white/75 mb-12 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {children}
        </div>
      </div>
    </section>
  )
}

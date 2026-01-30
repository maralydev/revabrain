import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  backHref?: string
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-8 ${className}`}>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

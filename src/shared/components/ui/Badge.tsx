import { ReactNode } from 'react'

type BadgeVariant =
  | 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
  | 'te-bevestigen' | 'bevestigd' | 'wachtzaal' | 'binnen' | 'afgewerkt' | 'no-show' | 'geannuleerd'

type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  primary: 'bg-[var(--rb-primary)]/10 text-[var(--rb-primary)]',
  accent: 'bg-[var(--rb-accent)]/15 text-emerald-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
  // Afspraak statussen
  'te-bevestigen': 'bg-amber-50 text-amber-700',
  'bevestigd': 'bg-[var(--rb-primary)]/10 text-[var(--rb-primary)]',
  'wachtzaal': 'bg-purple-50 text-purple-700',
  'binnen': 'bg-emerald-50 text-emerald-700',
  'afgewerkt': 'bg-green-50 text-green-700',
  'no-show': 'bg-red-50 text-red-700',
  'geannuleerd': 'bg-slate-100 text-slate-500',
}

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-slate-400',
  primary: 'bg-[var(--rb-primary)]',
  accent: 'bg-[var(--rb-accent)]',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  'te-bevestigen': 'bg-amber-500',
  'bevestigd': 'bg-[var(--rb-primary)]',
  'wachtzaal': 'bg-purple-500',
  'binnen': 'bg-emerald-500',
  'afgewerkt': 'bg-green-500',
  'no-show': 'bg-red-500',
  'geannuleerd': 'bg-slate-400',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-lg
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  )
}

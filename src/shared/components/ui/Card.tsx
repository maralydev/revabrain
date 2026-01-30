import { ReactNode } from 'react'

type CardVariant = 'default' | 'glass' | 'dark' | 'outline'

interface CardProps {
  variant?: CardVariant
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  children: ReactNode
  onClick?: () => void
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'bg-white border border-slate-100 shadow-sm',
  glass:
    'bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm',
  dark:
    'bg-[var(--rb-dark-surface)] border border-white/10 text-white',
  outline:
    'bg-transparent border border-slate-200',
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
  children,
  onClick,
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl transition-all duration-300
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hover ? 'hover:-translate-y-1 hover:shadow-lg hover:border-[var(--rb-primary)]/30 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

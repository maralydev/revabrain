import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)] text-white shadow-md shadow-[var(--rb-primary)]/20 hover:shadow-lg hover:shadow-[var(--rb-primary)]/30',
  secondary:
    'bg-slate-100 text-slate-700 hover:bg-slate-200',
  danger:
    'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100',
  accent:
    'bg-gradient-to-r from-[var(--rb-accent)] to-[var(--rb-accent-dark)] text-[var(--rb-dark)] shadow-md shadow-[var(--rb-accent)]/20 hover:shadow-lg hover:shadow-[var(--rb-accent)]/30',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3 text-base rounded-2xl gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200
        hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-50 disabled:pointer-events-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="w-4 h-4 flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}

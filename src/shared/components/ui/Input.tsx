import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-xl border bg-slate-50 px-4 py-2.5
              text-sm text-slate-900 placeholder:text-slate-400
              transition-all duration-200
              focus:bg-white focus:border-[var(--rb-primary)] focus:ring-2 focus:ring-[var(--rb-primary)]/20 focus:outline-none
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className="text-sm text-slate-400">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          w-full rounded-xl border bg-slate-50 px-4 py-2.5
          text-sm text-slate-900 placeholder:text-slate-400
          transition-all duration-200 resize-y min-h-[100px]
          focus:bg-white focus:border-[var(--rb-primary)] focus:ring-2 focus:ring-[var(--rb-primary)]/20 focus:outline-none
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

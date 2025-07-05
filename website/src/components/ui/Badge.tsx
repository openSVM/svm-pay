import React from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'success' | 'warning'
  children: React.ReactNode
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 backdrop-blur-md',
      {
        'bg-white/80 text-slate-700 border border-slate-200 shadow-lg shadow-slate-900/5': 
          variant === 'default',
        'bg-white/60 text-slate-600 border border-slate-200': 
          variant === 'outline',
        'bg-emerald-100/80 text-emerald-700 border border-emerald-200': 
          variant === 'success',
        'bg-yellow-100/80 text-yellow-700 border border-yellow-200': 
          variant === 'warning',
      },
      className
    )

    return (
      <div className={baseClasses} ref={ref} {...props}>
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'
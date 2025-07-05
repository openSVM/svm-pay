import React from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      {
        'bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 active:scale-95': 
          variant === 'default',
        'border-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300 hover:scale-105 active:scale-95': 
          variant === 'outline',
        'text-slate-700 hover:bg-slate-100 hover:text-slate-900': 
          variant === 'ghost',
      },
      {
        'h-10 px-4 py-2 text-sm': size === 'sm',
        'h-12 px-6 py-3 text-base': size === 'md',
        'h-14 px-8 py-4 text-lg': size === 'lg',
        'h-16 px-12 py-5 text-xl': size === 'xl',
      },
      className
    )

    return (
      <button className={baseClasses} ref={ref} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
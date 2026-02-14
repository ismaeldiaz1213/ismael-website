import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'glass'
  children: React.ReactNode
}

export function Card({
  variant = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default:
      'bg-slate-800/50 border border-slate-700 rounded-lg p-6 shadow-lg hover:shadow-xl hover:border-slate-600 transition-all',
    gradient:
      'bg-gradient-to-br from-purple-700/30 via-blue-800/30 to-slate-900/50 border border-purple-600/40 rounded-lg p-6 backdrop-blur-sm hover:border-purple-500/60 hover:from-purple-600/40 hover:to-slate-800/60 transition-all',
    glass:
      'bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-lg p-6 hover:bg-slate-900/60 hover:border-purple-600/50 transition-all',
  }

  return (
    <div className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}


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
      'bg-[#0f3a52]/50 border border-[#1a5f7a] rounded-lg p-6 shadow-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] hover:border-[#00d9ff] transition-all',
    gradient:
      'bg-gradient-to-br from-[#0f3a52]/30 via-[#061e2a]/20 to-[#0a1929]/50 border border-[#1a5f7a]/40 rounded-lg p-6 backdrop-blur-sm hover:border-[#00d9ff]/60 hover:from-[#0f3a52]/40 hover:to-[#0a1929]/60 transition-all',
    glass:
      'bg-[#0f3a52]/40 backdrop-blur-md border border-[#1a5f7a]/50 rounded-lg p-6 hover:bg-[#0f3a52]/60 hover:border-[#00d9ff]/50 transition-all',
  }

  return (
    <div className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}


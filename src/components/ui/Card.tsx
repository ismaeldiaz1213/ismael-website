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
    default:  'surface surface-hover p-6',
    gradient: 'surface surface-hover p-6',
    glass:    'rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-md p-6',
  }

  return (
    <div className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}

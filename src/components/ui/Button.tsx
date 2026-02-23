import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  href?: string
  target?: string
  rel?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  href,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary:
      'bg-[#0f3a52] text-[#e8f1f5] hover:bg-[#1a5f7a] active:bg-[#061e2a] shadow-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.3)]',
    secondary:
      'border-2 border-[#00d9ff] text-[#00d9ff] hover:bg-[#00d9ff]/10 active:bg-[#00d9ff]/20 shadow-md hover:shadow-[0_0_15px_rgba(0,217,255,0.3)]',
    outline:
      'border-2 border-[#1a5f7a] text-[#00d9ff] hover:bg-[#1a5f7a]/20 active:bg-[#1a5f7a]/40',
    ghost:
      'text-[#00d9ff] hover:bg-[#0f3a52]/50 active:bg-[#0f3a52]/70',
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  if (href) {
    return (
      <a
        href={href}
        className={combinedClassName}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  )
}


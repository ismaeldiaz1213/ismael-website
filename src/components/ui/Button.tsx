import React from 'react'
import { Link } from 'react-router-dom'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'light'
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
    'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary:   'bg-lime text-night hover:bg-[#d6ff6b] hover:-translate-y-0.5 shadow-[0_8px_24px_-8px_rgba(200,255,61,0.55)]',
    secondary: 'border border-cream/30 text-cream hover:bg-cream hover:text-night',
    outline:   'border border-white/15 text-cream/90 hover:border-white/40 hover:bg-white/5',
    ghost:     'text-cream/80 hover:text-cream hover:bg-white/10',
    light:     'bg-cream text-night hover:bg-white hover:-translate-y-0.5',
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-base',
  }

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  // Internal routes go through the router so the page doesn't fully reload
  if (href?.startsWith('/')) {
    return <Link to={href} className={combinedClassName}>{children}</Link>
  }

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
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  )
}

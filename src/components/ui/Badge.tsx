interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'orange'
}

export function Badge({ children, variant = 'primary' }: BadgeProps) {
  const variantStyles = {
    primary:   'bg-sky/10 text-sky',
    secondary: 'bg-white/5 text-cream/70',
    orange:    'bg-marigold/15 text-marigold',
  }

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${variantStyles[variant]}`}>
      {children}
    </span>
  )
}

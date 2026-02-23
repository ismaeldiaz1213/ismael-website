interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'orange'
}

export function Badge({ children, variant = 'primary' }: BadgeProps) {
  const variantStyles = {
    primary:
      'bg-[#0f3a52]/40 text-[#a0a0a0] border border-[#1a5f7a]/60',
    secondary:
      'bg-[#061e2a]/40 text-[#a0a0a0] border border-[#1a5f7a]/60',
    orange:
      'bg-[#0f3a52]/40 text-[#a0a0a0] border border-[#1a5f7a]/60',
  }

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full ${variantStyles[variant]}`}>
      {children}
    </span>
  )
}

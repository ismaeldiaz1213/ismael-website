interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'orange'
}

export function Badge({ children, variant = 'primary' }: BadgeProps) {
  const variantStyles = {
    primary:
      'bg-purple-900/40 text-purple-300 border border-purple-700/60',
    secondary:
      'bg-slate-700/40 text-slate-300 border border-slate-600/60',
    orange:
      'bg-orange-900/40 text-orange-300 border border-orange-700/60',
  }

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full ${variantStyles[variant]}`}>
      {children}
    </span>
  )
}

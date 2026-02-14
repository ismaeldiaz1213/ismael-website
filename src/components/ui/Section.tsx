interface SectionProps {
  children: React.ReactNode
  variant?: 'light' | 'dark' | 'gradient'
  className?: string
}

export function Section({
  children,
  variant = 'dark',
  className = '',
}: SectionProps) {
  const variantStyles = {
    light: 'bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-slate-800/30 border border-purple-700/40',
    dark: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950',
    gradient:
      'bg-gradient-to-r from-blue-950/80 via-purple-900/40 to-slate-950/60 border-y border-purple-800/30',
  }

  return (
    <section className={`py-16 md:py-24 px-6 ${variantStyles[variant]} ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  )
}

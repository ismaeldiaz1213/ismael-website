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
    light: 'bg-gradient-to-br from-[#0f3a52]/30 via-[#0a1929]/20 to-[#0a1929]/40 border border-[#00d9ff]/20',
    dark: 'bg-gradient-to-br from-[#0a1929] via-[#0f3a52]/20 to-[#0a1929]',
    gradient:
      'bg-gradient-to-r from-[#0f3a52]/40 via-[#1a5f7a]/30 to-[#0a1929]/50 border-y border-[#00d9ff]/20',
  }

  return (
    <section className={`py-16 md:py-24 px-6 ${variantStyles[variant]} ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  )
}

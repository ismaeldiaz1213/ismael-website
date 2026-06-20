interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
}

export function SectionHeader({ title, subtitle, centered = true }: SectionHeaderProps) {
  return (
    <div className={centered ? 'text-center' : 'text-left'}>
      <h2 className="c-section-title text-3xl md:text-4xl font-bold mb-3">{title}</h2>
      {subtitle && (
        <p className={`c-text-muted opacity-80 text-lg max-w-2xl ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

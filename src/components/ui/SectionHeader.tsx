interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  const textAlign = centered ? 'text-center' : 'text-left'

  return (
    <div className={textAlign}>
      <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1a5f7a' }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg max-w-2xl mx-auto" style={{ color: '#a0a0a0', opacity: 0.8 }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

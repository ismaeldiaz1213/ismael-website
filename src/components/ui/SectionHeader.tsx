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
      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 via-rose-400 to-orange-400 bg-clip-text text-transparent mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-rose-300 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  )
}

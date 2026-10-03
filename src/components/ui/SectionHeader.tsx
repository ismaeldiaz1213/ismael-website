interface SectionHeaderProps {
  title: string
  /** Rendered after the title in the italic serif accent face */
  accent?: string
  eyebrow?: string
  subtitle?: string
  centered?: boolean
}

export function SectionHeader({ title, accent, eyebrow, subtitle, centered = true }: SectionHeaderProps) {
  return (
    <div className={centered ? 'text-center' : 'text-left'}>
      {eyebrow && <p className="eyebrow text-lime mb-3">{eyebrow}</p>}
      <h2 className="c-text text-4xl md:text-5xl font-bold leading-[1.05] mb-4">
        {title}
        {accent && <> <span className="accent-serif text-sunset pr-1">{accent}</span></>}
      </h2>
      {subtitle && (
        <p className={`body-text text-cream/70 text-lg max-w-2xl ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

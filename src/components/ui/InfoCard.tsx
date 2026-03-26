interface InfoCardProps {
  label: string
  children: React.ReactNode
}

/** Labeled info card used on the About/Home section. */
export function InfoCard({ label, children }: InfoCardProps) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        border: '1px solid var(--color-card-border-subtle)',
        backgroundColor: 'var(--color-card-bg-subtle)',
      }}
    >
      <div
        className="text-sm uppercase tracking-wide mb-1"
        style={{ color: 'var(--color-accent)', opacity: 0.85 }}
      >
        {label}
      </div>
      <p className="text-base" style={{ color: 'var(--color-text)', opacity: 0.88 }}>
        {children}
      </p>
    </div>
  )
}

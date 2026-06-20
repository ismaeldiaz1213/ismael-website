interface InfoCardProps {
  label: string
  children: React.ReactNode
}

export function InfoCard({ label, children }: InfoCardProps) {
  return (
    <div className="info-card rounded-2xl p-4">
      <div className="c-accent opacity-85 text-sm uppercase tracking-wide mb-1">{label}</div>
      <p className="c-text opacity-88 text-base">{children}</p>
    </div>
  )
}

interface InfoCardProps {
  label: string
  children: React.ReactNode
}

export function InfoCard({ label, children }: InfoCardProps) {
  return (
    <div className="info-card rounded-3xl p-5">
      <div className="eyebrow text-lime mb-2">{label}</div>
      <p className="body-text text-cream/90 text-base">{children}</p>
    </div>
  )
}

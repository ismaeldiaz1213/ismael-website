import { Link } from 'react-router-dom'
import { Card } from './Card'

interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
}

export function FeatureCard({
  title,
  description,
  icon = '✨',
  href,
  onClick,
}: FeatureCardProps) {
  const accentColor = '#a0a0a0'

  const Content = (
    <Card variant="gradient" className="group h-full hover:scale-105 transition-transform">
      <div className="h-32 rounded-lg mb-4 flex items-center justify-center text-5xl" style={{ backgroundColor: 'rgba(160, 160, 160, 0.1)' }}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 transition-colors" style={{ color: 'var(--color-text)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
      <div className="mt-4 inline-block">
        <span className="font-semibold group-hover:translate-x-2 transition-transform inline-block" style={{ color: accentColor }}>
          Learn more →
        </span>
      </div>
    </Card>
  )

  if (href) {
    return <Link to={href}>{Content}</Link>
  }

  if (onClick) {
    return <button onClick={onClick}>{Content}</button>
  }

  return Content
}

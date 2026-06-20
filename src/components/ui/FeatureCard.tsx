import { Link } from 'react-router-dom'
import { Card } from './Card'

interface FeatureCardProps {
  title: string
  description: string
  image?: string
  imageAlt?: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
}

export function FeatureCard({
  title,
  description,
  image,
  imageAlt = '',
  icon = '✨',
  href,
  onClick,
}: FeatureCardProps) {
  const Content = (
    <Card variant="gradient" className="group h-full hover:scale-105 transition-transform">
      {image ? (
        <div className="h-32 rounded-lg mb-4 overflow-hidden">
          <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="c-bg-icon h-32 rounded-lg mb-4 flex items-center justify-center text-5xl">
          {icon}
        </div>
      )}
      <h3 className="c-text text-xl font-bold mb-3 transition-colors">{title}</h3>
      <p className="c-text-muted">{description}</p>
      <div className="mt-4 inline-block">
        <span className="c-text-muted font-semibold group-hover:translate-x-2 transition-transform inline-block">
          Learn more →
        </span>
      </div>
    </Card>
  )

  if (href) return <Link to={href}>{Content}</Link>
  if (onClick) return <button onClick={onClick}>{Content}</button>
  return Content
}

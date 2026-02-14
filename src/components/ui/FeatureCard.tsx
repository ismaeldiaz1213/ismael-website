import { Link } from 'react-router-dom'
import { Card } from './Card'

interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  accent?: 'blue' | 'orange'
}

export function FeatureCard({
  title,
  description,
  icon = '✨',
  href,
  onClick,
  accent = 'blue',
}: FeatureCardProps) {
  const accentStyles = accent === 'blue' 
    ? { text: 'text-blue-300', hover: 'group-hover:text-blue-200' }
    : { text: 'text-amber-300', hover: 'group-hover:text-amber-200' }

  const Content = (
    <Card variant="gradient" className="group h-full hover:scale-105 transition-transform">
      <div className="h-32 rounded-lg bg-gradient-to-br from-purple-700/30 via-blue-700/30 to-orange-700/20 mb-4 flex items-center justify-center text-5xl">
        {icon}
      </div>
      <h3 className={`text-xl font-bold mb-3 text-slate-100 ${accentStyles.hover} transition-colors`}>
        {title}
      </h3>
      <p className="text-slate-400">{description}</p>
      <div className="mt-4 inline-block">
        <span className={`${accentStyles.text} font-semibold group-hover:translate-x-2 transition-transform inline-block`}>
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

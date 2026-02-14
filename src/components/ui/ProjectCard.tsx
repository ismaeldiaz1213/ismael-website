import { Link } from 'react-router-dom'
import { Card } from './Card'
import { Badge } from './Badge'

interface ProjectCardProps {
  id: string | number
  title: string
  description: string
  tags: string[]
  date: string
  icon?: string
}

export function ProjectCard({
  id,
  title,
  description,
  tags,
  date,
  icon = '📁',
}: ProjectCardProps) {
  return (
    <Link to={`/projects/${id}`}>
      <Card variant="gradient" className="group overflow-hidden hover:shadow-xl transition-all hover:border-blue-600/50">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Icon */}
<div className="md:col-span-1 h-32 md:h-auto rounded-lg bg-gradient-to-br from-purple-700/30 via-blue-700/30 to-orange-600/30 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
            {icon}
          </div>

          {/* Content */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3 gap-4">
                <h3 className="text-2xl font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                  {title}
                </h3>
                <span className="text-sm text-slate-500 whitespace-nowrap">{date}</span>
              </div>

              <p className="text-slate-400">{description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="primary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

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
  category?: string
  semester?: string
}

export function ProjectCard({
  id,
  title,
  description,
  tags,
  date,
  icon = '📁',
  category,
  semester,
}: ProjectCardProps) {
  return (
    <Link to={`/projects/${id}`}>
      <Card variant="gradient" className="c-border group overflow-hidden hover:shadow-xl transition-all">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="c-bg-icon md:col-span-1 h-32 md:h-auto rounded-lg flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
            {icon}
          </div>

          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3 gap-4">
                <h3 className="c-text-muted text-2xl font-bold group-hover:text-gray-300 transition-colors">{title}</h3>
                <span className="c-text-faint text-sm whitespace-nowrap">{date}</span>
              </div>

              <div className="flex gap-2 mb-3">
                {category ? (
                  <Badge variant={category.toLowerCase() === 'hardware' ? 'orange' : category.toLowerCase() === 'software' ? 'primary' : 'secondary'}>
                    {category}
                  </Badge>
                ) : null}
                {semester ? <Badge variant="secondary">{semester}</Badge> : null}
              </div>

              <p className="c-body">{description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag) => <Badge key={tag} variant="primary">{tag}</Badge>)}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

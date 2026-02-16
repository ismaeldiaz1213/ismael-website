import { Link } from 'react-router-dom'
import { Card } from './Card'
import { Badge } from './Badge'

interface BlogCardProps {
  title: string
  date: string
  excerpt: string
  tags?: string[]
  href: string
  category?: string
  semester?: string
}

export function BlogCard({ title, date, excerpt, tags, href, category, semester }: BlogCardProps) {
  return (
    <Link to={href}>
      <Card variant="gradient" className="group h-full hover:shadow-xl transition-all hover:border-blue-600/50">
        <div className="flex justify-between items-start mb-3 gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
              {title}
            </h2>
            <div className="flex gap-2 mt-2">
              {category ? (
                <Badge variant={category.toLowerCase() === 'hardware' ? 'orange' : category.toLowerCase() === 'software' ? 'primary' : 'secondary'}>
                  {category}
                </Badge>
              ) : null}

              {semester ? (
                <Badge variant="secondary">{semester}</Badge>
              ) : null}
            </div>
          </div>

          <span className="text-sm text-slate-500 whitespace-nowrap">{date}</span>
        </div>

        <p className="text-slate-400 mb-4 line-clamp-2">{excerpt}</p>

        <div className="flex flex-wrap gap-2">
          {tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </Card>
    </Link>
  )
}

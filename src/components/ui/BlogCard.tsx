import { Link } from 'react-router-dom'
import { Card } from './Card'
import { Badge } from './Badge'

interface BlogCardProps {
  title: string
  date: string
  excerpt: string
  tags?: string[]
  href: string
}

export function BlogCard({ title, date, excerpt, tags, href }: BlogCardProps) {
  return (
    <Link to={href}>
      <Card variant="gradient" className="group h-full hover:shadow-xl transition-all hover:border-blue-600/50">
        <div className="flex justify-between items-start mb-3 gap-4">
          <h2 className="text-xl font-bold text-slate-100 group-hover:text-blue-300 transition-colors flex-1">
            {title}
          </h2>
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

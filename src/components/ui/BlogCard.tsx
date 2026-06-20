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
      <Card variant="gradient" className="c-border group h-full hover:shadow-xl transition-all">
        <div className="flex justify-between items-start mb-3 gap-4">
          <div className="flex-1">
            <h2 className="c-text-muted text-xl font-bold group-hover:text-gray-300 transition-colors">
              {title}
            </h2>
            <div className="flex gap-2 mt-2">
              {category ? (
                <Badge variant={category.toLowerCase() === 'hardware' ? 'orange' : category.toLowerCase() === 'software' ? 'primary' : 'secondary'}>
                  {category}
                </Badge>
              ) : null}
              {semester ? <Badge variant="secondary">{semester}</Badge> : null}
            </div>
          </div>
          <span className="c-text-faint text-sm whitespace-nowrap">{date}</span>
        </div>

        <p className="c-body mb-4 line-clamp-2">{excerpt}</p>

        <div className="flex flex-wrap gap-2">
          {tags?.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
        </div>
      </Card>
    </Link>
  )
}

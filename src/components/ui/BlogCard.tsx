import { Link } from 'react-router-dom'
import { Badge } from './Badge'
import { categoryVariant } from './categoryVariant'
import { ArrowIcon } from './Decor'

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
    <Link to={href} className="group block h-full">
      <article className="hub-card h-full p-6 md:p-7 flex flex-col">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            {category && <Badge variant={categoryVariant(category)}>{category}</Badge>}
            {semester && <Badge variant="secondary">{semester}</Badge>}
          </div>
          {date && <span className="font-mono text-xs text-cream/50 whitespace-nowrap">{date}</span>}
        </div>

        <h2 className="text-2xl font-bold text-cream leading-tight mb-2">{title}</h2>
        <p className="body-text text-cream/70 line-clamp-2 mb-5">{excerpt}</p>

        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
          <span className="arrow-bubble"><ArrowIcon /></span>
        </div>
      </article>
    </Link>
  )
}

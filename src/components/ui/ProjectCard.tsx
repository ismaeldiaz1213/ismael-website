import { Link } from 'react-router-dom'
import { Badge } from './Badge'
import { ArrowIcon } from './Decor'
import type { Project } from '../../lib/projects'

interface ProjectCardProps {
  project: Project
  /** Datasheet-style part number, e.g. 1 → PRJ-001 */
  partNo: number
  /** Spans the full row with the image beside the text */
  wide?: boolean
}

export function ProjectCard({ project, partNo, wide = false }: ProjectCardProps) {
  const { slug, title, excerpt, tags, date, category, cover, coverFit } = project
  const contain = coverFit === 'contain'

  const image = cover ? (
    <img
      src={cover}
      alt=""
      className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 ${contain ? 'object-contain bg-white p-5' : 'object-cover'}`}
    />
  ) : (
    <div className="hero-board absolute inset-0 flex items-center justify-center">
      <span className="font-mono text-cream/40 text-sm">no photo yet</span>
    </div>
  )

  return (
    <Link
      to={`/projects/${slug}`}
      className={`group surface surface-hover overflow-hidden flex flex-col ${wide ? 'md:col-span-2 md:grid md:grid-cols-[1.25fr_1fr]' : ''}`}
    >
      <div className={`relative overflow-hidden bg-navy-2 ${wide ? 'aspect-[16/10] md:aspect-auto md:min-h-[360px]' : 'aspect-[16/10]'}`}>
        {image}
        <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-night/70 backdrop-blur font-mono text-xs text-cream">
          PRJ-{String(partNo).padStart(3, '0')}
        </span>
      </div>

      <div className={`flex flex-col flex-1 p-6 ${wide ? 'md:p-10 md:justify-center' : 'md:p-7'}`}>
        <div className="flex items-center gap-2 mb-3">
          {category && <Badge variant={category.toLowerCase() === 'hardware' ? 'orange' : 'primary'}>{category}</Badge>}
          {date && <span className="font-mono text-xs text-cream/45">{date.slice(0, 4)}</span>}
        </div>
        <h2 className={`font-bold text-cream leading-tight mb-3 ${wide ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>{title}</h2>
        {excerpt && <p className="body-text text-cream/70 mb-5">{excerpt}</p>}
        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {tags?.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
          <span className="arrow-bubble"><ArrowIcon /></span>
        </div>
      </div>
    </Link>
  )
}

import { Link } from 'react-router-dom'
import { ArrowIcon } from './Decor'

interface FeatureCardProps {
  title: string
  description: string
  image: string
  imageAlt?: string
  href: string
  /** Small label pinned to the top-left of the image */
  tag?: string
  /** Sizing classes; defaults to a fixed aspect ratio */
  className?: string
}

/** Big photo card with the title over a gradient and an arrow bubble. */
export function FeatureCard({ title, description, image, imageAlt = '', href, tag, className = 'aspect-[4/3] md:aspect-[16/11]' }: FeatureCardProps) {
  return (
    <Link to={href} className={`group block relative overflow-hidden rounded-[2rem] border border-white/10 ${className}`}>
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
      {tag && (
        <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-night/60 backdrop-blur text-cream text-xs font-medium">
          {tag}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-7 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-cream mb-1.5">{title}</h3>
          <p className="body-text text-cream/75 text-sm md:text-base leading-relaxed">{description}</p>
        </div>
        <span className="arrow-bubble w-12 h-12"><ArrowIcon className="w-5 h-5" /></span>
      </div>
    </Link>
  )
}

import { Link } from 'react-router-dom'
import { AnchorNavigator, type Heading } from '../AnchorNavigator'
import { ArrowIcon } from './Decor'

interface DetailPageLayoutProps {
  backHref: string
  backLabel: string
  backNavLabel: string
  backNavDescription: string
  title: string
  date?: string
  tags?: string[]
  headings?: Heading[]
  children: React.ReactNode
}

export function DetailPageLayout({
  backHref,
  backLabel,
  backNavLabel,
  backNavDescription,
  title,
  date,
  tags,
  headings,
  children,
}: DetailPageLayoutProps) {
  return (
    <main className="min-h-[calc(100vh-80px)] px-3 sm:px-4 pt-6">
      <section className="detail-header max-w-6xl mx-auto px-6 py-12 md:px-12 md:py-16 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-50 pointer-events-none" />
        <div className="relative max-w-3xl">
          <Link
            to={backHref}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/10 text-cream/90 text-sm hover:bg-white/20 transition-colors"
          >
            <ArrowIcon className="w-4 h-4 rotate-180" /> {backLabel}
          </Link>

          <h1 className="c-text text-4xl md:text-6xl font-bold leading-[1.05] mb-5">{title}</h1>

          <div className="flex flex-wrap items-center gap-2">
            {date && <span className="font-mono text-xs text-cream/60 mr-2">{date}</span>}
            {tags?.map((tag) => (
              <span key={tag} className="tag-pill px-3 py-1 text-xs rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <article className="py-14 px-3">
        <div className="max-w-3xl mx-auto">
          {headings && <AnchorNavigator headings={headings} />}

          <div className="prose prose-invert prose-lg max-w-none">{children}</div>

          <section className="mt-16">
            <Link to={backHref} className="group block">
              <div className="surface surface-hover p-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-cream mb-1">{backNavLabel.replace(/^←\s*/, '')}</h3>
                  <p className="body-text text-cream/60 text-sm">{backNavDescription}</p>
                </div>
                <span className="arrow-bubble"><ArrowIcon className="w-4 h-4 rotate-180" /></span>
              </div>
            </Link>
          </section>
        </div>
      </article>
    </main>
  )
}

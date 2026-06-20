import { Link } from 'react-router-dom'
import { AnchorNavigator, type Heading } from '../AnchorNavigator'

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
    <main className="min-h-[calc(100vh-80px)]">
      <section className="detail-header py-16 px-6 border-b">
        <div className="max-w-3xl mx-auto">
          <Link to={backHref} className="c-accent flex items-center gap-2 mb-6">
            ← {backLabel}
          </Link>

          <h1 className="c-text text-4xl md:text-5xl font-bold mb-3">{title}</h1>

          {tags?.length ? (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) => (
                <span key={tag} className="tag-pill px-3 py-1 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {date && <p className="c-accent opacity-60 text-sm">{date}</p>}
        </div>
      </section>

      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {headings && <AnchorNavigator headings={headings} />}

          <div className="prose prose-invert prose-lg max-w-none">{children}</div>

          <section className="mt-16 pt-8 border-t border-white/10">
            <Link to={backHref} className="group">
              <div className="p-6 rounded-lg border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                  {backNavLabel}
                </h3>
                <p className="text-gray-400 text-sm">{backNavDescription}</p>
              </div>
            </Link>
          </section>
        </div>
      </article>
    </main>
  )
}

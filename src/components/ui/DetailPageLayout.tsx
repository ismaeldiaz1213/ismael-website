import { Link } from 'react-router-dom'
import { AnchorNavigator, type Heading } from '../AnchorNavigator'

interface DetailPageLayoutProps {
  /** Path for the "back" link at the top and bottom of the page. */
  backHref: string
  /** Short label shown in the top back link, e.g. "Back to Projects". */
  backLabel: string
  /** Full label shown in the bottom nav card, e.g. "← Back to All Projects". */
  backNavLabel: string
  /** Description shown below the bottom nav label. */
  backNavDescription: string
  title: string
  date?: string
  tags?: string[]
  /** Headings extracted from markdown — enables the AnchorNavigator sidebar. */
  headings?: Heading[]
  children: React.ReactNode
}

/**
 * Shared layout for project and course detail pages.
 * Renders the page header (back link, title, tags, date), the prose content
 * area, and the "back to list" footer card.
 */
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
      {/* Header */}
      <section
        className="py-16 px-6 border-b"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-detail-header-bg)',
        }}
      >
        <div className="max-w-3xl mx-auto">
          <Link
            to={backHref}
            className="flex items-center gap-2 mb-6"
            style={{ color: 'var(--color-accent)' }}
          >
            ← {backLabel}
          </Link>

          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ color: 'var(--color-text)' }}
          >
            {title}
          </h1>

          {tags?.length ? (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm rounded-full"
                  style={{
                    backgroundColor: 'var(--color-tag-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-accent)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {date && (
            <p className="text-sm" style={{ color: 'var(--color-accent)', opacity: 0.6 }}>
              {date}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {headings && <AnchorNavigator headings={headings} />}

          <div className="prose prose-invert prose-lg max-w-none">{children}</div>

          {/* Bottom nav */}
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

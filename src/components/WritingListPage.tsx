import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from './PageMeta'
import { BlogCard } from './ui/BlogCard'
import { ArrowIcon } from './ui/Decor'
import type { ContentItem } from '../lib/content'

interface WritingListPageProps {
  title: string
  subtitle: string
  accentClass: string
  icon: string
  fetchItems: () => Promise<ContentItem[]>
  basePath: string
  metaDescription: string
  emptyMessage: string
  /** Custom layout for the posts; defaults to a grid of cards */
  renderItems?: (items: ContentItem[]) => React.ReactNode
}

export function WritingListPage({
  title,
  subtitle,
  accentClass,
  icon,
  fetchItems,
  basePath,
  metaDescription,
  emptyMessage,
  renderItems,
}: WritingListPageProps) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetchItems().then((data) => {
      if (mounted) {
        setItems(data)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [fetchItems])

  return (
    <main className={accentClass}>
      <PageMeta title={title} description={metaDescription} />

      <section className="px-3 sm:px-4 pt-6">
        <div className="writing-list-header max-w-6xl mx-auto relative overflow-hidden px-6 py-12 md:px-14 md:py-16">
          <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />
          <span className="absolute -right-6 -bottom-10 text-[11rem] md:text-[14rem] leading-none opacity-15 rotate-12 select-none pointer-events-none" aria-hidden="true">
            {icon}
          </span>
          <div className="relative max-w-2xl">
            <Link
              to="/writing"
              className="writing-list-back inline-flex items-center gap-2 text-sm mb-8 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowIcon className="w-4 h-4 rotate-180" /> Writing
            </Link>
            <h1 className="c-text text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-[-0.035em] mb-4">{title}</h1>
            <p className="body-text text-cream/80 text-lg max-w-xl">{subtitle}</p>
            {!loading && items.length > 0 && (
              <p className="writing-list-count inline-block mt-5 px-3 py-1 rounded-full text-xs font-mono">
                {items.length} {items.length === 1 ? 'post' : 'posts'}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="c-accent opacity-60 text-center py-12">Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-center py-24">
              <span className="text-6xl block mb-6">{icon}</span>
              <h3 className="c-text text-2xl font-semibold mb-3">Nothing yet!</h3>
              <p className="c-accent opacity-60">{emptyMessage}</p>
            </div>
          ) : renderItems ? (
            renderItems(items)
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {items.map((item) => (
                <BlogCard
                  key={item.slug}
                  title={item.title}
                  date={item.date || ''}
                  excerpt={item.excerpt || ''}
                  tags={item.tags}
                  category={item.category}
                  semester={item.semester}
                  href={`${basePath}/${item.slug}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

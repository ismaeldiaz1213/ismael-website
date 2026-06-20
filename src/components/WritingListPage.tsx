import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from './PageMeta'
import { BlogCard } from './ui/BlogCard'
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
    <main className={`c-bg-dark ${accentClass}`}>
      <PageMeta title={title} description={metaDescription} />

      <section className="writing-list-header py-16 px-6 relative overflow-hidden">
        <div className="writing-list-glow absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none opacity-10 -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-6xl mx-auto relative">
          <Link to="/writing" className="writing-list-back inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-100">
            ← Writing
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{icon}</span>
            <h1 className="c-text text-4xl md:text-5xl font-bold">{title}</h1>
          </div>
          <p className="c-text opacity-70 text-lg max-w-2xl">{subtitle}</p>
          {!loading && items.length > 0 && (
            <p className="writing-list-count mt-3 text-sm">
              {items.length} {items.length === 1 ? 'post' : 'posts'}
            </p>
          )}
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="c-accent opacity-60 text-center py-12">Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-center py-24">
              <span className="text-6xl block mb-6">{icon}</span>
              <h3 className="c-text text-2xl font-semibold mb-3">Nothing yet!</h3>
              <p className="c-accent opacity-60">{emptyMessage}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
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

import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { extractHeadings, markdownHeadingComponents, sanitizeSchema } from '../lib/markdown'
import { DetailPageLayout } from './ui'
import { PageMeta } from './PageMeta'
import type { Heading } from './AnchorNavigator'
import type { ContentItem } from '../lib/content'

interface WritingDetailPageProps {
  fetchItem: (slug: string) => Promise<ContentItem | null>
  backHref: string
  backLabel: string
  backNavLabel: string
  backNavDescription: string
  notFoundMessage: string
}

export function WritingDetailPage({
  fetchItem,
  backHref,
  backLabel,
  backNavLabel,
  backNavDescription,
  notFoundMessage,
}: WritingDetailPageProps) {
  const { id } = useParams()
  const slug = id || ''
  const [item, setItem] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const data = await fetchItem(slug)
      if (!mounted) return
      setItem(data)
      setLoading(false)
    })()
    return () => { mounted = false }
  }, [slug, fetchItem])

  useMemo(() => {
    if (!item?.content) return
    setHeadings(extractHeadings(item.content))
  }, [item?.content])

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <div className="c-accent">Loading…</div>
      </main>
    )
  }

  if (!item) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="c-text text-3xl font-bold mb-4">{notFoundMessage}</h1>
          <Link to={backHref} className="c-accent">← {backLabel}</Link>
        </div>
      </main>
    )
  }

  return (
    <>
      <PageMeta title={item.title} description={item.excerpt || `${item.title} — by Ismael Diaz`} />
      <DetailPageLayout
        backHref={backHref}
        backLabel={backLabel}
        backNavLabel={backNavLabel}
        backNavDescription={backNavDescription}
        title={item.title}
        date={item.date}
        tags={item.tags}
        headings={headings}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
          components={markdownHeadingComponents}
        >
          {item.content}
        </ReactMarkdown>
      </DetailPageLayout>
    </>
  )
}

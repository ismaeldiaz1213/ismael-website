import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { getPost, type Post } from '../lib/posts'
import { extractHeadings, markdownHeadingComponents } from '../lib/markdown'
import { DetailPageLayout } from '../components/ui'
import type { Heading } from '../components/AnchorNavigator'

export function DukeThoughtDetail() {
  const { id } = useParams()
  const slug = id || ''
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const p = await getPost(slug)
      if (!mounted) return
      setPost(p)
      setLoading(false)
    })()
    return () => { mounted = false }
  }, [slug])

  useMemo(() => {
    if (!post?.content) return
    setHeadings(extractHeadings(post.content))
  }, [post?.content])

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <div className="text-center" style={{ color: 'var(--color-accent)' }}>Loading…</div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Post not found</h1>
          <Link to="/duke-courses" style={{ color: 'var(--color-accent)' }}>← Back to Duke Courses</Link>
        </div>
      </main>
    )
  }

  return (
    <DetailPageLayout
      backHref="/duke-courses"
      backLabel="Back to Duke Courses"
      backNavLabel="← Back to All Posts"
      backNavDescription="See other thoughts and reflections"
      title={post.title}
      date={post.date}
      tags={post.tags}
      headings={headings}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={markdownHeadingComponents}
      >
        {post.content}
      </ReactMarkdown>
    </DetailPageLayout>
  )
}

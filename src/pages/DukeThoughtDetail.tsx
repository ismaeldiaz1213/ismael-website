import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { getPost, type Post } from '../lib/posts'

export function DukeThoughtDetail() {
  const { id } = useParams()
  const slug = id || ''
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const p = await getPost(slug)
      if (!mounted) return
      setPost(p)
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [slug])

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
          <Link to="/duke-courses" style={{ color: 'var(--color-accent)' }}>
            ← Back to Duke Courses
          </Link>
        </div>
      </main>
    )
  }
  // TODO: Add AnchorNavigator to each page.

  return (
    <main className="min-h-[calc(100vh-80px)]">
      {/* Header with background */}
      <section className="py-16 px-6 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'rgba(23, 66, 91, 0.3)' }}>
        <div className="max-w-3xl mx-auto">
          <Link to="/duke-courses" className="flex items-center gap-2 mb-6" style={{ color: 'var(--color-accent)' }}>
            ← Back to Duke Courses
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>{post.title}</h1>
          {post.tags?.length ? (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm rounded-full"
                  style={{ backgroundColor: 'rgba(129, 195, 215, 0.1)', border: '1px solid var(--color-border)', color: 'var(--color-accent)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <p style={{ color: 'var(--color-accent)', opacity: 0.6 }} className="text-sm">{post.date}</p>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Related or next steps */}
          <section className="mt-16 pt-8 border-t border-white/10">
            <div className="grid md:grid-cols-2 gap-6">
              <Link to="/duke-courses" className="group">
                <div className="p-6 rounded-lg border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">← Back to All Posts</h3>
                  <p className="text-gray-400 text-sm">See other thoughts and reflections</p>
                </div>
              </Link>

              {/* Removed: Discuss This Course per request */}
            </div>
          </section>
        </div>
      </article>
    </main>
  )
}

import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { getProject, type Project } from '../lib/projects'
import { AnchorNavigator, type Heading } from '../components/AnchorNavigator'

export function ProjectDetail() {
  const { id } = useParams()
  const slug = id || ''
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const p = await getProject(slug)
      if (!mounted) return
      setProject(p)
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [slug])

  // Extract headings from markdown
  useMemo(() => {
    if (!project?.content) return
    
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const extractedHeadings: Heading[] = []
    let match

    while ((match = headingRegex.exec(project.content)) !== null) {
      const level = match[1].length
      const text = match[2]
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')

      extractedHeadings.push({ id, text, level })
    }

    setHeadings(extractedHeadings)
  }, [project?.content])

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <div className="text-center" style={{ color: 'var(--color-accent)' }}>Loading…</div>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Project not found</h1>
          <Link to="/projects" style={{ color: 'var(--color-accent)' }}>
            ← Back to Projects
          </Link>
        </div>
      </main>
    )
  }

  // Custom markdown components to add IDs to headings
  const markdownComponents: Record<string, React.ComponentType<any>> = {
    h2: ({ children }: any) => {
      const text = Array.isArray(children) ? children.join('') : String(children)
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      return <h2 id={id} className="scroll-mt-24">{children}</h2>
    },
    h3: ({ children }: any) => {
      const text = Array.isArray(children) ? children.join('') : String(children)
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      return <h3 id={id} className="scroll-mt-24">{children}</h3>
    },
  }

  return (
    <main className="min-h-[calc(100vh-80px)]">
      {/* Header with background */}
      <section className="py-16 px-6 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'rgba(23, 66, 91, 0.3)' }}>
        <div className="max-w-3xl mx-auto">
          <Link to="/projects" className="flex items-center gap-2 mb-6" style={{ color: 'var(--color-accent)' }}>
            ← Back to Projects
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>{project.title}</h1>
          {project.tags?.length ? (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag: string) => (
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
          <p style={{ color: 'var(--color-accent)', opacity: 0.6 }} className="text-sm">{project.date}</p>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnchorNavigator headings={headings} />
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={markdownComponents}
            >
              {project.content}
            </ReactMarkdown>
          </div>

          {/* Related or next steps */}
          <section className="mt-16 pt-8 border-t border-white/10">
            <Link to="/projects" className="group">
              <div className="p-6 rounded-lg border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">← Back to All Projects</h3>
                <p className="text-gray-400 text-sm">See other projects and work</p>
              </div>
            </Link>
          </section>
        </div>
      </article>
    </main>
  )
}


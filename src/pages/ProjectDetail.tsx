import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { getProject, type Project } from '../lib/projects'
import { extractHeadings, markdownHeadingComponents } from '../lib/markdown'
import { DetailPageLayout } from '../components/ui'
import { PageMeta } from '../components/PageMeta'
import type { Heading } from '../components/AnchorNavigator'

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
    return () => { mounted = false }
  }, [slug])

  useMemo(() => {
    if (!project?.content) return
    setHeadings(extractHeadings(project.content))
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
          <Link to="/projects" style={{ color: 'var(--color-accent)' }}>← Back to Projects</Link>
        </div>
      </main>
    )
  }

  return (
    <>
      <PageMeta
        title={`${project.title}`}
        description={`${project.title} — an engineering project by Ismael Diaz, ECE + CS student at Duke University.`}
      />
      <DetailPageLayout
        backHref="/projects"
        backLabel="Back to Projects"
        backNavLabel="← Back to All Projects"
        backNavDescription="See other projects and work"
        title={project.title}
        date={project.date}
        tags={project.tags}
        headings={headings}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={markdownHeadingComponents}
        >
          {project.content}
        </ReactMarkdown>
      </DetailPageLayout>
    </>
  )
}

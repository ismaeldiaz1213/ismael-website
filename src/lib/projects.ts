type FrontMatter = {
  title?: string
  date?: string
  tags?: string[]
  excerpt?: string
  category?: string
  semester?: string
}

function parseFrontmatter(raw: string): FrontMatter {
  const lines = raw.split(/\r?\n/).map((l) => l.trim())
  const out: FrontMatter = {}
  for (const line of lines) {
    if (!line) continue
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (key === 'tags') {
      const m = val.match(/\[(.*)\]/)
      if (m) {
        const items = m[1]
          .split(',')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean)
        out.tags = items
      }
    } else if (key === 'date') {
      out.date = val
    } else if (key === 'title') {
      out.title = val
    } else if (key === 'excerpt') {
      out.excerpt = val
    } else if (key === 'category') {
      out.category = val
    } else if (key === 'semester') {
      out.semester = val
    }
  }
  return out
}

// Updated to use `query: '?raw', import: 'default'` per deprecation notice
const modules = import.meta.glob('../content/projects/*.md', { query: '?raw', import: 'default' })

export type Project = {
  slug: string
  title: string
  date?: string
  tags?: string[]
  excerpt?: string
  category?: string
  semester?: string
  content: string
}

export async function getProjects(): Promise<Project[]> {
  const entries = Object.entries(modules) as [string, () => Promise<string>][]
  const projects = await Promise.all(
    entries.map(async ([path, resolver]) => {
      const raw = await resolver()
      const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/) 
      let fm: FrontMatter = {}
      let content = raw
      if (fmMatch) {
        fm = parseFrontmatter(fmMatch[1])
        content = raw.slice(fmMatch[0].length)
      }
      const slugMatch = path.match(/\/([\w-]+)\.md$/)
      const slug = slugMatch ? slugMatch[1] : path
      const excerpt = fm.excerpt || (content.split(/\n\n/)[0] || '').replace(/\n/g, ' ').slice(0, 300)
      return {
        slug,
        title: fm.title || slug,
        date: fm.date,
        tags: fm.tags,
        excerpt,
        category: (fm as any).category,
        semester: (fm as any).semester,
        content,
      } as Project
    }),
  )

  projects.sort((a, b) => {
    if (!a.date || !b.date) return 0
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return projects
}

export async function getProject(slug: string): Promise<Project | null> {
  const entries = Object.entries(modules) as [string, () => Promise<string>][]
  for (const [path, resolver] of entries) {
    if (path.endsWith(`/${slug}.md`)) {
      const raw = await resolver()
      const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/) 
      let fm: FrontMatter = {}
      let content = raw
      if (fmMatch) {
        fm = parseFrontmatter(fmMatch[1])
        content = raw.slice(fmMatch[0].length)
      }
      return {
        slug,
        title: fm.title || slug,
        date: fm.date,
        tags: fm.tags,
        excerpt: fm.excerpt,
        category: (fm as any).category,
        semester: (fm as any).semester,
        content,
      }
    }
  }
  return null
}

interface FrontMatter {
  title?: string
  date?: string
  tags?: string[]
  excerpt?: string
  category?: string
  semester?: string
  published?: boolean
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
    // remove surrounding quotes if present
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (key === 'tags') {
      // try to parse bracketed list: [a,b]
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
    } else if (key === 'published') {
      out.published = val.toLowerCase() === 'true'
    }
  }
  return out
}

// Use Vite's glob to load markdown files as raw text
// Updated to use `query: '?raw', import: 'default'` per deprecation notice
const modules = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default' })

export interface Post {
  slug: string
  title: string
  date?: string
  tags?: string[]
  excerpt?: string
  category?: string
  semester?: string
  content: string
  published: boolean
}

export async function getPosts(): Promise<Post[]> {
  const entries = Object.entries(modules) as [string, () => Promise<string>][]
  const posts = await Promise.all(
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
        category: fm.category,
        semester: fm.semester,
        content,
        published: fm.published !== false,
      } satisfies Post
    }),
  )

  // Filter published posts and sort by date (newest first)
  const publishedPosts = posts.filter((p) => p.published)
  publishedPosts.sort((a, b) => {
    if (!a.date || !b.date) return 0
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return publishedPosts
}

export async function getPost(slug: string): Promise<Post | null> {
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
        category: fm.category,
        semester: fm.semester,
        content,
        published: fm.published !== false,
      } satisfies Post
    }
  }
  return null
}

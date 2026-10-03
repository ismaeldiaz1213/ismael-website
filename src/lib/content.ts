export interface FrontMatter {
  title?: string
  date?: string
  tags?: string[]
  excerpt?: string
  category?: string
  semester?: string
  published?: boolean
  rating?: number
  cover?: string
  coverFit?: string
}

export interface ContentItem {
  slug: string
  title: string
  date?: string
  tags?: string[]
  excerpt?: string
  category?: string
  semester?: string
  content: string
  published: boolean
  rating?: number
  /** Image for cards: the `cover` frontmatter, else the first image in the post */
  cover?: string
  /** "contain" for diagrams/charts that shouldn't be cropped */
  coverFit?: 'cover' | 'contain'
}

/** First markdown or <img> image path in a post body. */
function firstImage(content: string): string | undefined {
  const m = content.match(/!\[[^\]]*\]\(([^)\s]+)/) ?? content.match(/<img[^>]+src=["']([^"']+)["']/)
  return m?.[1]
}

export function parseFrontmatter(raw: string): FrontMatter {
  const lines = raw.split(/\r?\n/).map((l) => l.trim())
  const out: FrontMatter = {}
  for (const line of lines) {
    if (!line) continue
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (key === 'tags') {
      const m = val.match(/\[(.*)\]/)
      if (m) {
        out.tags = m[1]
          .split(',')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean)
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
    } else if (key === 'rating') {
      out.rating = parseFloat(val)
    } else if (key === 'cover') {
      out.cover = val
    } else if (key === 'coverFit') {
      out.coverFit = val
    }
  }
  return out
}

export async function loadAllContent(
  modules: Record<string, () => Promise<unknown>>
): Promise<ContentItem[]> {
  const entries = Object.entries(modules) as [string, () => Promise<string>][]
  const items = await Promise.all(
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
      const excerpt =
        fm.excerpt ||
        (content.split(/\n\n/)[0] || '').replace(/\n/g, ' ').slice(0, 300)
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
        rating: fm.rating,
        cover: fm.cover ?? firstImage(content),
        coverFit: fm.coverFit === 'contain' ? 'contain' : 'cover',
      } satisfies ContentItem
    })
  )
  const published = items.filter((i) => i.published)
  published.sort((a, b) => {
    if (!a.date || !b.date) return 0
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
  return published
}

export async function loadSingleContent(
  modules: Record<string, () => Promise<unknown>>,
  slug: string
): Promise<ContentItem | null> {
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
        rating: fm.rating,
        cover: fm.cover ?? firstImage(content),
        coverFit: fm.coverFit === 'contain' ? 'contain' : 'cover',
      } satisfies ContentItem
    }
  }
  return null
}

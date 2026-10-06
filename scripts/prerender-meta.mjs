// Runs after `vite build`. The site is a single-page app, so every URL serves
// the same index.html, and link previewers (iMessage, LinkedIn, Discord, Slack…)
// don't run JavaScript. They only ever saw the home page's title.
//
// This writes one HTML file per route (dist/projects/vending-machine.html, …)
// with that page's title, description, and preview image baked into the
// <head>. Vercel serves a matching file before falling back to index.html
// (see "cleanUrls" in vercel.json), and the app boots exactly the same.

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

const SITE = 'https://ismaeldiaz.com'
const NAME = 'Ismael Diaz'
const DEFAULT_IMAGE = '/og-default.jpg'
const DIST = 'dist'

const template = readFileSync(join(DIST, 'index.html'), 'utf8')

// ── Static pages ────────────────────────────────────────────────────────────

const pages = [
  { path: '/projects', title: `Projects | ${NAME}`, description: 'Engineering projects by Ismael Diaz, ECE + CS student at Duke University: embedded systems, FPGA, hardware, and software.' },
  { path: '/writing', title: `Writing | ${NAME}`, description: 'Everything Ismael Diaz writes about: Duke courses, devlogs, game reviews, recipes, experiences, and faith.' },
  { path: '/games', title: `Games | ${NAME}`, description: 'Small games made by Ismael Diaz, playable in the browser.' },
  { path: '/misc', title: `Misc | ${NAME}`, description: "Miscellaneous stuff on Ismael Diaz's website. Truly unpredictable." },
  { path: '/weather', title: `Big Brain Weather | ${NAME}`, description: 'Live weather for Houston and Durham with nerdy atmospheric stats.' },
  { path: '/resume', title: `Resume | ${NAME}`, description: 'Resume of Ismael Diaz, ECE + CS student at Duke University.' },
  { path: '/writing/duke-courses', title: `Duke Courses | ${NAME}`, description: "Ismael Diaz's honest reflections on Duke University ECE and CS courses." },
  { path: '/writing/devlogs', title: `Devlogs | ${NAME}`, description: "Devlogs from Ismael Diaz on games and side projects he's built." },
  { path: '/writing/game-reviews', title: `Game Reviews | ${NAME}`, description: "Ismael Diaz's video game reviews and impressions." },
  { path: '/writing/recipes', title: `Recipes | ${NAME}`, description: 'Recipes and cooking notes from Ismael Diaz.' },
  { path: '/writing/experiences', title: `Experiences | ${NAME}`, description: 'Stories and experiences from Ismael Diaz.' },
  { path: '/writing/bible', title: `Bible | ${NAME}`, description: 'Bible reflections and faith writing by Ismael Diaz.' },
]

// ── Markdown posts ──────────────────────────────────────────────────────────

/** content folder → URL prefix, matching the routes in src/main.tsx */
const collections = {
  projects: '/projects',
  posts: '/writing/duke-courses',
  devlogs: '/writing/devlogs',
  game_reviews: '/writing/game-reviews',
  recipes: '/writing/recipes',
  experiences: '/writing/experiences',
  bible: '/writing/bible',
}

/** Same rules as parseFrontmatter in src/lib/content.ts, minus the parts we don't need. */
function frontmatter(raw) {
  const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const out = {}
  if (!block) return out
  for (const line of block[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    if (/^(".*"|'.*')$/.test(val)) val = val.slice(1, -1)
    out[key] = val
  }
  return out
}

function firstImage(raw) {
  const m = raw.match(/!\[[^\]]*\]\(([^)\s]+)/) ?? raw.match(/<img[^>]+src=["']([^"']+)["']/)
  return m?.[1]
}

for (const [folder, prefix] of Object.entries(collections)) {
  const dir = join('src/content', folder)
  if (!existsSync(dir)) continue
  for (const file of readdirSync(dir).filter(f => f.endsWith('.md'))) {
    const raw = readFileSync(join(dir, file), 'utf8')
    const fm = frontmatter(raw)
    if (fm.published !== 'true') continue
    const slug = file.replace(/\.md$/, '')
    pages.push({
      path: `${prefix}/${slug}`,
      title: `${fm.title || slug} | ${NAME}`,
      ogTitle: fm.title || slug,
      description: fm.excerpt || `${fm.title || slug}, by Ismael Diaz.`,
      image: fm.cover || firstImage(raw),
      type: 'article',
    })
  }
}

// ── Write the files ─────────────────────────────────────────────────────────

const escape = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const absolute = url => (/^https?:\/\//.test(url) ? url : SITE + (url.startsWith('/') ? url : `/${url}`))

/** Swap the content="" of a tag already in index.html, matched by its name/property. */
function setTag(html, attr, key, value) {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`)
  if (!re.test(html)) throw new Error(`index.html is missing <meta ${attr}="${key}">`)
  return html.replace(re, `$1${escape(value)}$2`)
}

function render(page) {
  const url = SITE + page.path
  const image = absolute(page.image || DEFAULT_IMAGE)
  const ogTitle = page.ogTitle || page.title
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`)
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
  html = setTag(html, 'name', 'description', page.description)
  html = setTag(html, 'property', 'og:title', ogTitle)
  html = setTag(html, 'property', 'og:description', page.description)
  html = setTag(html, 'property', 'og:type', page.type || 'website')
  html = setTag(html, 'property', 'og:url', url)
  html = setTag(html, 'property', 'og:image', image)
  html = setTag(html, 'name', 'twitter:title', ogTitle)
  html = setTag(html, 'name', 'twitter:description', page.description)
  html = setTag(html, 'name', 'twitter:image', image)
  return html
}

for (const page of pages) {
  const out = join(DIST, `${page.path}.html`)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, render(page))
}

console.log(`prerender-meta: wrote ${pages.length} pages with their own link previews`)

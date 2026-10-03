import { Link } from 'react-router-dom'
import { ArrowIcon } from './ui/Decor'
import type { ContentItem } from '../lib/content'

const SEMESTER = /^(Spring|Summer|Fall) (\d{4})$/
const SEASON_ORDER: Record<string, number> = { Spring: 0, Summer: 1, Fall: 2 }

type Course = {
  item: ContentItem
  code?: string   // "ECE 552"
  name: string    // "Advanced Computer Architecture I"
  prof?: string
  semester?: string
}

/** Pulls course code, professor and semester out of the title and tags. */
function toCourse(item: ContentItem): Course {
  const codeMatch = item.title.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  const profTag = item.tags?.find(t => /^Profs?:/.test(t))
  const prof = profTag?.split(':').slice(1).join(':').trim()
  return {
    item,
    name: codeMatch ? codeMatch[1] : item.title,
    code: codeMatch?.[2],
    prof: prof || undefined,
    semester: item.tags?.find(t => SEMESTER.test(t)),
  }
}

/** Newest semester first. */
function semesterKey(s?: string) {
  const m = s?.match(SEMESTER)
  return m ? Number(m[2]) * 10 + SEASON_ORDER[m[1]] : -1
}

/** Duke courses grouped by semester, like a transcript. */
export function CourseTranscript({ items }: { items: ContentItem[] }) {
  const groups = new Map<string, Course[]>()
  for (const course of items.map(toCourse)) {
    const key = course.semester ?? 'Other'
    groups.set(key, [...(groups.get(key) ?? []), course])
  }
  const ordered = [...groups.entries()].sort(([a], [b]) => semesterKey(b) - semesterKey(a))

  return (
    <div className="space-y-10">
      {ordered.map(([semester, courses]) => (
        <section key={semester}>
          <div className="flex items-baseline justify-between gap-4 mb-3 px-2">
            <h2 className="text-3xl font-bold text-cream">{semester}</h2>
            <span className="font-mono text-xs text-cream/45">
              {courses.length} {courses.length === 1 ? 'course' : 'courses'}
            </span>
          </div>
          <ul className="surface p-2 divide-y divide-white/10">
            {courses.map(({ item, code, name, prof }) => (
              <li key={item.slug}>
                <Link
                  to={`/writing/duke-courses/${item.slug}`}
                  className="group grid grid-cols-[1fr_auto] sm:grid-cols-[7.5rem_1fr_auto] md:grid-cols-[7.5rem_1fr_10rem_auto] items-center gap-x-5 gap-y-2 px-4 py-5 rounded-2xl hover:bg-white/[0.04] transition-colors"
                >
                  <span className="hidden sm:inline-flex justify-center px-3 py-1 rounded-full bg-sky/10 text-sky font-mono text-xs whitespace-nowrap">
                    {code ?? '—'}
                  </span>
                  <div className="min-w-0">
                    <p className="sm:hidden font-mono text-xs text-sky mb-1">{code}</p>
                    <h3 className="text-xl font-bold text-cream leading-snug">{name}</h3>
                    {item.excerpt && <p className="body-text text-sm text-cream/60 truncate">{item.excerpt}</p>}
                  </div>
                  <span className="hidden md:block font-mono text-xs text-cream/50 truncate">{prof ? `Prof. ${prof}` : ''}</span>
                  <ArrowIcon className="w-5 h-5 text-cream/40 -rotate-45 group-hover:text-lime group-hover:rotate-0 transition-all" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

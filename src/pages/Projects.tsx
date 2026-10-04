import { useEffect, useMemo, useState } from 'react'
import { Section, HubHero, Sticker, ProjectCard } from '../components/ui'
import { getProjects, type Project } from '../lib/projects'
import { PageMeta } from '../components/PageMeta'


export function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    let mounted = true
    getProjects().then((p) => {
      if (mounted) setProjects(p)
    })
    return () => {
      mounted = false
    }
  }, [])

  // Part numbers go oldest → newest so they never change as new projects ship
  const partNumbers = useMemo(() => {
    const oldestFirst = [...projects].sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
    return new Map(oldestFirst.map((p, i) => [p.slug, i + 1]))
  }, [projects])

  // One filter per category that actually has projects
  const filters = ['All', ...Array.from(new Set(projects.map(p => p.category).filter((c): c is string => !!c)))]
  const count = (f: string) => (f === 'All' ? projects.length : projects.filter(p => p.category === f).length)
  const shown = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <main>
      <PageMeta
        title="Projects"
        description="Engineering projects by Ismael Diaz, ECE + CS student at Duke University — embedded systems, FPGA, hardware, and software."
      />
      <HubHero
        eyebrow="/ projects"
        title="Things I've"
        accent="built."
        subtitle="A showcase of some of my favorite work and the things I've learned along the way."
        bgWord="build"
        sticker={<Sticker tone="lime" tilt="right">works on my machine ✅</Sticker>}
      />

      <Section className="pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-1 p-1 rounded-full bg-white/[0.05] border border-white/10" role="group" aria-label="Filter projects">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f ? 'bg-lime text-night' : 'text-cream/70 hover:text-cream hover:bg-white/10'
                }`}
              >
                {f} <span className="font-mono text-xs opacity-60 ml-0.5">{count(f)}</span>
              </button>
            ))}
          </div>
          <p className="font-mono text-xs text-cream/45">newest first</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {shown.map((p, i) => (
            <ProjectCard key={p.slug} project={p} partNo={partNumbers.get(p.slug) ?? 0} wide={i === 0} />
          ))}
        </div>

        {/* What's still being written up */}
        <div className="mt-16 rounded-[1.75rem] border border-dashed border-white/20 p-7 md:p-10 grid md:grid-cols-[auto_1fr] gap-6 items-start">
          <span className="w-12 h-12 rounded-2xl bg-marigold/15 flex items-center justify-center text-2xl">🧰</span>
          <div>
            <p className="eyebrow text-marigold mb-2">on the bench</p>
            <h3 className="text-2xl md:text-3xl font-bold text-cream mb-3">Want to see more?</h3>
            <p className="body-text text-cream/75 max-w-3xl">
              I'm working on some exciting projects! Check back soon for updates. Projects that I've completed but
              probably haven't finished the write-up on include: Planning Center check-ins reports, my EGR 101 project,
              and some of the research at the CPSL lab I've been doing!
            </p>
          </div>
        </div>
      </Section>
    </main>
  )
}

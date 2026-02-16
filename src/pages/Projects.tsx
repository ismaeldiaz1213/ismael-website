// import { ProjectCard, Section, SectionHeader, Button } from '../components/ui'
import { Section, SectionHeader } from '../components/ui'
import ProjectList from '../components/ui/ProjectList'
import { getProjects } from '../lib/projects'
import { useEffect, useState } from 'react'

export function Projects() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    getProjects().then((p) => {
      if (mounted) setProjects(p)
    })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <main>
      {/* Header */}
      <Section variant="light">
        <SectionHeader
          title="My Projects"
          subtitle="A showcase of some of my favorite work and the things I've learned along the way."
          centered={false}
        />
      </Section>

      {/* Projects Grid */}
      <Section>
        <ProjectList projects={projects} />

        {/* Call to Action */}
        <div className="mt-16 p-8 rounded-lg bg-gradient-to-r from-blue-900/20 to-orange-900/20 border border-purple-500/30 text-center">
          <h3 className="text-2xl font-bold text-slate-100 mb-2">Want to see more?</h3>
          <p className="text-slate-300">
            I'm working on some exciting projects! Check back soon for updates.
          </p>
        </div>
      </Section>
    </main>
  )
}


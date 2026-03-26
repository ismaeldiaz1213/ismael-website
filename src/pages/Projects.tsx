import { Section, SectionHeader, CTABox } from '../components/ui'
import ProjectList from '../components/ui/ProjectList'
import { getProjects, type Project } from '../lib/projects'
import { useEffect, useState } from 'react'

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([])

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
        <CTABox
          title="Want to see more?"
          description="I'm working on some exciting projects! Check back soon for updates."
        />
      </Section>
    </main>
  )
}


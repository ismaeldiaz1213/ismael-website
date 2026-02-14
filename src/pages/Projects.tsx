// import { ProjectCard, Section, SectionHeader, Button } from '../components/ui'
import { Section, SectionHeader } from '../components/ui'

export function Projects() {
//   const projects = [
//     {
//       id: 1,
//       title: '[Project Title #1]',
//       description: '[Brief description of your first project. What was the problem? What technologies did you use? What was the impact?]',
//       tags: ['React', 'TypeScript', 'Tailwind CSS'],
//       date: 'January 2026',
//       icon: '🚀',
//     },
//     {
//       id: 2,
//       title: '[Project Title #2]',
//       description: '[Brief description of your second project. What problem did it solve? What technologies were involved? What did you learn?]',
//       tags: ['Python', 'Machine Learning', 'Data Science'],
//       date: 'December 2025',
//       icon: '🤖',
//     },
//   ]

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
        {/* <div className="space-y-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div> */}

        {/* Call to Action */}
        <div className="mt-16 p-8 rounded-lg bg-gradient-to-r from-blue-900/20 to-orange-900/20 border border-purple-500/30 text-center">
          <h3 className="text-2xl font-bold text-slate-100 mb-2">Coming Soon</h3>
          <p className="text-slate-300">
            I'm working on some exciting projects! Check back soon for updates.
          </p>
        </div>
      </Section>
    </main>
  )
}


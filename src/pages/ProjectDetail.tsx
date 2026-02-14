import { useParams, Link } from 'react-router-dom'

export function ProjectDetail() {
  const { id } = useParams()

  const projectsData = {
    '1': {
      title: '[Project Title #1]',
      date: 'January 2026',
      description: '[Detailed description of your first project goes here. Talk about the problem you were trying to solve, the approach you took, the challenges you faced, and the outcome.]',
      tags: ['React', 'TypeScript', 'Tailwind CSS'],
      content: `[Your detailed project writeup goes here]

You can write about:
- The motivation behind the project
- The technologies you used and why
- The key challenges and how you solved them
- The results and learnings
- Screenshots, code snippets, or demos

[Feel free to add multiple paragraphs and structure this however you like]`,
      links: {
        demo: 'https://example.com',
        github: 'https://github.com',
      },
      image: '🚀',
    },
    '2': {
      title: '[Project Title #2]',
      date: 'December 2025',
      description: '[Detailed description of your second project goes here. Talk about what you built, why it matters, and what you learned in the process.]',
      tags: ['Python', 'Machine Learning', 'Data Science'],
      content: `[Your detailed project writeup goes here]

Share your process and insights:
- What problem were you solving?
- How did you approach the solution?
- What did you learn?
- What would you do differently?
- Key achievements

[Add as much detail as you want]`,
      links: {
        demo: 'https://example.com',
        github: 'https://github.com',
      },
      image: '🤖',
    },
  }

  const project = projectsData[id as keyof typeof projectsData]

  if (!project) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Project not found</h1>
          <Link to="/projects" className="text-purple-400 hover:text-purple-300">
            ← Back to projects
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-80px)]">
      {/* Header with image placeholder */}
      <section className="h-96 bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-b border-white/10 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-gray-900/20"></div>
        <div className="relative z-10 text-8xl">{project.image}</div>
      </section>

      {/* Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Navigation */}
          <Link to="/projects" className="text-purple-400 hover:text-purple-300 flex items-center gap-2 mb-8">
            ← Back to all projects
          </Link>

          {/* Title and metadata */}
          <header className="mb-12 border-b border-white/10 pb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {project.title}
            </h1>
            <p className="text-gray-400 mb-4">{project.date}</p>
            <p className="text-xl text-gray-300 mb-6">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-white/10 border border-white/20 text-gray-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all"
                >
                  View Demo
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-lg transition-all"
                >
                  View Code
                </a>
              )}
            </div>
          </header>

          {/* Main content */}
          <div className="prose prose-invert prose-lg max-w-none">
            {project.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-300 mb-6 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-white/10">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-white mb-3">
                Interested in learning more?
              </h3>
              <p className="text-gray-400 mb-4">
                Feel free to reach out to discuss this project or other opportunities to collaborate.
              </p>
              <a
                href="mailto:[your-email]@example.com"
                className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all"
              >
                Get in Touch
              </a>
            </div>
          </footer>
        </div>
      </article>
    </main>
  )
}

import { BlogCard, Section, SectionHeader } from '../components/ui'

export function DukeThoughts() {
  const posts = [
    {
      id: 1,
      title: '[Course Name/Code]',
      excerpt: '[Brief excerpt or summary of your thoughts on this class. What was it about? What did you learn? What surprised you?]',
      date: 'January 2026',
      tags: ['Duke', 'Coursework', '[Category]'],
    },
    {
      id: 2,
      title: '[Course Name/Code]',
      excerpt: '[Brief excerpt or summary of your thoughts on this class. Was it challenging? Inspiring? What will you take from it?]',
      date: 'December 2025',
      tags: ['Duke', 'Coursework', '[Category]'],
    },
  ]

  return (
    <main>
      {/* Header */}
      <Section variant="gradient">
        <SectionHeader
          title="Duke Courses"
          subtitle="Reflections on my courses and experiences at Duke University."
          centered={false}
        />
      </Section>

      {/* Coming Soon */}
      <Section>
        <div className="text-center py-12">
          <h2 className="text-4xl font-bold text-slate-200 mb-4">Coming Soon</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            I'm working on sharing my thoughts and reflections on the courses I've taken at Duke. Check back soon for updates!
          </p>
        </div>
      </Section>
    </main>
  )
}


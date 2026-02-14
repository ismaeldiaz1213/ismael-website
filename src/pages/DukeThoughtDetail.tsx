import { useParams, Link } from 'react-router-dom'

export function DukeThoughtDetail() {
  const { id } = useParams()

  const postsData = {
    '1': {
      title: '[Course Name/Code]',
      subtitle: '[Professor Name] - Semester Year',
      date: 'January 2026',
      tags: ['Duke', 'Coursework', '[Category]'],
      content: `[Your full thoughts and reflections on this course]

Consider writing about:
- What the course was about
- The most interesting topics covered
- How it challenged you intellectually
- Real-world applications or connections
- How it influenced your thinking
- Advice for future students taking this course
- Key takeaways or lessons learned

[Feel free to write as much or as little as you want]`,
    },
    '2': {
      title: '[Course Name/Code]',
      subtitle: '[Professor Name] - Semester Year',
      date: 'December 2025',
      tags: ['Duke', 'Coursework', '[Category]'],
      content: `[Your full thoughts and reflections on this course]

Share your experience:
- Was it a core requirement or elective?
- What surprised you most?
- How did it compare to your expectations?
- Any memorable projects or assignments?
- Would you recommend it to others?
- How has it influenced your future direction?

[Add as much depth as you want]`,
    },
  }

  const post = postsData[id as keyof typeof postsData]

  if (!post) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Post not found</h1>
          <Link to="/duke-thoughts" className="text-blue-400 hover:text-blue-300">
            ← Back to Duke Thoughts
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-80px)]">
      {/* Header with background */}
      <section className="py-16 px-6 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
        <div className="max-w-3xl mx-auto">
          <Link to="/duke-thoughts" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-6">
            ← Back to Duke Thoughts
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {post.title}
          </h1>
          <p className="text-lg text-gray-400 mb-4">
            {post.subtitle}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-white/10 border border-white/20 text-gray-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
            {post.date}
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert prose-lg max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-300 mb-6 leading-relaxed text-base">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Related or next steps */}
          <section className="mt-16 pt-8 border-t border-white/10">
            <div className="grid md:grid-cols-2 gap-6">
              <Link to="/duke-thoughts" className="group">
                <div className="p-6 rounded-lg border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                    ← Back to All Posts
                  </h3>
                  <p className="text-gray-400 text-sm">
                    See other thoughts and reflections
                  </p>
                </div>
              </Link>

              <a href="mailto:[your-email]@example.com" className="group">
                <div className="p-6 rounded-lg border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                    Discuss This Course →
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Share your thoughts or ask questions
                  </p>
                </div>
              </a>
            </div>
          </section>
        </div>
      </article>
    </main>
  )
}

import { useEffect, useState } from 'react'
import { Section, SectionHeader } from '../components/ui'
import PostList from '../components/ui/PostList'
import { getPosts } from '../lib/posts'

export function DukeThoughts() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    getPosts().then((p) => {
      if (mounted) setPosts(p)
    })
    return () => {
      mounted = false
    }
  }, [])


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

      {/* Posts */}
      <Section>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-slate-100">Coming soon</h3>
            <p className="text-slate-300">No posts yet — create a markdown file in <code>src/content/posts</code> to add one.</p>
          </div>
        ) : (
          <div className="mt-8">
            <PostList posts={posts} />
          </div>
        )}
      </Section>
    </main>
  )
}


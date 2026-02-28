import { useEffect, useState } from 'react'
import { Section, SectionHeader } from '../components/ui'
import PostList from '../components/ui/PostList'
import { getPosts, type Post } from '../lib/posts'

export function DukeThoughts() {
  const [posts, setPosts] = useState<Post[]>([])

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
          subtitle="Reflections on my courses and experiences at Duke University in ways that a course eval maybe can't
          capture. Regardless, it's another way for me to talk about a class."
          centered={false}
        />
      </Section>

      {/* Posts */}
      <Section>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>Coming soon</h3>
            <p style={{ color: 'var(--color-accent)', opacity: 0.7 }}>No posts yet! Slowly but surely these posts will start filtering in!</p>
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


import { BlogCard } from './BlogCard'

interface PostSummary {
  slug: string
  title: string
  date?: string
  excerpt?: string
  tags?: string[]
  category?: string
  semester?: string
}

interface PostListProps {
  posts: PostSummary[]
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {posts.map((p) => (
        <BlogCard
          key={p.slug}
          title={p.title}
          date={p.date || ''}
          excerpt={p.excerpt || ''}
          tags={p.tags}
          category={(p as any).category}
          semester={(p as any).semester}
          href={`/duke-courses/${p.slug}`}
        />
      ))}
    </div>
  )
}

export default PostList

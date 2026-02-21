import { BlogCard } from './BlogCard'
import { type Post } from '../../lib/posts'

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <BlogCard
          key={post.slug}
          title={post.title}
          date={post.date || ''}
          excerpt={post.excerpt || ''}
          tags={post.tags}
          category={post.category}
          semester={post.semester}
          href={`/duke-courses/${post.slug}`}
        />
      ))}
    </div>
  )
}

export default PostList

import { WritingDetailPage } from '../components/WritingDetailPage'
import { getPost } from '../lib/posts'

export function DukeThoughtDetail() {
  return (
    <WritingDetailPage
      fetchItem={getPost}
      backHref="/writing/duke-courses"
      backLabel="Duke Courses"
      backNavLabel="← Back to Duke Courses"
      backNavDescription="See reflections on other courses"
      notFoundMessage="Post not found"
    />
  )
}

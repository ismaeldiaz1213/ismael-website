import { WritingListPage } from '../components/WritingListPage'
import { getPosts } from '../lib/posts'
import { CourseTranscript } from '../components/CourseTranscript'

export function DukeThoughts() {
  return (
    <WritingListPage
      title="Duke Courses"
      subtitle="Reflections on my courses at Duke in ways that a course eval can't capture. Another excuse to talk about class."
      accentClass="section-duke"
      icon="🎓"
      fetchItems={getPosts}
      basePath="/writing/duke-courses"
      metaDescription="Ismael Diaz's honest reflections on Duke University ECE and CS courses."
      emptyMessage="No course posts yet — working on it!"
      renderItems={(items) => <CourseTranscript items={items} />}
    />
  )
}

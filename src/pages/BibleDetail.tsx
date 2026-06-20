import { WritingDetailPage } from '../components/WritingDetailPage'
import { getBiblePost } from '../lib/bible'

export function BibleDetail() {
  return (
    <WritingDetailPage
      fetchItem={getBiblePost}
      backHref="/writing/bible"
      backLabel="Bible"
      backNavLabel="← Back to Bible Reflections"
      backNavDescription="Read more reflections"
      notFoundMessage="Reflection not found"
    />
  )
}

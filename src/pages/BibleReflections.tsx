import { WritingListPage } from '../components/WritingListPage'
import { getBiblePosts } from '../lib/bible'

export function BibleReflections() {
  return (
    <WritingListPage
      title="Bible"
      subtitle="Thoughts and reflections on scripture, faith, and what it means to live it out."
      accentClass="section-bible"
      icon="✝️"
      fetchItems={getBiblePosts}
      basePath="/writing/bible"
      metaDescription="Bible reflections and faith writing by Ismael Diaz."
      emptyMessage="Reflections coming soon."
    />
  )
}

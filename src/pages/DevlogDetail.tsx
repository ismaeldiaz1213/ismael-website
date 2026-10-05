import { WritingDetailPage } from '../components/WritingDetailPage'
import { getDevlog } from '../lib/devlogs'

export function DevlogDetail() {
  return (
    <WritingDetailPage
      fetchItem={getDevlog}
      backHref="/writing/devlogs"
      backLabel="Devlogs"
      backNavLabel="← Back to Devlogs"
      backNavDescription="Browse more devlogs"
      notFoundMessage="Devlog not found"
    />
  )
}

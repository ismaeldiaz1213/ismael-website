import { WritingListPage } from '../components/WritingListPage'
import { getDevlogs } from '../lib/devlogs'

export function Devlogs() {
  return (
    <WritingListPage
      title="Devlogs"
      subtitle="Behind-the-scenes write-ups on things I've built: what I planned, what broke, and what playtesters taught me."
      accentClass="section-devlogs"
      icon="🛠️"
      fetchItems={getDevlogs}
      basePath="/writing/devlogs"
      metaDescription="Devlogs from Ismael Diaz on games and side projects he's built."
      emptyMessage="Nothing logged yet. Still building."
    />
  )
}

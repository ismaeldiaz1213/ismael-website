import { WritingListPage } from '../components/WritingListPage'
import { getExperiences } from '../lib/experiences'

export function Experiences() {
  return (
    <WritingListPage
      title="Experiences"
      subtitle="Road trips, memorable moments, and things I've lived through that felt worth writing down."
      accentClass="section-experiences"
      icon="🗺️"
      fetchItems={getExperiences}
      basePath="/writing/experiences"
      metaDescription="Stories and experiences from Ismael Diaz."
      emptyMessage="No stories published yet — give me time to live them first."
    />
  )
}

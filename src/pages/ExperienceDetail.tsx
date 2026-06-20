import { WritingDetailPage } from '../components/WritingDetailPage'
import { getExperience } from '../lib/experiences'

export function ExperienceDetail() {
  return (
    <WritingDetailPage
      fetchItem={getExperience}
      backHref="/writing/experiences"
      backLabel="Experiences"
      backNavLabel="← Back to Experiences"
      backNavDescription="Read more stories"
      notFoundMessage="Story not found"
    />
  )
}

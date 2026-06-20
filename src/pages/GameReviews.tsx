import { WritingListPage } from '../components/WritingListPage'
import { getGameReviews } from '../lib/gameReviews'

export function GameReviews() {
  return (
    <WritingListPage
      title="Game Reviews"
      subtitle="Games I've played, from quick impressions to full breakdowns. No sponsored content here."
      accentClass="section-games"
      icon="🎮"
      fetchItems={getGameReviews}
      basePath="/writing/game-reviews"
      metaDescription="Ismael Diaz's video game reviews and impressions."
      emptyMessage="Haven't published any reviews yet — check back soon."
    />
  )
}

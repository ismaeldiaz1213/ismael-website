import { WritingDetailPage } from '../components/WritingDetailPage'
import { getGameReview } from '../lib/gameReviews'

export function GameReviewDetail() {
  return (
    <WritingDetailPage
      fetchItem={getGameReview}
      backHref="/writing/game-reviews"
      backLabel="Game Reviews"
      backNavLabel="← Back to Game Reviews"
      backNavDescription="See more reviews"
      notFoundMessage="Review not found"
    />
  )
}

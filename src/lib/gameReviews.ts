import { loadAllContent, loadSingleContent, type ContentItem } from './content'

const modules = import.meta.glob('../content/game_reviews/*.md', { query: '?raw', import: 'default' })

export type GameReview = ContentItem
export const getGameReviews = () => loadAllContent(modules)
export const getGameReview = (slug: string) => loadSingleContent(modules, slug)

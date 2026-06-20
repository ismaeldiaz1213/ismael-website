import { loadAllContent, loadSingleContent, type ContentItem } from './content'

const modules = import.meta.glob('../content/bible/*.md', { query: '?raw', import: 'default' })

export type BiblePost = ContentItem
export const getBiblePosts = () => loadAllContent(modules)
export const getBiblePost = (slug: string) => loadSingleContent(modules, slug)

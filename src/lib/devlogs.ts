import { loadAllContent, loadSingleContent, type ContentItem } from './content'

const modules = import.meta.glob('../content/devlogs/*.md', { query: '?raw', import: 'default' })

export type Devlog = ContentItem
export const getDevlogs = () => loadAllContent(modules)
export const getDevlog = (slug: string) => loadSingleContent(modules, slug)

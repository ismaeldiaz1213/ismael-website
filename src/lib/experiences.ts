import { loadAllContent, loadSingleContent, type ContentItem } from './content'

const modules = import.meta.glob('../content/experiences/*.md', { query: '?raw', import: 'default' })

export type Experience = ContentItem
export const getExperiences = () => loadAllContent(modules)
export const getExperience = (slug: string) => loadSingleContent(modules, slug)

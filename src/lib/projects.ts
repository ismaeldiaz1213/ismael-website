import { loadAllContent, loadSingleContent, type ContentItem } from './content'

const modules = import.meta.glob('../content/projects/*.md', { query: '?raw', import: 'default' })

export type Project = ContentItem
export const getProjects = () => loadAllContent(modules)
export const getProject = (slug: string) => loadSingleContent(modules, slug)

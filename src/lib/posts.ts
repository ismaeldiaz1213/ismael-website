import { loadAllContent, loadSingleContent, type ContentItem } from './content'

const modules = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default' })

export type Post = ContentItem
export const getPosts = () => loadAllContent(modules)
export const getPost = (slug: string) => loadSingleContent(modules, slug)

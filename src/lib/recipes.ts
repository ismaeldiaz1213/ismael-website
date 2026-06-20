import { loadAllContent, loadSingleContent, type ContentItem } from './content'

const modules = import.meta.glob('../content/recipes/*.md', { query: '?raw', import: 'default' })

export type Recipe = ContentItem
export const getRecipes = () => loadAllContent(modules)
export const getRecipe = (slug: string) => loadSingleContent(modules, slug)

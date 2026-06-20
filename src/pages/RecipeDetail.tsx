import { WritingDetailPage } from '../components/WritingDetailPage'
import { getRecipe } from '../lib/recipes'

export function RecipeDetail() {
  return (
    <WritingDetailPage
      fetchItem={getRecipe}
      backHref="/writing/recipes"
      backLabel="Recipes"
      backNavLabel="← Back to Recipes"
      backNavDescription="Browse more recipes"
      notFoundMessage="Recipe not found"
    />
  )
}

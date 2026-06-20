import { WritingListPage } from '../components/WritingListPage'
import { getRecipes } from '../lib/recipes'

export function Recipes() {
  return (
    <WritingListPage
      title="Recipes"
      subtitle="Things I've cooked that actually turned out good. Houston flavors heavily influence this section."
      accentClass="section-recipes"
      icon="🍳"
      fetchItems={getRecipes}
      basePath="/writing/recipes"
      metaDescription="Recipes and cooking notes from Ismael Diaz."
      emptyMessage="Nothing published yet — still cooking (literally)."
    />
  )
}

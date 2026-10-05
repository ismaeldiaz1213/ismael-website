import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBiblePosts } from '../lib/bible'
import { getPosts } from '../lib/posts'
import { getGameReviews } from '../lib/gameReviews'
import { getRecipes } from '../lib/recipes'
import { getExperiences } from '../lib/experiences'
import { getDevlogs } from '../lib/devlogs'
import type { ContentItem } from '../lib/content'
import { ArrowIcon } from './ui/Decor'

type TakeSource = {
  label: string
  accentClass: string
  basePath: string
  icon: string
}

const SOURCE_MAP: Record<string, TakeSource> = {
  duke:         { label: 'Duke Courses', accentClass: 'section-duke',        basePath: '/writing/duke-courses', icon: '🎓' },
  bible:        { label: 'Bible',        accentClass: 'section-bible',       basePath: '/writing/bible',        icon: '📖' },
  games:        { label: 'Game Reviews', accentClass: 'section-games',       basePath: '/writing/game-reviews', icon: '🎮' },
  recipes:      { label: 'Recipes',      accentClass: 'section-recipes',     basePath: '/writing/recipes',      icon: '🍳' },
  experiences:  { label: 'Experiences',  accentClass: 'section-experiences', basePath: '/writing/experiences',  icon: '✈️'  },
  devlogs:      { label: 'Devlogs',      accentClass: 'section-devlogs',     basePath: '/writing/devlogs',      icon: '🛠️' },
}

type TakeItem = ContentItem & { sourceKey: string }

export function RecentTakes({ limit = 4 }: { limit?: number }) {
  const [takes, setTakes] = useState<TakeItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const [duke, bible, games, recipes, experiences, devlogs] = await Promise.all([
        getPosts(),
        getBiblePosts(),
        getGameReviews(),
        getRecipes(),
        getExperiences(),
        getDevlogs(),
      ])
      if (!mounted) return

      const tagged: TakeItem[] = [
        ...duke.map((p) => ({ ...p, sourceKey: 'duke' })),
        ...bible.map((p) => ({ ...p, sourceKey: 'bible' })),
        ...games.map((p) => ({ ...p, sourceKey: 'games' })),
        ...recipes.map((p) => ({ ...p, sourceKey: 'recipes' })),
        ...experiences.map((p) => ({ ...p, sourceKey: 'experiences' })),
        ...devlogs.map((p) => ({ ...p, sourceKey: 'devlogs' })),
      ]

      tagged.sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())

      setTakes(tagged.slice(0, limit))
      setLoading(false)
    })()
    return () => { mounted = false }
  }, [limit])

  if (loading || takes.length === 0) return null

  return (
    <ul className="divide-y divide-white/10">
      {takes.map((take) => {
        const src = SOURCE_MAP[take.sourceKey]
        const href = `${src.basePath}/${take.slug}`
        return (
          <li key={`${take.sourceKey}-${take.slug}`} className={src.accentClass}>
            <Link to={href} className="group flex items-center gap-5 px-4 py-5 rounded-2xl hover:bg-white/[0.04] transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="recent-take-label inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                    {src.icon} {src.label}
                  </span>
                  {take.date && (
                    <time className="recent-take-date text-xs font-mono whitespace-nowrap">
                      {new Date(take.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                  )}
                </div>
                <h3 className="c-text text-xl font-bold leading-snug">{take.title}</h3>
                {take.excerpt && <p className="recent-take-excerpt body-text text-sm truncate">{take.excerpt}</p>}
              </div>
              <ArrowIcon className="w-5 h-5 text-cream/40 -rotate-45 group-hover:text-lime group-hover:rotate-0 transition-all shrink-0" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

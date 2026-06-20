import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBiblePosts } from '../lib/bible'
import { getGameReviews } from '../lib/gameReviews'
import { getRecipes } from '../lib/recipes'
import { getExperiences } from '../lib/experiences'
import type { ContentItem } from '../lib/content'

type TakeSource = {
  label: string
  accentClass: string
  basePath: string
  icon: string
}

const SOURCE_MAP: Record<string, TakeSource> = {
  bible:        { label: 'Bible',        accentClass: 'section-bible',       basePath: '/writing/bible',        icon: '📖' },
  games:        { label: 'Game Reviews', accentClass: 'section-games',       basePath: '/writing/game-reviews', icon: '🎮' },
  recipes:      { label: 'Recipes',      accentClass: 'section-recipes',     basePath: '/writing/recipes',      icon: '🍳' },
  experiences:  { label: 'Experiences',  accentClass: 'section-experiences', basePath: '/writing/experiences',  icon: '✈️'  },
}

type TakeItem = ContentItem & { sourceKey: string }

export function RecentTakes() {
  const [takes, setTakes] = useState<TakeItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const [bible, games, recipes, experiences] = await Promise.all([
        getBiblePosts(),
        getGameReviews(),
        getRecipes(),
        getExperiences(),
      ])
      if (!mounted) return

      const tagged: TakeItem[] = [
        ...bible.map((p) => ({ ...p, sourceKey: 'bible' })),
        ...games.map((p) => ({ ...p, sourceKey: 'games' })),
        ...recipes.map((p) => ({ ...p, sourceKey: 'recipes' })),
        ...experiences.map((p) => ({ ...p, sourceKey: 'experiences' })),
      ]

      tagged.sort((a, b) => {
        if (!a.date || !b.date) return 0
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

      setTakes(tagged.slice(0, 3))
      setLoading(false)
    })()
    return () => { mounted = false }
  }, [])

  if (loading || takes.length === 0) return null

  return (
    <div className="recent-takes-grid mt-12">
      {takes.map((take) => {
        const src = SOURCE_MAP[take.sourceKey]
        const href = `${src.basePath}/${take.slug}`
        return (
          <Link key={`${take.sourceKey}-${take.slug}`} to={href} className={`block ${src.accentClass}`}>
            <article className="recent-take-card h-full p-6 rounded-2xl">
              <div className="recent-take-bar h-0.5 rounded-full mb-4" />
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{src.icon}</span>
                <span className="recent-take-label text-xs font-mono uppercase tracking-widest">
                  {src.label}
                </span>
              </div>
              <h3 className="c-text text-lg font-bold mb-2 leading-snug">{take.title}</h3>
              {take.excerpt && (
                <p className="recent-take-excerpt text-sm leading-relaxed line-clamp-3">{take.excerpt}</p>
              )}
              {take.date && (
                <time className="recent-take-date block mt-4 text-xs font-mono">
                  {new Date(take.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </time>
              )}
              <div className="recent-take-cta mt-4 text-sm font-medium font-mono">Read →</div>
            </article>
          </Link>
        )
      })}
    </div>
  )
}

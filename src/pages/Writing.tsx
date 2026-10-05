import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { RecentTakes } from '../components/RecentTakes'
import { HubHero, ArrowIcon } from '../components/ui'
import { getPosts } from '../lib/posts'
import { getGameReviews } from '../lib/gameReviews'
import { getRecipes } from '../lib/recipes'
import { getExperiences } from '../lib/experiences'
import { getBiblePosts } from '../lib/bible'
import { getDevlogs } from '../lib/devlogs'
import type { ContentItem } from '../lib/content'

const sections = [
  {
    title: 'Duke Courses',
    description: 'Honest takes on courses beyond what a course eval can capture.',
    href: '/writing/duke-courses',
    icon: '🎓',
    accentClass: 'section-duke',
    fetch: getPosts,
  },
  {
    title: 'Devlogs',
    description: "Behind the scenes on things I've built, from first draft to playtest.",
    href: '/writing/devlogs',
    icon: '🛠️',
    accentClass: 'section-devlogs',
    fetch: getDevlogs,
  },
  {
    title: 'Game Reviews',
    description: "Games I've played, from quick impressions to full breakdowns.",
    href: '/writing/game-reviews',
    icon: '🎮',
    accentClass: 'section-games',
    fetch: getGameReviews,
  },
  {
    title: 'Recipes',
    description: "Things I've cooked that actually turned out good.",
    href: '/writing/recipes',
    icon: '🍳',
    accentClass: 'section-recipes',
    fetch: getRecipes,
  },
  {
    title: 'Experiences',
    description: "Road trips, moments, and things I've lived through worth writing down.",
    href: '/writing/experiences',
    icon: '🗺️',
    accentClass: 'section-experiences',
    fetch: getExperiences,
  },
  {
    title: 'Bible',
    description: 'Thoughts and reflections on scripture and faith.',
    href: '/writing/bible',
    icon: '✝️',
    accentClass: 'section-bible',
    fetch: getBiblePosts,
  },
]

export function Writing() {
  const [posts, setPosts] = useState<Record<string, ContentItem[]> | null>(null)

  useEffect(() => {
    let mounted = true
    Promise.all(sections.map(s => s.fetch())).then(results => {
      if (mounted) setPosts(Object.fromEntries(sections.map((s, i) => [s.href, results[i]])))
    })
    return () => { mounted = false }
  }, [])

  return (
    <main>
      <PageMeta
        title="Writing | Ismael Diaz"
        description="Everything Ismael Diaz writes about — Duke courses, devlogs, game reviews, recipes, experiences, and faith."
      />

      <HubHero
        eyebrow="/ writing"
        title="Things I"
        accent="want to say."
        subtitle="Pick a topic. I write about what I live, study, build, play, cook, and believe."
        bgWord="yap"
      />

      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-4 items-start">
          {/* Table of contents */}
          <div className="surface lg:col-span-7 p-2">
            <p className="eyebrow text-cream/45 px-5 pt-5 pb-3">Sections</p>
            <ul className="divide-y divide-white/10">
              {sections.map(section => {
                const items = posts?.[section.href]
                const empty = items !== undefined && items.length === 0
                const body = (
                  <>
                    <div className="hub-card-icon shrink-0">{section.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold text-cream">{section.title}</h2>
                        {items && (
                          <span className="recent-take-label px-2.5 py-0.5 rounded-full font-mono text-xs whitespace-nowrap">
                            {empty ? 'coming soon' : `${items.length} ${items.length === 1 ? 'post' : 'posts'}`}
                          </span>
                        )}
                      </div>
                      <p className="body-text text-sm text-cream/65">{section.description}</p>
                      {items?.[0] && (
                        <p className="text-sm text-cream/45 mt-2 truncate">
                          <span className="font-mono text-xs">latest:</span> {items[0].title}
                        </p>
                      )}
                    </div>
                  </>
                )
                return (
                  <li key={section.href} className={section.accentClass}>
                    {empty ? (
                      <div className="flex items-center gap-5 px-5 py-6 opacity-55">{body}</div>
                    ) : (
                      <Link to={section.href} className="group flex items-center gap-5 px-5 py-6 rounded-2xl hover:bg-white/[0.04] transition-colors">
                        {body}
                        <span className="arrow-bubble hub-card-cta-bubble"><ArrowIcon /></span>
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Latest across everything */}
          <div className="surface lg:col-span-5 p-2 lg:sticky lg:top-24">
            <p className="eyebrow text-cream/45 px-5 pt-5 pb-1">Latest posts</p>
            <RecentTakes limit={5} />
          </div>
        </div>
      </section>
    </main>
  )
}

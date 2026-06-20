import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'

const sections = [
  {
    title: 'Duke Courses',
    description: 'Honest takes on courses beyond what a course eval can capture.',
    href: '/writing/duke-courses',
    icon: '🎓',
    accentClass: 'section-duke',
  },
  {
    title: 'Game Reviews',
    description: "Games I've played, from quick impressions to full breakdowns.",
    href: '/writing/game-reviews',
    icon: '🎮',
    accentClass: 'section-games',
  },
  {
    title: 'Recipes',
    description: "Things I've cooked that actually turned out good.",
    href: '/writing/recipes',
    icon: '🍳',
    accentClass: 'section-recipes',
  },
  {
    title: 'Experiences',
    description: "Road trips, moments, and things I've lived through worth writing down.",
    href: '/writing/experiences',
    icon: '🗺️',
    accentClass: 'section-experiences',
  },
  {
    title: 'Bible',
    description: 'Thoughts and reflections on scripture and faith.',
    href: '/writing/bible',
    icon: '✝️',
    accentClass: 'section-bible',
  },
]

export function Writing() {
  return (
    <main className="c-bg-dark">
      <PageMeta
        title="Writing | Ismael Diaz"
        description="Everything Ismael Diaz writes about — Duke courses, game reviews, recipes, experiences, and faith."
      />

      <section className="hub-hero py-24 px-6 relative overflow-hidden">
        <div className="hub-bg-word absolute right-0 top-1/2 -translate-y-1/2 text-[14rem] font-bold select-none pointer-events-none leading-none">
          yap
        </div>
        <div className="max-w-6xl mx-auto relative">
          <p className="c-accent text-sm font-mono uppercase tracking-widest mb-3 opacity-60">/ writing</p>
          <h1 className="c-text text-5xl md:text-7xl font-bold mb-5 leading-tight">
            Things I<br className="hidden sm:block" /> want to say.
          </h1>
          <p className="body-text text-lg max-w-md opacity-80">Pick a topic. I write about what I live, study, play, cook, and believe.</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link key={section.href} to={section.href} className={`block ${section.accentClass}`}>
              <div className="hub-card h-full p-5 rounded-2xl">
                <div className="hub-card-bar" />
                <div className="hub-card-icon">{section.icon}</div>
                <h2 className="c-text text-xl font-bold mb-2">{section.title}</h2>
                <p className="hub-card-desc text-sm leading-relaxed">{section.description}</p>
                <div className="hub-card-cta mt-5 font-mono font-medium">Explore →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

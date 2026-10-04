import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { HubHero, ArrowIcon } from '../components/ui'

const miscItems = [
  {
    title: 'Instructions Unclear',
    description: 'My PICO-8 game. A tutorial whose narrator really does not want you to finish it. Playable in your browser.',
    href: '/games',
    icon: '🕹️',
    accentClass: 'section-games',
    label: 'Play it',
  },
  {
    title: 'Big Brain Weather',
    description: 'Live weather for Houston and Durham with nerdy atmospheric stats. Because why not.',
    href: '/weather',
    icon: '🌦️',
    accentClass: 'section-weather',
    label: 'Check it out',
  },
]

export function Misc() {
  return (
    <main>
      <PageMeta title="Misc | Ismael Diaz" description="Miscellaneous stuff on Ismael Diaz's website. Truly unpredictable." />

      <HubHero
        eyebrow="/ misc"
        title="Misc,"
        accent="truly unpredictable."
        subtitle="A very random section. No telling what ends up here."
        bgWord="misc"
      />

      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {miscItems.map((item) => (
            <Link key={item.href} to={item.href} className={`group block ${item.accentClass}`}>
              <div className="hub-card h-full p-7 flex flex-col">
                <div className="hub-card-icon mb-6">{item.icon}</div>
                <h2 className="c-text text-2xl font-bold mb-2">{item.title}</h2>
                <p className="hub-card-desc body-text text-sm">{item.description}</p>
                <div className="hub-card-cta mt-auto pt-6 flex items-center justify-between font-medium text-sm">
                  {item.label} <span className="arrow-bubble"><ArrowIcon /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

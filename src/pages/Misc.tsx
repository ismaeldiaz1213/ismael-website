import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'

const miscItems = [
  {
    title: 'Big Brain Weather',
    description: 'Live weather for Houston and Durham with nerdy atmospheric stats. Because why not.',
    href: '/weather',
    icon: '🌦️',
    accentClass: 'section-weather',
    label: 'Check it out →',
  },
]

export function Misc() {
  return (
    <main className="c-bg-dark">
      <PageMeta title="Misc | Ismael Diaz" description="Miscellaneous stuff on Ismael Diaz's website. Truly unpredictable." />

      <section className="hub-hero py-20 px-6 relative overflow-hidden">
        <div className="hub-bg-word absolute right-0 top-1/2 -translate-y-1/2 text-[12rem] font-bold select-none pointer-events-none leading-none">
          misc
        </div>
        <div className="max-w-6xl mx-auto relative">
          <h1 className="c-text text-5xl md:text-6xl font-bold mb-4">Misc</h1>
          <p className="c-text opacity-60 text-xl max-w-xl">The yap section. Truly unpredictable what ends up here.</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {miscItems.map((item) => (
            <Link key={item.href} to={item.href} className={`block ${item.accentClass}`}>
              <div className="hub-card h-full p-6 rounded-2xl">
                <div className="hub-card-bar h-1 rounded-full mb-5" />
                <div className="text-3xl mb-3">{item.icon}</div>
                <h2 className="c-text text-xl font-bold mb-2">{item.title}</h2>
                <p className="c-text opacity-60 text-sm leading-relaxed">{item.description}</p>
                <div className="hub-card-cta mt-5 text-sm font-medium">{item.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

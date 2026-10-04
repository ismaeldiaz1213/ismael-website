import { PageMeta } from '../components/PageMeta'
import { HubHero, Button, ArrowIcon } from '../components/ui'

export function Games() {
  return (
    <main>
      <PageMeta
        title="Games | Ismael Diaz"
        description="Small games made by Ismael Diaz, playable in the browser."
      />

      <HubHero
        eyebrow="/ games"
        title="Games"
        accent="I made."
        subtitle="Things I built in PICO-8. Playable right here, no download."
        bgWord="play"
      />

      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="section-games hub-card p-6 sm:p-8">

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-8">
              <div className="max-w-2xl">
                <h2 className="c-text text-3xl font-bold mb-2">Instructions Unclear</h2>
                <p className="body-text text-cream/70">
                  A top-down shooter disguised as a tutorial that does not want you to finish it. A government
                  narrator hands you a weapon that only stuns, tells you to never press G, and gets less composed
                  every time you ignore him. Made for a game jam on the theme &ldquo;worst tutorial ever.&rdquo;
                </p>
              </div>
              <Button href="/projects/instructions-unclear" variant="secondary" className="shrink-0">
                Read the devlog <ArrowIcon />
              </Button>
            </div>

            <div className="flex justify-center mb-8">
              <iframe
                src="/games/instructions_unclear.html"
                title="Instructions Unclear"
                width={750}
                height={680}
                className="rounded-3xl max-w-full"
                style={{ border: 0 }}
                scrolling="no"
                allow="autoplay; fullscreen"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6 border-t border-white/10 pt-6">
              <div>
                <h3 className="c-text text-sm font-bold mb-2 opacity-80">Controls</h3>
                <ul className="c-text opacity-60 text-sm leading-relaxed space-y-1">
                  <li>Arrow keys to move</li>
                  <li>Z to fire, X to advance dialogue</li>
                  <li>Q skips a conversation</li>
                </ul>
              </div>
              <div>
                <h3 className="c-text text-sm font-bold mb-2 opacity-80">Before you start</h3>
                <p className="c-text opacity-60 text-sm leading-relaxed">
                  Click the game once so it picks up your keyboard. A physical
                  keyboard is required, so this one does not work on phones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

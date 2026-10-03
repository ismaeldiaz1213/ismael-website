interface HubHeroProps {
  eyebrow: string
  title: string
  /** Rendered after the title in the italic serif accent face */
  accent?: string
  subtitle: string
  /** Giant faint word in the background */
  bgWord: string
  sticker?: React.ReactNode
}

/** Rounded Duke-blue hero card at the top of hub pages (Writing, Projects, Misc…). */
export function HubHero({ eyebrow, title, accent, subtitle, bgWord, sticker }: HubHeroProps) {
  return (
    <section className="px-3 sm:px-4 pt-6">
      <div className="panel-duke max-w-6xl mx-auto relative overflow-hidden px-6 py-14 md:px-14 md:py-20">
        <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />
        <div className="hub-bg-word absolute -right-4 bottom-[-0.2em] text-[9rem] md:text-[16rem] select-none pointer-events-none leading-none" aria-hidden="true">
          {bgWord}
        </div>
        {sticker && <div className="absolute top-6 right-6 hidden sm:block">{sticker}</div>}
        <div className="relative max-w-2xl">
          <p className="eyebrow text-lime mb-4">{eyebrow}</p>
          <h1 className="text-5xl md:text-7xl font-extrabold text-cream leading-[0.95] tracking-[-0.035em] mb-5">
            {title}
            {accent && <> <span className="accent-serif font-normal text-cream/90 pr-1">{accent}</span></>}
          </h1>
          <p className="body-text text-cream/80 text-lg max-w-lg">{subtitle}</p>
        </div>
      </div>
    </section>
  )
}

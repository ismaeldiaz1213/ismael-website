import { Link } from 'react-router-dom'
import { LedStripDivider } from './ui/Decor'

export function Footer() {
  return (
    <footer className="mt-24">
      <LedStripDivider />
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-12 flex flex-col md:flex-row gap-6 md:items-end justify-between">
        <div>
          <Link to="/" className="font-display text-3xl font-bold text-cream">
            Ismael Diaz<span className="text-lime">.</span>
          </Link>
          <p className="accent-serif text-xl text-cream/70 mt-1">Designed and routed in Houston, TX.</p>
        </div>
        <p className="text-sm text-cream/50 max-w-md md:text-right leading-relaxed">
          Website built in React + Vite + TS. A bunch of Tailwind. Run with Vercel.
          With a couple of AI friends helping along the way.
        </p>
      </div>
    </footer>
  )
}

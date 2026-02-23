import { Link } from 'react-router-dom'
import blorb from '../assets/Blorb-Sprite-favicon.png'

export function NotFound() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <img
            src={blorb}
            alt="Blorb the lost navigator"
            className="w-32 h-32 animate-bounce"
          />
        </div>

        <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>404</h1>
        <h2 className="text-3xl font-semibold mb-6" style={{ color: 'var(--color-accent)' }}>Page Not Found</h2>

        <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--color-accent)', opacity: 0.7 }}>
          Idk what you did but you found a page that doesn't exist! Hopefully that wasn't my fault. If so, my bad for
          giving you the wrong page. Otherwise, get it together man! Look, I'll tell you what, this blorb right here can
          help you find your way back out. In fact... it found a button for you to click below which should take you back
          to the safety of the homepage.
        </p>

        <Link
          to="/"
          className="inline-block px-8 py-3 font-semibold rounded-lg transition-all"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}
        >
          Back Home
        </Link>
      </div>
    </main>
  )
}

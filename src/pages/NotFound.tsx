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

        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-slate-200 mb-6">Page Not Found</h2>

        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          Idk what you did but you found a page that doesn't exist! Hopefully that wasn't my fault. If so, my bad for
          giving you the wrong page. Otherwise, get it together man! Look, I'll tell you what, this blorb right here can
          help you find your way back out. In fact... it found a button for you to click below which should take you back
          to the safety of the homepage.
        </p>

        <Link
          to="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all"
        >
          Back Home
        </Link>
      </div>
    </main>
  )
}

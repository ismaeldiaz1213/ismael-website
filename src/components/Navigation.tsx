import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import profileImage from '../assets/Ismael_Diaz_Duke.jpeg'
import { ArrowIcon } from './ui/Decor'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/writing', label: 'Writing' },
  { to: '/games', label: 'Games' },
  { to: '/misc', label: 'Misc' },
]

const SOCIALS = [
  {
    href: 'https://www.linkedin.com/in/ismael-diaz-/',
    label: 'LinkedIn',
    path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
  },
  {
    href: 'https://github.com/ismaeldiaz1213',
    label: 'GitHub',
    path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
  },
]

function SocialIcons() {
  return (
    <>
      {SOCIALS.map(s => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="w-9 h-9 rounded-full flex items-center justify-center text-cream/60 hover:text-night hover:bg-cream transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
        </a>
      ))}
    </>
  )
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-4 pt-3 md:pt-4 pointer-events-none">
      <nav className="mx-auto max-w-[1600px] flex items-center justify-between gap-3">
        {/* Left bubble: me */}
        <Link to="/" className="nav-pill pointer-events-auto group relative flex items-center gap-2.5 rounded-full pl-1.5 pr-5 py-1.5">
          <img
            src={profileImage}
            alt="Ismael Diaz"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-lime/80 group-hover:rotate-[-8deg] group-hover:scale-110 transition-transform"
          />
          <span className="font-display font-bold text-cream text-lg tracking-tight">diazzism</span>
          <span className="nav-alias-tooltip pointer-events-none absolute left-0 top-full mt-3 px-3 py-2 text-xs rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            my Amazon SDE intern alias
          </span>
        </Link>

        {/* Right bubble: everything else */}
        <div className="nav-pill pointer-events-auto hidden md:flex items-center gap-1 rounded-full p-1.5">
          {LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? 'bg-lime text-night' : 'text-cream/75 hover:text-cream hover:bg-white/10'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <span className="w-px h-5 bg-white/15 mx-1.5" />
          <SocialIcons />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(o => !o)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          className="nav-pill pointer-events-auto md:hidden w-12 h-12 rounded-full flex flex-col items-center justify-center gap-1.5"
        >
          <span className={`block w-4 h-0.5 bg-cream rounded-full transition-transform ${isOpen ? 'translate-y-1 rotate-45' : ''}`} />
          <span className={`block w-4 h-0.5 bg-cream rounded-full transition-transform ${isOpen ? '-translate-y-1 -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="nav-pill pointer-events-auto md:hidden ml-auto max-w-sm mt-2 rounded-[1.75rem] p-3 animate-fade-in-up">
          {LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-2xl font-display text-2xl font-semibold transition-colors ${
                  isActive ? 'bg-lime text-night' : 'text-cream hover:bg-white/10'
                }`
              }
            >
              {l.label}
              <ArrowIcon className="w-5 h-5 opacity-60" />
            </NavLink>
          ))}
          <div className="flex gap-1 px-2 pt-3 mt-2 border-t border-white/10">
            <SocialIcons />
          </div>
        </div>
      )}
    </header>
  )
}

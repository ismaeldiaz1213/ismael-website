import { useEffect, useState } from 'react'

export interface Heading {
  id: string
  text: string
  level: number
}

interface AnchorNavigatorProps {
  headings: Heading[]
}

export function AnchorNavigator({ headings }: AnchorNavigatorProps) {
  const [activeId, setActiveId] = useState<string>('')
  // Stays hidden while the post's header card is on screen, so the two never overlap
  const [pastHeader, setPastHeader] = useState(false)

  useEffect(() => {
    const onScroll = () => setPastHeader(window.scrollY > 320)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )
    headings.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })
    return () => {
      headings.forEach((h) => {
        const el = document.getElementById(h.id)
        if (el) observer.unobserve(el)
      })
    }
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav
      className={`hidden xl:block fixed right-8 top-28 w-56 pr-4 transition-opacity duration-300 ${
        pastHeader ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-h-[calc(100vh-9rem)] overflow-y-auto">
        <h3 className="eyebrow text-cream/60 mb-4">On this page</h3>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li key={heading.id} className={heading.level > 2 ? 'pl-3' : ''}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById(heading.id)
                  if (el) {
                    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' })
                  }
                }}
                className={`block py-1 transition-colors ${
                  activeId === heading.id ? 'text-lime font-medium' : 'text-cream/50 hover:text-cream'
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

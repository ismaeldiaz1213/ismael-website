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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className="hidden lg:block fixed right-8 w-56 pr-4" style={{ top: '400px' }}>
      <div className="max-h-[calc(100vh-450px)] overflow-y-auto">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">On this page</h3>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => {
            const isActive = activeId === heading.id
            const paddingLeft = (heading.level - 2) * 12

            return (
              <li key={heading.id} style={{ paddingLeft: `${paddingLeft}px` }}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById(heading.id)
                    if (element) {
                      const headerOffset = 100
                      const topPos = element.getBoundingClientRect().top + window.scrollY - headerOffset
                      window.scrollTo({ top: topPos, behavior: 'smooth' })
                    }
                  }}
                  className={`block py-1 transition-colors ${
                    isActive
                      ? 'text-blue-400 font-medium'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

import { useEffect } from 'react'

interface PageMetaProps {
  /** Browser tab title — shown as-is, so include the full desired string */
  title: string
  /** Page description for search results (≤ 160 chars recommended) */
  description?: string
  /** Additional comma-separated keywords */
  keywords?: string
}

const SITE_KEYWORDS =
  'Ismael Diaz, Duke University, ECE, Computer Science, embedded systems, ' +
  'FPGA, hardware acceleration, electrical engineering, Duke ECE, Duke CS'

function setMeta(name: string, content: string, property = false) {
  const attr   = property ? 'property' : 'name'
  let   el     = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function PageMeta({ title, description, keywords }: PageMetaProps) {
  useEffect(() => {
    document.title = title

    if (description) {
      setMeta('description', description)
      setMeta('og:description', description, true)
    }

    setMeta('og:title', title, true)
    setMeta('og:type', 'website', true)

    const kw = [SITE_KEYWORDS, keywords].filter(Boolean).join(', ')
    setMeta('keywords', kw)
  }, [title, description, keywords])

  return null
}

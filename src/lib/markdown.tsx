import React from 'react'
import type { Heading } from '../components/AnchorNavigator'

/** Converts heading text to a URL-safe ID. */
export function headingToId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Extracts h2/h3 headings from raw markdown content. */
export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: Heading[] = []
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2],
      id: headingToId(match[2]),
    })
  }
  return headings
}

/**
 * Custom react-markdown component overrides that add `id` attributes to h2/h3
 * so AnchorNavigator can scroll to them.
 */
export const markdownHeadingComponents: Record<string, React.ComponentType<any>> = {
  h2: ({ children }: any) => {
    const text = Array.isArray(children) ? children.join('') : String(children)
    return <h2 id={headingToId(text)} className="scroll-mt-24">{children}</h2>
  },
  h3: ({ children }: any) => {
    const text = Array.isArray(children) ? children.join('') : String(children)
    return <h3 id={headingToId(text)} className="scroll-mt-24">{children}</h3>
  },
}

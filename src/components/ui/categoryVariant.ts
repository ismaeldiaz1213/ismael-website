import type { BadgeProps } from './Badge'

/** Badge color for a project category. */
export function categoryVariant(category: string): BadgeProps['variant'] {
  const c = category.toLowerCase()
  return c === 'hardware' ? 'orange' : c === 'game' ? 'rosa' : 'primary'
}

import { Button } from './Button'

interface HeroSectionProps {
  title: string
  subtitle: string
  description: string
  actions?: Array<{
    label: string
    href?: string
    variant?: 'primary' | 'secondary'
    onClick?: () => void
  }>
  image?: React.ReactNode
}

export function HeroSection({
  title,
  subtitle,
  description,
  actions,
  image,
}: HeroSectionProps) {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-slate-950/50 to-amber-950/20 -z-10"></div>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="mb-6 inline-block">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                ID
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 via-rose-400 to-orange-400 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>

            <p className="text-xl text-rose-300 mb-2">{subtitle}</p>

            <p className="text-lg text-slate-400 mb-8 max-w-lg">{description}</p>

            {actions && (
              <div className="flex flex-wrap gap-4">
                {actions.map((action, index) =>
                  action.href ? (
                    <a
                      key={index}
                      href={action.href}
                      className="inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300"
                    >
                      <Button
                        variant={action.variant || 'primary'}
                        size="lg"
                      >
                        {action.label}
                      </Button>
                    </a>
                  ) : (
                    <Button
                      key={index}
                      variant={action.variant || 'primary'}
                      size="lg"
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Image placeholder */}
          {image ? (
            image
          ) : (
            <div className="h-96 rounded-lg bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-orange-600/20 border border-purple-500/30 flex items-center justify-center text-6xl shadow-xl">
              🚀
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

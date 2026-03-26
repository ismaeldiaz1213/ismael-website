interface CTABoxProps {
  title: string
  description: string
  className?: string
}

/** Gradient call-to-action banner used at the bottom of list pages. */
export function CTABox({ title, description, className = '' }: CTABoxProps) {
  return (
    <div
      className={`mt-16 p-8 rounded-lg bg-gradient-to-r from-blue-900/20 to-orange-900/20 border border-purple-500/30 text-center ${className}`}
    >
      <h3 className="text-2xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  )
}

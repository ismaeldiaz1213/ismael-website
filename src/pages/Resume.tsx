import resumeUrl from '../assets/Ismael_s_Resume___SWE.pdf'

export function Resume() {
  return (
    <main className="min-h-[calc(100vh-80px)] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="eyebrow text-lime mb-3">/ resume</p>
        <h1 className="c-text text-5xl md:text-6xl font-extrabold tracking-[-0.035em] mb-8">The <span className="accent-serif font-normal">official</span> version.</h1>
        <div className="resume-iframe rounded-[1.75rem] overflow-hidden">
          <iframe src={resumeUrl} title="Resume" className="w-full h-full" />
        </div>
      </div>
    </main>
  )
}

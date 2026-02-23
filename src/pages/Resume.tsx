import resumeUrl from '../assets/Ismael_s_Resume_SWE.pdf'

export function Resume() {
  return (
    <main className="min-h-[calc(100vh-80px)] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>Resume</h1>
        <div className="rounded-lg overflow-hidden shadow-lg" style={{height: '80vh', border: '1px solid var(--color-border)'}}>
          <iframe src={resumeUrl} title="Resume" className="w-full h-full" />
        </div>
      </div>
    </main>
  )
}

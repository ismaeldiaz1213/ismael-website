import resumeUrl from '../assets/Ismael_s_Resume_SWE.pdf'

export function Resume() {
  return (
    <main className="min-h-[calc(100vh-80px)] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Resume</h1>
        <div className="border border-white/10 rounded-lg overflow-hidden shadow-lg" style={{height: '80vh'}}>
          <iframe src={resumeUrl} title="Resume" className="w-full h-full" />
        </div>
      </div>
    </main>
  )
}

import resumeUrl from '../assets/Ismael_s_Resume___SWE.pdf'

export function Resume() {
  return (
    <main className="min-h-[calc(100vh-80px)] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="c-text text-3xl font-bold mb-6">Resume</h1>
        <div className="resume-iframe rounded-lg overflow-hidden shadow-lg">
          <iframe src={resumeUrl} title="Resume" className="w-full h-full" />
        </div>
      </div>
    </main>
  )
}

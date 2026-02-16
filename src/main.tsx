import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { NotFound } from './pages/NotFound'
import './index.css'

// Lazy-load page components for better code-splitting
const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Projects = React.lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })))
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail').then(m => ({ default: m.ProjectDetail })))
const DukeThoughts = React.lazy(() => import('./pages/DukeThoughts').then(m => ({ default: m.DukeThoughts })))
const DukeThoughtDetail = React.lazy(() => import('./pages/DukeThoughtDetail').then(m => ({ default: m.DukeThoughtDetail })))
const Resume = React.lazy(() => import('./pages/Resume').then(m => ({ default: m.Resume })))

// Loading component
function PageLoader() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="text-center text-slate-300">Loading…</div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
          <Route path="/projects" element={<Suspense fallback={<PageLoader />}><Projects /></Suspense>} />
          <Route path="/projects/:id" element={<Suspense fallback={<PageLoader />}><ProjectDetail /></Suspense>} />
          <Route path="/resume" element={<Suspense fallback={<PageLoader />}><Resume /></Suspense>} />
          <Route path="/duke-courses" element={<Suspense fallback={<PageLoader />}><DukeThoughts /></Suspense>} />
          <Route path="/duke-courses/:id" element={<Suspense fallback={<PageLoader />}><DukeThoughtDetail /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

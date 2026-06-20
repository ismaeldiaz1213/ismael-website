import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Layout } from './components/Layout'
import { NotFound } from './pages/NotFound'
import './index.css'

const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Projects = React.lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })))
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail').then(m => ({ default: m.ProjectDetail })))
const Resume = React.lazy(() => import('./pages/Resume').then(m => ({ default: m.Resume })))
const Weather = React.lazy(() => import('./pages/Weather').then(m => ({ default: m.Weather })))
const Misc = React.lazy(() => import('./pages/Misc').then(m => ({ default: m.Misc })))

// Writing hub + sub-sections
const Writing = React.lazy(() => import('./pages/Writing').then(m => ({ default: m.Writing })))
const DukeThoughts = React.lazy(() => import('./pages/DukeThoughts').then(m => ({ default: m.DukeThoughts })))
const DukeThoughtDetail = React.lazy(() => import('./pages/DukeThoughtDetail').then(m => ({ default: m.DukeThoughtDetail })))
const GameReviews = React.lazy(() => import('./pages/GameReviews').then(m => ({ default: m.GameReviews })))
const GameReviewDetail = React.lazy(() => import('./pages/GameReviewDetail').then(m => ({ default: m.GameReviewDetail })))
const Recipes = React.lazy(() => import('./pages/Recipes').then(m => ({ default: m.Recipes })))
const RecipeDetail = React.lazy(() => import('./pages/RecipeDetail').then(m => ({ default: m.RecipeDetail })))
const Experiences = React.lazy(() => import('./pages/Experiences').then(m => ({ default: m.Experiences })))
const ExperienceDetail = React.lazy(() => import('./pages/ExperienceDetail').then(m => ({ default: m.ExperienceDetail })))
const BibleReflections = React.lazy(() => import('./pages/BibleReflections').then(m => ({ default: m.BibleReflections })))
const BibleDetail = React.lazy(() => import('./pages/BibleDetail').then(m => ({ default: m.BibleDetail })))

function PageLoader() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="text-center text-slate-300">Loading…</div>
    </div>
  )
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Lazy><Home /></Lazy>} />
          <Route path="/projects" element={<Lazy><Projects /></Lazy>} />
          <Route path="/projects/:id" element={<Lazy><ProjectDetail /></Lazy>} />
          <Route path="/resume" element={<Lazy><Resume /></Lazy>} />
          <Route path="/misc" element={<Lazy><Misc /></Lazy>} />
          <Route path="/weather" element={<Lazy><Weather /></Lazy>} />

          {/* Writing hub */}
          <Route path="/writing" element={<Lazy><Writing /></Lazy>} />
          <Route path="/writing/duke-courses" element={<Lazy><DukeThoughts /></Lazy>} />
          <Route path="/writing/duke-courses/:id" element={<Lazy><DukeThoughtDetail /></Lazy>} />
          <Route path="/writing/game-reviews" element={<Lazy><GameReviews /></Lazy>} />
          <Route path="/writing/game-reviews/:id" element={<Lazy><GameReviewDetail /></Lazy>} />
          <Route path="/writing/recipes" element={<Lazy><Recipes /></Lazy>} />
          <Route path="/writing/recipes/:id" element={<Lazy><RecipeDetail /></Lazy>} />
          <Route path="/writing/experiences" element={<Lazy><Experiences /></Lazy>} />
          <Route path="/writing/experiences/:id" element={<Lazy><ExperienceDetail /></Lazy>} />
          <Route path="/writing/bible" element={<Lazy><BibleReflections /></Lazy>} />
          <Route path="/writing/bible/:id" element={<Lazy><BibleDetail /></Lazy>} />

          {/* Backward-compat redirects */}
          <Route path="/duke-courses" element={<Navigate to="/writing/duke-courses" replace />} />
          <Route path="/duke-courses/:id" element={<DukeRedirect />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

function DukeRedirect() {
  const { id } = useParams()
  return <Navigate to={`/writing/duke-courses/${id ?? ''}`} replace />
}

import { Outlet } from 'react-router-dom'
import { Navigation } from './Navigation'
import { Footer } from './Footer'

export function Layout() {
  return (
    <div className="min-h-screen c-bg-dark flex flex-col">
      <Navigation />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

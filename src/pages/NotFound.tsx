import blorb from '../assets/Blorb-Sprite-favicon.png'
import { Button } from '../components/ui'

export function NotFound() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <img src={blorb} alt="Blorb the lost navigator" className="w-32 h-32 animate-bounce" />
        </div>

        <h1 className="c-text text-8xl md:text-9xl font-extrabold tracking-[-0.05em] leading-none mb-2">404</h1>
        <h2 className="accent-serif text-sunset text-4xl md:text-5xl mb-8 pr-1">¿y ahora qué?</h2>

        <p className="body-text text-cream/75 text-lg mb-10">
          Idk what you did but you found a page that doesn't exist! Hopefully that wasn't my fault. If so, my bad for
          giving you the wrong page. Otherwise, get it together man! Look, I'll tell you what, this blorb right here can
          help you find your way back out. In fact... it found a button for you to click below which should take you back
          to the safety of the homepage.
        </p>

        <Button href="/" size="lg">Back home</Button>
      </div>
    </main>
  )
}

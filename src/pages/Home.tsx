import { Section, SectionHeader, FeatureCard, Button } from '../components/ui'
import { PCBTraceAnimation } from '../components/PCBTraceAnimation'
import natureImage from '../assets/nature-2025.jpeg'

export function Home() {
  return (
    <main style={{ backgroundColor: 'var(--color-bg-dark)' }}>
      {/* PCB Trace Hero
          Added a mask-image to fade the bottom of the animation 
      */}
      <div
        className="relative"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
        }}
      >
        <PCBTraceAnimation text="¡Hola! I'm Ismael Diaz" />
      </div>

      {/* About Section
          Negative margin pulls this section up slightly to overlap the fade
      */}
        <section
            className="relative py-20 px-6 -mt-20 z-10"
            style={{ backgroundColor: 'rgba(16, 42, 59, 0.7)', backdropFilter: 'blur(8px)' }}
        >
            <div className="container mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Text Content */}
                    <div className="animate-slide-in-left">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                            About Me
                        </h2>

                        <div className="space-y-4 mb-8">
                            <p className="text-lg" style={{ color: 'var(--color-text)', opacity: 0.92 }}>
                                Born and raised (and still living) in Houston, TX. I’m an ECE + CS student at Duke University
                                who enjoys any of the low-level details that make computers work.
                                Whether it be the processor design to the systems that allow a computer
                                to interact with the outside world, it's all fun to learn!
                            </p>

                            <p className="text-lg" style={{ color: 'var(--color-accent)', opacity: 0.95 }}>
                                I’m especially into embedded systems, computer architecture, and computer networks. Or really,
                                anything where performance, reliability, and “how it actually works” matter.
                            </p>

                            <div className="mt-6 grid gap-4">
                                <div
                                    className="rounded-2xl p-4"
                                    style={{
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        backgroundColor: 'rgba(0,0,0,0.18)',
                                    }}
                                >
                                    <div className="text-sm uppercase tracking-wide mb-1" style={{ color: 'var(--color-accent)', opacity: 0.85 }}>
                                        Right now I’m focused on
                                    </div>
                                    <p className="text-base" style={{ color: 'var(--color-text)', opacity: 0.88 }}>
                                        This website! A fun side project to work on during my free time. Still working my missions display project.
                                        And doing some research projects!
                                    </p>
                                </div>

                                <div
                                    className="rounded-2xl p-4"
                                    style={{
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        backgroundColor: 'rgba(0,0,0,0.18)',
                                    }}
                                >
                                    <div className="text-sm uppercase tracking-wide mb-1" style={{ color: 'var(--color-accent)', opacity: 0.85 }}>
                                        I am currently working with
                                    </div>
                                    <p className="text-base" style={{ color: 'var(--color-text)', opacity: 0.88 }}>
                                        FPGA's, linux Fedora, mmWaveRadar, SML/NJ to make a compiler.
                                    </p>
                                </div>

                                <div
                                    className="rounded-2xl p-4"
                                    style={{
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        backgroundColor: 'rgba(0,0,0,0.18)',
                                    }}
                                >
                                    <div className="text-sm uppercase tracking-wide mb-1" style={{ color: 'var(--color-accent)', opacity: 0.85 }}>
                                        Outside of engineering
                                    </div>
                                    <p className="text-base" style={{ color: 'var(--color-text)', opacity: 0.88 }}>
                                        I spend lots of time at church or at home with family. Love a good roadtrip too.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="mb-3 text-lg" style={{ color: 'var(--color-text)', opacity: 0.92 }}>On the off chance an employer stumbles across the site:</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="primary" size="lg" href="/resume">
                                View My Resume
                            </Button>
                        </div>
                    </div>

                    {/* Right: Image + caption */}
                    <div className="animate-slide-in-right flex justify-center">
                        <figure className="w-full max-w-sm">
                            <img
                                src={natureImage}
                                alt="Ismael Diaz"
                                className="w-full h-80 md:h-full object-cover rounded-2xl shadow-2xl"
                                style={{
                                    borderColor: 'var(--color-accent)',
                                    borderWidth: '2px',
                                    boxShadow: 'var(--shadow-gray-lg)',
                                }}
                            />
                            <figcaption
                                className="mt-3 text-sm leading-relaxed"
                                style={{ color: 'var(--color-text)', opacity: 0.75 }}
                            >
                                This picture was taken in Utah during my road trip from Houston to Seattle —{' '}
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=Harley%27s%20Dome%20View%20Area%2C%20Thompson%20Springs%2C%20UT%2084540"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                    style={{ color: 'var(--color-accent)' }}
                                >
                                    Harley&apos;s Dome View Area (Thompson Springs, UT 84540)
                                </a>
                                .
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </div>
        </section>

      {/* Featured Section */}
      <Section variant="gradient">
        <SectionHeader
          title="Featured"
          subtitle="I have a couple of projects that you can check out below! Some are complete, others are still in progress and I will be updating it when I have made decent progress. Additionally, I have created blogs with my thoughts on some of the Duke courses I've taken."
        />

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <FeatureCard
            title="Check Out My Work"
            description="A collection of projects I've built showcasing some of my technical skills"
            icon="📁"
            href="/projects"
          />

          <FeatureCard
            title="My Duke Course Experience"
            description="Reflections on my courses at Duke"
            icon="💭"
            href="/duke-courses"
          />
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="dark">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Let's Connect</h2>
          <p className="text-lg mb-8" style={{ color: 'var(--color-accent)', opacity: 0.8 }}>
            Questions about something? Feel free to reach out!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" href="mailto:ismael.diaz@duke.edu">
              Email Me
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="https://www.linkedin.com/in/ismael-diaz-/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </Button>
          </div>
        </div>
      </Section>
        {/* Tiny footer for the giggles */}
        <div className="py-10 px-6 text-center">
            <p className="text-sm" style={{ color: 'var(--color-text)', opacity: 0.55 }}>
                Website built in React + Vite + TS. A bunch of tailwind. Run with Vercel. With a couple of AI friends helping along the way.
            </p>
        </div>
    </main>
  )
}

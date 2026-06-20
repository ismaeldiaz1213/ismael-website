import { Section, SectionHeader, FeatureCard, Button, InfoCard } from '../components/ui'
import { PCBTraceAnimation } from '../components/PCBTraceAnimation'
import { PageMeta } from '../components/PageMeta'
import natureImage from '../assets/nature-2025.jpeg'
import duke_smif from '../assets/duke_smif_image.jpeg'

export function Home() {
  return (
    <main className="c-bg-dark">
      <PageMeta
        title="Ismael Diaz | ECE + CS Student at Duke University"
        description="Personal website of Ismael Diaz, ECE and Computer Science student at Duke University. Projects in embedded systems, FPGA design, hardware acceleration, and low-level computing."
        keywords="embedded systems, FPGA, hardware acceleration, low-level computing, Houston, Duke student"
      />

      {/* mask-image fades the bottom of the animation into the section below */}
      <div className="relative pcb-animation-mask">
        <PCBTraceAnimation text="¡Hola! I'm Ismael Diaz" />
      </div>

      {/* -mt-20 overlaps the fade so there's no gap between animation and content */}
      <section className="c-section-glass relative py-20 px-6 -mt-20 z-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="c-text text-3xl md:text-4xl font-bold mb-6">About Me</h2>

              <div className="space-y-4 mb-8">
                <p className="c-text opacity-92 text-lg">
                  Born and raised (and still living) in Houston, TX. I'm an ECE + CS student at Duke University
                  who enjoys any of the low-level details that make computers work.
                  Whether it be the processor design to the systems that allow a computer
                  to interact with the outside world, it's all fun to learn!
                </p>

                <p className="c-accent opacity-95 text-lg">
                  I'm becoming partciularly interested in embedded systems and learning how edge devices can be hardware accelerated along with running ML algorithms.
                </p>

                <div className="mt-6 grid gap-4">
                  <InfoCard label="Right now I'm focused on">
                    This website! A fun side project to work on during my free time. Still working my missions display project.
                    And doing some research projects which I will certainly share later!
                  </InfoCard>
                  <InfoCard label="I am currently working with">
                    FPGA's, mmWaveRadar, SML/NJ to make a compiler
                  </InfoCard>
                  <InfoCard label="Outside of engineering">
                    I spend lots of time at church or at home with family. Love a good roadtrip too.
                  </InfoCard>
                </div>
              </div>

              <p className="c-text opacity-92 mb-3 text-lg">On the off chance an employer stumbles across the site:</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" href="/resume">View My Resume</Button>
              </div>
            </div>

            <div className="animate-slide-in-right flex justify-center">
              <figure className="w-full max-w-sm">
                <img
                  src={natureImage}
                  alt="Ismael Diaz - Duke University ECE CS Student"
                  className="c-border border-2 w-full h-80 md:h-full object-cover rounded-2xl shadow-2xl"
                />
                <figcaption className="c-text opacity-75 mt-3 text-sm leading-relaxed">
                  This picture was taken in Utah during my road trip from Houston to Seattle —{' '}
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Harley%27s%20Dome%20View%20Area%2C%20Thompson%20Springs%2C%20UT%2084540"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="c-accent underline"
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

      <Section variant="gradient">
        <SectionHeader
          title="Featured"
          subtitle="I have a couple of projects that you can check out below! Some are complete, others are still in progress and I will be updating it when I have made decent progress. Additionally, I have created blogs with my thoughts on some of the Duke courses I've taken."
        />
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <FeatureCard
            title="Check Out My Work"
            description="A collection of projects I've built showcasing some of my technical skills"
            image="/projects/interactive-missions-displayboards/display_completion.jpg"
            imageAlt="Interactive missions display boards project"
            href="/projects"
          />
          <FeatureCard
            title="My Duke Course Experience"
            description="Reflections on my courses at Duke"
            image={duke_smif}
            imageAlt="Duke University courses"
            href="/writing/duke-courses"
          />
        </div>
      </Section>

      <Section variant="dark">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="c-text text-3xl font-bold mb-4">Let's Connect</h2>
          <p className="c-accent opacity-80 text-lg mb-8">Questions about something? Feel free to reach out!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" href="mailto:ismael.diaz@duke.edu">Email Me</Button>
            <Button variant="secondary" size="lg" href="https://www.linkedin.com/in/ismael-diaz-/" target="_blank" rel="noopener noreferrer">LinkedIn</Button>
          </div>
        </div>
      </Section>

      {/* Tiny footer for the giggles */}
      <div className="py-10 px-6 text-center">
        <p className="c-text opacity-55 text-sm">
          Website built in React + Vite + TS. A bunch of tailwind. Run with Vercel. With a couple of AI friends helping along the way.
        </p>
      </div>
    </main>
  )
}

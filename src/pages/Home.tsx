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
        <PCBTraceAnimation text="Hi, I'm Ismael Diaz" />
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
                <p className="text-lg" style={{ color: 'var(--color-text)', opacity: 0.9 }}>
                  ECE and CS student at Duke University
                </p>
                <p className="text-lg" style={{ color: 'var(--color-accent)', opacity: 0.95 }}>
                  Deep interests in embedded systems, computer architecture, and computer networks!
                </p>
              </div>
              <Button variant="primary" size="lg" href="/resume">
                View My Resume
              </Button>
            </div>

            {/* Right: Image - Increased height to h-80 / h-96 */}
            <div className="animate-slide-in-right flex justify-center">
              <img
                src={natureImage}
                alt="Ismael Diaz"
                className="w-full max-w-sm h-80 md:h-96 object-cover rounded-2xl shadow-2xl"
                style={{ 
                  borderColor: 'var(--color-accent)', 
                  borderWidth: '2px',
                  boxShadow: 'var(--shadow-gray-lg)'
                }}
              />
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
    </main>
  )
}
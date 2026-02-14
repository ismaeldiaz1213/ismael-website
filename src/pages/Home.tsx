import { HeroSection, Section, SectionHeader, FeatureCard, Button } from '../components/ui'
import natureImage from '../assets/nature-2025.jpeg'

export function Home() {
  return (
    <main>
      {/* Hero Section */}
      <HeroSection
        title="Hello, I'm Ismael Diaz"
        subtitle="ECE and CS student at Duke University"
        description="Deep interests in embedded systems, computer architecture, and computer networks!"
        image={
          <img
            src={natureImage}
            alt="Hero background"
            className="w-full h-96 object-cover rounded-lg shadow-xl border border-purple-500/30"
          />
        }
        actions={[
          {
            label: 'View My Projects',
            href: '/projects',
            variant: 'primary',
          },
          {
            label: 'Download Resume',
            variant: 'secondary',
          },
        ]}
      />

      {/* Featured Section */}
      <Section variant="gradient">
        <SectionHeader
          title="Featured"
          subtitle="I have a couple of projects that you can check out below! Some are complete, others are still in progress and I will be updating it when I have decent progress made! Additionally, I have created blogs with my thoughts on some of the Duke courses I've taken. It is mostly me just yapping about what I thought about what I learned, what I struggled with, and things future students should note when building their schedules."
        />

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <FeatureCard
            title="Check Out My Work"
            description="A collection of projects I've built showcasing my technical skills"
            icon="📁"
            href="/projects"
            accent="blue"
          />

          <FeatureCard
            title="My Duke Course Experience"
            description="Reflections on my courses at Duke"
            icon="💭"
            href="/duke-thoughts"
            accent="orange"
          />
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="dark">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Let's Connect</h2>
          <p className="text-lg text-gray-300 mb-8">
            Questions about something? Feel free to reach out!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" href="mailto:ismael.diaz@duke.edu">
              Get in Touch
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



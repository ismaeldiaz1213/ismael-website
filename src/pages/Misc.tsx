import { PageMeta } from "../components/PageMeta";
import { Section } from "../components/ui/Section";
import { SectionHeader } from "../components/ui/SectionHeader";


export function Misc() {
  return (
    <main>
          <PageMeta
            title="Misc"
            description="Random topics I choose to write anything about by Ismael Diaz, ECE + CS student at Duke University — embedded systems, FPGA, hardware, and software."
          />
          {/* Header */}
          <Section variant="light">
            <SectionHeader
              title="Misc"
              subtitle="This is truly the yap section of this website. This is where I talk about literally anything. It is truly unpredicatable what it is I could possibly talk about."
              centered={false}
            />
          </Section>
    
          {/* Projects Grid */}
          <Section>
            stuff
            {/* <ProjectList projects={projects} /> */}
          </Section>
        </main>
  )
}
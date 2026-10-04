import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Section, SectionHeader, FeatureCard, Button, LedStripDivider, BinaryDivider, Sticker, ArrowIcon } from '../components/ui'
import { PCBTraceAnimation } from '../components/PCBTraceAnimation'
import { RecentTakes } from '../components/RecentTakes'
import { PageMeta } from '../components/PageMeta'
import { getProjects, type Project } from '../lib/projects'
import natureImage from '../assets/nature-2025.jpeg'
import duke_smif from '../assets/duke_smif_image.jpeg'

const FEATURED_PROJECT = 'interactive-missions-displayboards'

function Hero() {
  return (
    <section className="px-3 sm:px-4 pt-4">
      <div className="mx-auto max-w-[1600px] rounded-[2rem] md:rounded-[2.75rem] p-1.5 bg-white/[0.05] border border-white/10">
        <div className="hero-board relative overflow-hidden rounded-[1.6rem] md:rounded-[2.35rem] h-[calc(100svh-6.5rem)] min-h-[600px] max-h-[940px]">
          <PCBTraceAnimation />
          <div className="hero-halo absolute inset-0 pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pb-48 md:pb-20 pointer-events-none">
            <h1 className="font-display font-extrabold text-cream leading-[0.85] tracking-[-0.045em] text-[clamp(4.75rem,15vw,11.5rem)] animate-fade-in-up">
              ¡Hola!
            </h1>
            <p className="accent-serif text-sunset text-[clamp(2.1rem,6vw,4.75rem)] leading-tight mt-1 pr-2 animate-fade-in-up [animation-delay:100ms]">
              welcome home, traveler.
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
            <p className="body-text text-cream/85 max-w-md text-base md:text-lg leading-relaxed">
              I'm <span className="font-semibold text-cream">Ismael Diaz</span>, an ECE + CS double major at Duke who
              loves the low-level stuff that makes computers tick.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/projects" size="lg">
                See my projects <ArrowIcon />
              </Button>
              <Button href="/resume" variant="secondary" size="lg" className="bg-night/50 backdrop-blur">
                Resume
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <Section className="pt-14 pb-4">
      <div className="grid lg:grid-cols-12 gap-4">
        <div className="surface lg:col-span-7 p-7 md:p-10 flex flex-col">
          <p className="eyebrow text-lime mb-3">about me</p>
          <h2 className="text-4xl md:text-5xl font-bold text-cream leading-[1.05] mb-6">
            Hi, I'm Ismael. <span className="accent-serif text-sunset pr-1">Nice to meet you.</span>
          </h2>
          <div className="space-y-4 body-text text-lg">
            <p>
              I was born and raised (and still living) in Houston, TX to two great Mexican parents. I have the privilege
              of double majoring in ECE + CS at Duke University. I enjoy learning and working on projects that have to do
              with the low-level details that make computers work. Whether it be processor design or the systems that let
              a computer interact with the outside world, it's all fun to learn! I also build websites and systems that
              can make a real difference in improving workflows and church members' experience.
            </p>
            <p>
              Lately I'm getting particularly interested in embedded systems, and in how edge devices can be hardware
              accelerated to run ML algorithms.
            </p>
          </div>
          <div className="mt-auto pt-8">
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <p className="text-cream/60 text-sm">On the off chance an employer stumbles across the site:</p>
              <Button href="/resume">View my resume <ArrowIcon /></Button>
            </div>
          </div>
        </div>

        <figure className="lg:col-span-5 relative overflow-hidden rounded-[1.75rem] border border-white/10 min-h-[420px]">
          <img
            src={natureImage}
            alt="Ismael Diaz at Harley's Dome View Area in Utah"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <Sticker tone="turquesa" tilt="right" className="absolute top-5 right-5">Road Trip Me 🚗</Sticker>
          <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl bg-night/75 backdrop-blur-md p-4 text-sm text-cream/85 leading-relaxed">
            📍 Taken in Utah on my road trip from Houston to Seattle:{' '}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Harley%27s%20Dome%20View%20Area%2C%20Thompson%20Springs%2C%20UT%2084540"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime underline underline-offset-2"
            >
              Harley&apos;s Dome View Area
            </a>
            , Thompson Springs, UT.
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}

// ─── Datasheet ───────────────────────────────────────────────────────────────

const SPECS: { key: string; value: React.ReactNode }[] = [
  { key: 'Part number',    value: <>IDIAZ-01 <span className="text-cream/50">(a.k.a. diazzism)</span></> },
  { key: 'Origin',         value: 'Houston, TX. Born, raised, still here.' },
  { key: 'Roots',          value: 'Mexican, courtesy of two great parents' },
  { key: 'Fab',            value: 'Duke University · ECE + CS double major' },
  { key: 'Current focus',  value: 'Launching the missions display project, maintaining the Planning Center check-ins roster jobs, and some research I’ll share later' },
  { key: 'Interfaces',     value: 'FPGAs · mmWave radar · STM32 bare-metal' },
  { key: 'Roadmap',        value: 'Embedded systems' },
  { key: 'Off-duty modes', value: 'Church · family · a good road trip' },
  { key: 'Languages',      value: 'C · Java · Verilog · TypeScript' },
  { key: 'Operating temp', value: 'Rated for Houston summers' },
]

const PINS_LEFT  = ['FPGA', 'STM32', 'mmWAVE', 'GND']
const PINS_RIGHT = ['VCC', 'CHURCH', 'FAMILY', 'ROAD TRIP'] // pins 8 → 5

function Pinout() {
  return (
    <div className="flex items-center font-mono text-[11px] text-cream/70 select-none" aria-hidden="true">
      <div className="flex flex-col gap-3 items-end">
        {PINS_LEFT.map((label, i) => (
          <div key={label} className="flex items-center gap-2 h-5">
            <span>{label}</span>
            <span className="text-cream/35 w-3 text-right">{i + 1}</span>
            <span className="w-5 h-2.5 rounded-l-sm bg-[#d8a24a]" />
          </div>
        ))}
      </div>
      <div className="relative w-24 self-stretch rounded-lg bg-[#0a1024] border border-sky/30 -my-2">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-2.5 rounded-b-full bg-navy border-x border-b border-sky/30" />
        <span className="absolute top-4 left-3 w-1.5 h-1.5 rounded-full bg-white/40" />
        <span className="absolute inset-0 flex items-center justify-center [writing-mode:vertical-rl] rotate-180 text-cream/80 tracking-[0.2em]">
          IDIAZ-01
        </span>
      </div>
      <div className="flex flex-col gap-3 items-start">
        {PINS_RIGHT.map((label, i) => (
          <div key={label} className="flex items-center gap-2 h-5">
            <span className="w-5 h-2.5 rounded-r-sm bg-[#d8a24a]" />
            <span className="text-cream/35 w-3">{8 - i}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Datasheet() {
  return (
    <Section className="pt-0">
      <div className="surface overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-6 md:px-8 py-4 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-lime animate-pulse-dot" />
            <p className="font-mono text-sm text-cream">IDIAZ-01 <span className="text-cream/50">· Datasheet</span></p>
          </div>
          <p className="font-mono text-xs text-cream/40 hidden sm:block">Rev. 2026 · Page 1 of 1</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_auto]">
          <dl className="grid sm:grid-cols-2">
            {SPECS.map(({ key, value }) => (
              <div key={key} className="px-6 md:px-8 py-4 border-b border-white/[0.06] sm:odd:border-r">
                <dt className="eyebrow text-cream/45 mb-1">{key}</dt>
                <dd className="text-cream/90 leading-snug">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="lg:border-l border-white/10 px-8 py-10 flex flex-col items-center justify-center gap-6">
            <p className="eyebrow text-cream/45">Pin configuration · DIP-8</p>
            <Pinout />
          </div>
        </div>
      </div>
    </Section>
  )
}

// ─── Work + writing ──────────────────────────────────────────────────────────

function SelectedWork() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    let mounted = true
    getProjects().then(p => { if (mounted) setProjects(p) })
    return () => { mounted = false }
  }, [])

  const featured = projects.find(p => p.slug === FEATURED_PROJECT)

  return (
    <Section>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <SectionHeader eyebrow="projects" title="Selected" accent="work." centered={false} />
        <Link to="/projects" className="group inline-flex items-center gap-3 text-cream font-medium shrink-0 sm:mb-5">
          All projects <span className="arrow-bubble"><ArrowIcon /></span>
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-4 mt-8">
        <FeatureCard
          title={featured?.title ?? 'Interactive Missions Display Boards'}
          description={featured?.excerpt ?? ''}
          image="/projects/interactive-missions-displayboards/display_completion.jpg"
          imageAlt="Interactive missions display boards in a church foyer"
          href={`/projects/${FEATURED_PROJECT}`}
          tag="Featured"
          className="lg:col-span-7 min-h-[360px] lg:min-h-[440px]"
        />

        <ul className="surface lg:col-span-5 p-2 divide-y divide-white/10">
          {projects.map(p => (
            <li key={p.slug}>
              <Link to={`/projects/${p.slug}`} className="group flex items-center gap-5 px-4 py-5 rounded-2xl hover:bg-white/[0.04] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-cream/45 mb-1.5">
                    {[p.category, p.date?.slice(0, 4)].filter(Boolean).join(' · ')}
                  </p>
                  <h3 className="text-xl font-bold text-cream leading-snug mb-2">{p.title}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags?.map(t => (
                      <span key={t} className="px-2.5 py-0.5 rounded-full bg-white/[0.06] text-cream/65 text-xs">{t}</span>
                    ))}
                  </div>
                </div>
                <ArrowIcon className="w-5 h-5 text-cream/40 -rotate-45 group-hover:text-lime group-hover:rotate-0 transition-all shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

function Writing() {
  return (
    <Section>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <SectionHeader eyebrow="writing" title="Hot takes" accent="& course notes." centered={false} />
        <Link to="/writing" className="group inline-flex items-center gap-3 text-cream font-medium shrink-0 sm:mb-5">
          All writing <span className="arrow-bubble"><ArrowIcon /></span>
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-4 mt-8">
        <div className="surface lg:col-span-7 p-2">
          <RecentTakes />
        </div>
        <FeatureCard
          title="Duke course reviews"
          description="Honest takes on my courses, beyond what a course eval can capture."
          image={duke_smif}
          imageAlt="A lab at Duke University"
          href="/writing/duke-courses"
          tag="🎓 Duke courses"
          className="lg:col-span-5 min-h-[360px]"
        />
      </div>
    </Section>
  )
}

function SideQuests() {
  return (
    <Section>
      <SectionHeader
        eyebrow="side quests"
        title="Built for"
        accent="the fun of it."
        subtitle="I do a lot of random stuff, but it's all for the fun of building."
        centered={false}
      />

      <div className="grid lg:grid-cols-2 gap-4 mt-8">
        {/* Mannabyte Labs */}
        <a
          href="https://mannabyte.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group panel-duke relative overflow-hidden p-7 md:p-10 flex flex-col min-h-[340px]"
        >
          <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative flex flex-col flex-1">
            <p className="eyebrow text-cream/70 mb-4">my freelance studio</p>
            <h3 className="text-4xl md:text-5xl text-cream tracking-[-0.03em] mb-4">
              <span className="font-extrabold">manna</span><span className="font-light">byte</span>{' '}
              <span className="font-light text-cream/70">Labs</span>
            </h3>
            <p className="accent-serif text-2xl md:text-3xl text-cream/90 mb-4">
              Custom websites you actually own. One price. No subscriptions.
            </p>
            <p className="body-text text-cream/75 max-w-lg">
              My freelance web studio, starting with custom websites for Houston small businesses, in English or
              Spanish. The name? A <em>byte</em> of manna.
            </p>
            <div className="mt-auto pt-8 flex items-center justify-between gap-4">
              <span className="font-mono text-sm text-cream">mannabyte.com</span>
              <span className="arrow-bubble"><ArrowIcon className="w-4 h-4 -rotate-45" /></span>
            </div>
          </div>
        </a>

        {/* Instructions Unclear */}
        <div className="surface overflow-hidden grid sm:grid-cols-[minmax(0,0.9fr)_1fr]">
          <Link to="/games" className="group relative block min-h-[260px] bg-night">
            <img
              src="/projects/instructions-unclear/cover.png"
              alt="A room from Instructions Unclear, with a red door"
              className="absolute inset-0 w-full h-full object-cover [image-rendering:pixelated] transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-night/70 backdrop-blur font-mono text-xs text-cream">
              PICO-8
            </span>
          </Link>
          <div className="p-7 md:p-8 flex flex-col">
            <p className="eyebrow text-[#b69cff] mb-3">a game I made</p>
            <h3 className="text-3xl font-bold text-cream leading-tight mb-3">Instructions Unclear</h3>
            <p className="body-text text-cream/70 mb-6">
              A tutorial whose narrator really doesn't want you to finish it. Whatever you do, don't press G.
            </p>
            <div className="mt-auto flex flex-wrap gap-3">
              <Button href="/games">Play it <ArrowIcon /></Button>
              <Button href="/projects/instructions-unclear" variant="secondary">Read the devlog</Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

// ─── Connect ─────────────────────────────────────────────────────────────────

const EMAIL = 'ismael.diaz@duke.edu'

const CONTACT_LINKS = [
  { label: 'Email',    detail: EMAIL,                  href: `mailto:${EMAIL}` },
  { label: 'LinkedIn', detail: 'in/ismael-diaz-',      href: 'https://www.linkedin.com/in/ismael-diaz-/' },
  { label: 'GitHub',   detail: 'ismaeldiaz1213',       href: 'https://github.com/ismaeldiaz1213' },
  { label: 'Resume',   detail: 'The official version', href: '/resume' },
]

function Connect() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <Section>
      <div className="panel-duke relative overflow-hidden grid lg:grid-cols-2 gap-4 p-3">
        <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />

        <div className="relative p-6 md:p-10 flex flex-col justify-center">
          <p className="eyebrow text-cream/70 flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse-dot" /> inbox open
          </p>
          <h2 className="text-5xl md:text-7xl font-extrabold text-cream leading-[0.95] tracking-[-0.04em]">
            Let's <span className="accent-serif font-normal">connect.</span>
          </h2>
          <p className="body-text text-cream/80 text-lg mt-5 mb-8">Questions about something? Feel free to reach out!</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="light" size="lg" href={`mailto:${EMAIL}`}>Email me <ArrowIcon /></Button>
            <Button variant="secondary" size="lg" onClick={copyEmail}>
              {copied ? 'Copied ✓' : 'Copy address'}
            </Button>
          </div>
        </div>

        <ul className="relative rounded-[1.75rem] bg-night/45 backdrop-blur p-2 divide-y divide-white/10">
          {CONTACT_LINKS.map(l => {
            const external = l.href.startsWith('http')
            const inner = (
              <>
                <div className="min-w-0">
                  <p className="text-2xl md:text-3xl font-bold text-cream">{l.label}</p>
                  <p className="font-mono text-xs text-cream/50 mt-1 truncate">{l.detail}</p>
                </div>
                <span className="arrow-bubble"><ArrowIcon /></span>
              </>
            )
            const cls = 'group flex items-center justify-between gap-4 px-5 py-6 rounded-2xl hover:bg-white/[0.05] transition-colors'
            return (
              <li key={l.label}>
                {l.href.startsWith('/')
                  ? <Link to={l.href} className={cls}>{inner}</Link>
                  : <a href={l.href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a>}
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}

export function Home() {
  return (
    <main>
      <PageMeta
        title="Ismael Diaz | ECE + CS Student at Duke University"
        description="Personal website of Ismael Diaz, ECE and Computer Science student at Duke University. Projects in embedded systems, FPGA design, hardware acceleration, and low-level computing."
        keywords="embedded systems, FPGA, hardware acceleration, low-level computing, Houston, Duke student"
      />

      <Hero />
      <LedStripDivider className="mt-10" />
      <About />
      <Datasheet />
      <BinaryDivider className="my-4" />
      <SelectedWork />
      <SideQuests />
      <Writing />
      <Connect />
    </main>
  )
}

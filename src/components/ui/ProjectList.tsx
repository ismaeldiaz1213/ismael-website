import { ProjectCard } from './ProjectCard'

interface ProjectSummary {
  id: number | string
  slug?: string
  title: string
  description?: string
  excerpt?: string
  tags?: string[]
  date?: string
  icon?: string
  category?: string
  semester?: string
}

interface ProjectListProps {
  projects: ProjectSummary[]
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {projects.map((p) => (
        <ProjectCard key={(p as any).slug || p.id} id={(p as any).slug || p.id} title={p.title} description={(p as any).description || p.excerpt || ''} tags={(p as any).tags || []} date={(p as any).date || ''} icon={(p as any).icon} category={(p as any).category} semester={(p as any).semester} />
      ))}
    </div>
  )
}

export default ProjectList

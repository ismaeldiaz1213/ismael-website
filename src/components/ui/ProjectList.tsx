import { ProjectCard } from './ProjectCard'
import { type Project } from '../../lib/projects'

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <ProjectCard 
          key={project.slug} 
          id={project.slug} 
          title={project.title} 
          description={project.excerpt || ''} 
          tags={project.tags || []} 
          date={project.date || ''} 
          category={project.category}
          semester={project.semester}
        />
      ))}
    </div>
  )
}

export default ProjectList

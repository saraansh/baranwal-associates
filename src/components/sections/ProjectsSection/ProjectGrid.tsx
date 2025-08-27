'use client';

import { ProjectCard } from './ProjectCard';

type Project = {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  client: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  area: string;
  duration: string;
  status: string;
};

type ProjectGridProps = {
  projects: Project[];
  onProjectClick: (project: Project) => void;
};

export function ProjectGrid({ projects, onProjectClick }: ProjectGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onCardClick={onProjectClick}
        />
      ))}
    </div>
  );
}

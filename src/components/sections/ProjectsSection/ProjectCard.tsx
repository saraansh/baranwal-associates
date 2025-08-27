'use client';

import type { Project } from './projectsData';
import { Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

type ProjectCardProps = {
  project: Project;
  onCardClick: (project: Project) => void;
};

export function ProjectCard({ project, onCardClick }: ProjectCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border border-border bg-background shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
      onClick={() => onCardClick(project)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.images[0]}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Category badge */}
        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground backdrop-blur-sm">
          {project.category}
        </Badge>

        {/* Status badge */}
        <Badge
          variant={project.status === 'Completed' ? 'default' : 'secondary'}
          className="absolute top-3 right-3 backdrop-blur-sm"
        >
          {project.status}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
          {project.title}
        </h3>

        {/* Minimal project details */}
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{project.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>{project.year}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

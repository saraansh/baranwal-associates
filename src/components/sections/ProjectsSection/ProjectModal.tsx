'use client';

import { Building, ChevronLeft, ChevronRight, MapPin, Ruler, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

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

type ProjectModalProps = {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  modalImageIndex: number;
  nextModalImage: () => void;
  prevModalImage: () => void;
};

export function ProjectModal({
  project,
  isOpen,
  onClose,
  modalImageIndex,
  nextModalImage,
  prevModalImage,
}: ProjectModalProps) {
  if (!project) {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold text-foreground">
            {project.title}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <ProjectModalContent
            project={project}
            modalImageIndex={modalImageIndex}
            nextModalImage={nextModalImage}
            prevModalImage={prevModalImage}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

type ProjectModalContentProps = {
  project: Project;
  modalImageIndex: number;
  nextModalImage: () => void;
  prevModalImage: () => void;
};

function ProjectModalContent({ project, modalImageIndex, nextModalImage, prevModalImage }: ProjectModalContentProps) {
  return (
    <div className="space-y-6 p-6">
      {/* Image Gallery at the top */}
      <div className="relative h-64 overflow-hidden rounded-lg md:h-80">
        <img
          src={project.images[modalImageIndex]}
          alt={`${project.title} - Main view`}
          className="h-full w-full object-cover"
        />

        {project.images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevModalImage}
              className="absolute top-1/2 left-2 -translate-y-1/2 transform rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={nextModalImage}
              className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Image indicators */}
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform space-x-1">
              {project.images.map((_, index) => (
                <div
                  key={`modal-indicator-${project.id}-${index}`}
                  className={`h-2 w-2 rounded-full ${index === modalImageIndex ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>

            {/* Category badge */}
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
              {project.category}
            </Badge>
          </>
        )}
      </div>

      {/* Project details */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{project.status}</Badge>
          <Badge variant="outline">{project.year}</Badge>
        </div>

        <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{project.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{project.client}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            <span>{project.area}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>{project.duration}</span>
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-foreground">Project Description</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.fullDescription}
          </p>
        </div>

        {/* Image thumbnails */}
        {project.images.length > 1 && (
          <div>
            <h4 className="mb-2 font-semibold text-foreground">Gallery</h4>
            <div className="grid grid-cols-3 gap-2">
              {project.images.map((image, index) => (
                <button
                  key={`modal-thumbnail-${project.id}-${index}`}
                  type="button"
                  onClick={() => {
                    // This would need to be handled by the parent component
                    // For now, we'll just show the current image
                  }}
                  className={`relative h-20 overflow-hidden rounded-lg border-2 transition-all ${
                    index === modalImageIndex ? 'border-primary' : 'border-border'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${project.title} - Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

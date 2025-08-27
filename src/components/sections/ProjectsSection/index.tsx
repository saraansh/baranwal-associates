'use client';

import type { Project } from './projectsData';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ProjectCarousel } from './ProjectCarousel';
import { ProjectModal } from './ProjectModal';
import { projectsData } from './projectsData';

export function ProjectsSection() {
  const t = useTranslations('Projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setModalImageIndex(0);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const nextModalImage = () => {
    if (selectedProject) {
      setModalImageIndex(prev =>
        prev === selectedProject.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevModalImage = () => {
    if (selectedProject) {
      setModalImageIndex(prev =>
        prev === 0 ? selectedProject.images.length - 1 : prev - 1,
      );
    }
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }

    return undefined;
  }, [isModalOpen]);

  return (
    <section id="projects" className="pattern-building-blocks bg-gradient-to-br from-background via-secondary/10 to-accent/5 py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              {t('title')}
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              {t('subtitle')}
            </p>
            <div className="mx-auto h-1 w-24 bg-primary" />
          </div>

          {/* Projects Carousel */}
          <ProjectCarousel
            projects={projectsData}
            onProjectClick={handleProjectClick}
          />

          {/* Project Modal */}
          <ProjectModal
            project={selectedProject}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            modalImageIndex={modalImageIndex}
            nextModalImage={nextModalImage}
            prevModalImage={prevModalImage}
          />
        </div>
      </div>
    </section>
  );
}

'use client';

import type { Project } from './projectsData';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from './ProjectCard';

type ProjectCarouselProps = {
  projects: Project[];
  onProjectClick: (project: Project) => void;
};

export function ProjectCarousel({ projects, onProjectClick }: ProjectCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate items per page based on screen size
  // Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns, Large: 4 columns
  // 2 rows × responsive columns = items per page
  const getItemsPerPage = () => {
    if (typeof window === 'undefined') {
      return 6;
    } // Default for SSR

    const width = window.innerWidth;
    if (width >= 1536) {
      return 8;
    } // 2 rows × 4 columns (xl screens)
    if (width >= 1024) {
      return 6;
    } // 2 rows × 3 columns (lg screens)
    if (width >= 768) {
      return 4;
    } // 2 rows × 2 columns (md screens)
    return 2; // 2 rows × 1 column (sm screens)
  };

  const [itemsPerPage, setItemsPerPage] = useState(() => getItemsPerPage());
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  // Update items per page on window resize
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = getItemsPerPage();
      setItemsPerPage(newItemsPerPage);
      // Reset to first page if current page becomes invalid
      const maxPage = Math.ceil(projects.length / newItemsPerPage) - 1;
      if (currentPage > maxPage) {
        setCurrentPage(0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPage, projects.length]);

  // Get current page projects
  const currentProjects = projects.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  // Navigation functions
  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => (prev + 1) % totalPages);
  }, [totalPages]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevPage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextPage();
          break;
        case 'Home':
          e.preventDefault();
          goToPage(0);
          break;
        case 'End':
          e.preventDefault();
          goToPage(totalPages - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [totalPages, goToPrevPage, goToNextPage, goToPage]);

  // Touch/Mouse drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    setDragStart(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) {
      return;
    }

    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const offset = clientX - dragStart;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);

    // Determine if we should change pages based on drag distance
    const threshold = 100; // minimum drag distance to trigger page change

    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        goToPrevPage();
      } else {
        goToNextPage();
      }
    }

    setDragOffset(0);
  };

  // Prevent text selection during drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      role="region"
      aria-label="Projects carousel"
      aria-live="polite"
    >
      {/* Carousel Container with padding to prevent hover cutoff */}
      <div
        ref={carouselRef}
        className="relative overflow-hidden px-4 py-2"
        role="button"
        tabIndex={0}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
          }
        }}
      >
        <div
          className="grid grid-cols-1 gap-4 transition-transform duration-300 ease-out md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
          style={{
            transform: `translateX(${dragOffset}px)`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          {currentProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onCardClick={onProjectClick}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {totalPages > 1 && (
        <>
          {/* Previous Button */}
          <Button
            onClick={goToPrevPage}
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-2 z-10 -translate-y-1/2 border-2 bg-background/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-background"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Next Button */}
          <Button
            onClick={goToNextPage}
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-2 z-10 -translate-y-1/2 border-2 bg-background/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-background"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {/* Page Indicators */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToPage(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
                index === currentPage
                  ? 'scale-125 bg-primary'
                  : 'bg-muted hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to page ${index + 1}`}
              aria-current={index === currentPage ? 'true' : 'false'}
            />
          ))}
        </div>
      )}

      {/* Page Info */}
      {totalPages > 1 && (
        <div className="mt-3 text-center text-sm text-muted-foreground">
          Page
          {' '}
          {currentPage + 1}
          {' '}
          of
          {' '}
          {totalPages}
        </div>
      )}

      {/* Keyboard Navigation Hint */}
      <div className="mt-2 text-center text-xs text-muted-foreground">
        Use arrow keys to navigate • Click and drag to swipe
      </div>
    </div>
  );
}

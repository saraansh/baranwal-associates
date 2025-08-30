'use client';

import { useEffect, useState } from 'react';

export function HeroBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Hero background image - optimized for mobile */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${isMobile ? '/assets/images/hero-bg-mobile.jpg' : '/assets/images/hero-bg.png'})`,
        }}
      />

      {/* Overlay with gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/40" />

      {/* Geometric background elements - reduced for mobile */}
      <div className="absolute inset-0">
        {/* Large architectural frame - hidden on mobile for performance */}
        <div className="absolute top-16 left-8 hidden h-40 w-40 rotate-45 animate-pulse border-2 border-primary/40 bg-primary/5 backdrop-blur-sm md:block" style={{ animationDuration: '4s' }} />
        <div className="absolute top-16 left-8 hidden h-40 w-40 rotate-45 animate-pulse border-2 border-primary/20 bg-primary/10 backdrop-blur-sm md:block" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />

        {/* Floating geometric shapes - reduced on mobile */}
        <div className="absolute top-32 right-16 hidden h-28 w-28 rotate-12 animate-bounce border-2 border-accent/50 bg-accent/10 backdrop-blur-sm sm:block" style={{ animationDuration: '3s' }} />
        <div className="absolute top-32 right-16 hidden h-28 w-28 rotate-12 animate-bounce border-2 border-accent/30 bg-accent/15 backdrop-blur-sm sm:block" style={{ animationDuration: '3s', animationDelay: '0.3s' }} />

        {/* Bottom left architectural element - hidden on mobile */}
        <div className="absolute bottom-32 left-12 hidden h-24 w-24 -rotate-12 animate-pulse border-2 border-secondary/60 bg-secondary/10 backdrop-blur-sm md:block" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-12 hidden h-24 w-24 -rotate-12 animate-pulse border-2 border-secondary/40 bg-secondary/15 backdrop-blur-sm md:block" style={{ animationDuration: '5s', animationDelay: '1.5s' }} />

        {/* Bottom right geometric shape - hidden on mobile */}
        <div className="absolute right-20 bottom-16 hidden h-32 w-32 rotate-45 animate-bounce border-2 border-muted/50 bg-muted/10 backdrop-blur-sm md:block" style={{ animationDuration: '4s', animationDelay: '2s' }} />
        <div className="absolute right-20 bottom-16 hidden h-32 w-32 rotate-45 animate-bounce border-2 border-muted/30 bg-muted/15 backdrop-blur-sm md:block" style={{ animationDuration: '4s', animationDelay: '2.3s' }} />

        {/* Additional floating elements - hidden on mobile */}
        <div className="absolute top-1/3 right-1/3 hidden h-12 w-12 -rotate-45 animate-bounce border border-accent/50 bg-accent/8 backdrop-blur-sm lg:block" style={{ animationDuration: '3.5s', animationDelay: '1.2s' }} />
        <div className="absolute bottom-1/3 left-1/2 hidden h-20 w-20 rotate-180 animate-pulse border border-secondary/40 bg-secondary/8 backdrop-blur-sm lg:block" style={{ animationDuration: '7s', animationDelay: '0.4s' }} />
      </div>

      {/* Grid pattern overlay - reduced opacity on mobile */}
      <div
        className="absolute inset-0 opacity-5 md:opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating architectural elements - hidden on mobile for performance */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {/* Architectural lines with enhanced visibility */}
        <div className="absolute top-1/4 left-1/4 h-24 w-3 rotate-45 animate-pulse bg-primary/40 shadow-lg backdrop-blur-sm" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
        <div className="absolute top-1/4 left-1/4 h-24 w-1 rotate-45 animate-pulse bg-primary/60 shadow-lg backdrop-blur-sm" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />

        <div className="absolute top-1/3 right-1/4 h-20 w-3 -rotate-12 animate-pulse bg-accent/50 shadow-lg backdrop-blur-sm" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }} />
        <div className="absolute top-1/3 right-1/4 h-20 w-1 -rotate-12 animate-pulse bg-accent/70 shadow-lg backdrop-blur-sm" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }} />

        <div className="absolute bottom-1/3 left-1/3 h-28 w-3 rotate-12 animate-pulse bg-secondary/40 shadow-lg backdrop-blur-sm" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        <div className="absolute bottom-1/3 left-1/3 h-28 w-1 rotate-12 animate-pulse bg-secondary/60 shadow-lg backdrop-blur-sm" style={{ animationDelay: '2s', animationDuration: '5s' }} />

        <div className="absolute right-1/3 bottom-1/4 h-22 w-3 -rotate-45 animate-pulse bg-muted/40 shadow-lg backdrop-blur-sm" style={{ animationDelay: '2.5s', animationDuration: '4.5s' }} />
        <div className="absolute right-1/3 bottom-1/4 h-22 w-1 -rotate-45 animate-pulse bg-muted/60 shadow-lg backdrop-blur-sm" style={{ animationDelay: '2.5s', animationDuration: '4.5s' }} />

        {/* Additional architectural elements */}
        <div className="absolute top-1/2 left-1/6 h-16 w-2 rotate-90 animate-bounce bg-primary/30 shadow-lg backdrop-blur-sm" style={{ animationDelay: '0.8s', animationDuration: '3s' }} />
        <div className="absolute top-2/3 right-1/6 h-18 w-2 -rotate-30 animate-bounce bg-accent/40 shadow-lg backdrop-blur-sm" style={{ animationDelay: '1.8s', animationDuration: '3.2s' }} />
        <div className="absolute bottom-1/4 left-2/3 h-14 w-2 rotate-60 animate-pulse bg-secondary/35 shadow-lg backdrop-blur-sm" style={{ animationDelay: '3s', animationDuration: '6s' }} />
      </div>
    </>
  );
}

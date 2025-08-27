'use client';

export function HeroBackground() {
  return (
    <>
      {/* Background with gradient and architectural elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/20" />

      {/* Geometric background elements */}
      <div className="absolute inset-0">
        {/* Large architectural frame */}
        <div className="absolute top-16 left-8 h-40 w-40 rotate-45 animate-pulse border-2 border-primary/40 bg-primary/5 backdrop-blur-sm" style={{ animationDuration: '4s' }} />
        <div className="absolute top-16 left-8 h-40 w-40 rotate-45 animate-pulse border-2 border-primary/20 bg-primary/10 backdrop-blur-sm" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />

        {/* Floating geometric shapes */}
        <div className="absolute top-32 right-16 h-28 w-28 rotate-12 animate-bounce border-2 border-accent/50 bg-accent/10 backdrop-blur-sm" style={{ animationDuration: '3s' }} />
        <div className="absolute top-32 right-16 h-28 w-28 rotate-12 animate-bounce border-2 border-accent/30 bg-accent/15 backdrop-blur-sm" style={{ animationDuration: '3s', animationDelay: '0.3s' }} />

        {/* Bottom left architectural element */}
        <div className="absolute bottom-32 left-12 h-24 w-24 -rotate-12 animate-pulse border-2 border-secondary/60 bg-secondary/10 backdrop-blur-sm" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-12 h-24 w-24 -rotate-12 animate-pulse border-2 border-secondary/40 bg-secondary/15 backdrop-blur-sm" style={{ animationDuration: '5s', animationDelay: '1.5s' }} />

        {/* Bottom right geometric shape */}
        <div className="absolute right-20 bottom-16 h-32 w-32 rotate-45 animate-bounce border-2 border-muted/50 bg-muted/10 backdrop-blur-sm" style={{ animationDuration: '4s', animationDelay: '2s' }} />
        <div className="absolute right-20 bottom-16 h-32 w-32 rotate-45 animate-bounce border-2 border-muted/30 bg-muted/15 backdrop-blur-sm" style={{ animationDuration: '4s', animationDelay: '2.3s' }} />

        {/* Additional floating elements */}
        <div className="absolute top-1/2 left-1/4 h-16 w-16 rotate-90 animate-pulse border border-primary/40 bg-primary/5 backdrop-blur-sm" style={{ animationDuration: '6s', animationDelay: '0.8s' }} />
        <div className="absolute top-1/3 right-1/3 h-12 w-12 -rotate-45 animate-bounce border border-accent/50 bg-accent/8 backdrop-blur-sm" style={{ animationDuration: '3.5s', animationDelay: '1.2s' }} />
        <div className="absolute bottom-1/3 left-1/2 h-20 w-20 rotate-180 animate-pulse border border-secondary/40 bg-secondary/8 backdrop-blur-sm" style={{ animationDuration: '7s', animationDelay: '0.4s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating architectural elements */}
      <div className="pointer-events-none absolute inset-0">
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

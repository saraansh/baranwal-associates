'use client';

export function HeroBackground() {
  return (
    <>
      {/* Background with gradient and architectural elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-gray-300 dark:from-black dark:via-gray-950 dark:to-gray-900" />

      {/* Geometric background elements */}
      <div className="absolute inset-0">
        {/* Large architectural frame - left side (lighter) */}
        <div className="absolute top-16 left-8 h-40 w-40 rotate-45 animate-pulse border-2 border-gray-200 bg-white/40 backdrop-blur-sm dark:border-gray-950 dark:bg-black/40" style={{ animationDuration: '4s' }} />
        <div className="absolute top-16 left-8 h-40 w-40 rotate-45 animate-pulse border-2 border-gray-300 bg-gray-50/50 backdrop-blur-sm dark:border-gray-900 dark:bg-gray-950/50" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />

        {/* Floating geometric shapes - right side (darker) */}
        <div className="absolute top-32 right-16 h-28 w-28 rotate-12 animate-bounce border-2 border-gray-400 bg-gray-300/50 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50" style={{ animationDuration: '3s' }} />
        <div className="absolute top-32 right-16 h-28 w-28 rotate-12 animate-bounce border-2 border-gray-500 bg-gray-400/60 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/60" style={{ animationDuration: '3s', animationDelay: '0.3s' }} />

        {/* Bottom left architectural element - left side (lighter) */}
        <div className="absolute bottom-32 left-12 h-24 w-24 -rotate-12 animate-pulse border-2 border-gray-300 bg-gray-100/40 backdrop-blur-sm dark:border-gray-900 dark:bg-gray-950/40" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-12 h-24 w-24 -rotate-12 animate-pulse border-2 border-gray-400 bg-gray-200/50 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50" style={{ animationDuration: '5s', animationDelay: '1.5s' }} />

        {/* Bottom right geometric shape - right side (darker) */}
        <div className="absolute right-20 bottom-16 h-32 w-32 rotate-45 animate-bounce border-2 border-gray-500 bg-gray-400/50 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/50" style={{ animationDuration: '4s', animationDelay: '2s' }} />
        <div className="absolute right-20 bottom-16 h-32 w-32 rotate-45 animate-bounce border-2 border-gray-600 bg-gray-500/60 backdrop-blur-sm dark:border-gray-500 dark:bg-gray-700/60" style={{ animationDuration: '4s', animationDelay: '2.3s' }} />

        {/* Additional floating elements - varying positions */}
        <div className="absolute top-1/3 right-1/3 h-12 w-12 -rotate-45 animate-bounce border border-gray-400 bg-gray-300/40 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/40" style={{ animationDuration: '3.5s', animationDelay: '1.2s' }} />
        <div className="absolute bottom-1/3 left-1/2 h-20 w-20 rotate-180 animate-pulse border border-gray-300 bg-gray-200/30 backdrop-blur-sm dark:border-gray-900 dark:bg-gray-950/30" style={{ animationDuration: '7s', animationDelay: '0.4s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-3 dark:opacity-8"
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
        {/* Architectural lines with enhanced visibility - left side (lighter) */}
        <div className="absolute top-1/4 left-1/4 h-24 w-3 rotate-45 animate-pulse bg-gray-200/70 shadow-lg backdrop-blur-sm dark:bg-gray-900/70" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
        <div className="absolute top-1/4 left-1/4 h-24 w-1 rotate-45 animate-pulse bg-gray-300/90 shadow-lg backdrop-blur-sm dark:bg-gray-800/90" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />

        {/* Architectural lines - right side (darker) */}
        <div className="absolute top-1/3 right-1/4 h-20 w-3 -rotate-12 animate-pulse bg-gray-400/80 shadow-lg backdrop-blur-sm dark:bg-gray-700/80" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }} />
        <div className="absolute top-1/3 right-1/4 h-20 w-1 -rotate-12 animate-pulse bg-gray-500/95 shadow-lg backdrop-blur-sm dark:bg-gray-600/95" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }} />

        {/* Architectural lines - center-left (medium) */}
        <div className="absolute bottom-1/3 left-1/3 h-28 w-3 rotate-12 animate-pulse bg-gray-300/60 shadow-lg backdrop-blur-sm dark:bg-gray-800/60" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        <div className="absolute bottom-1/3 left-1/3 h-28 w-1 rotate-12 animate-pulse bg-gray-400/80 shadow-lg backdrop-blur-sm dark:bg-gray-700/80" style={{ animationDelay: '2s', animationDuration: '5s' }} />

        {/* Architectural lines - center-right (darker) */}
        <div className="absolute right-1/3 bottom-1/4 h-22 w-3 -rotate-45 animate-pulse bg-gray-400/70 shadow-lg backdrop-blur-sm dark:bg-gray-700/70" style={{ animationDelay: '2.5s', animationDuration: '4.5s' }} />
        <div className="absolute right-1/3 bottom-1/4 h-22 w-1 -rotate-45 animate-pulse bg-gray-500/90 shadow-lg backdrop-blur-sm dark:bg-gray-600/90" style={{ animationDelay: '2.5s', animationDuration: '4.5s' }} />

        {/* Additional architectural elements - varying positions */}
        <div className="absolute top-1/2 left-1/6 h-16 w-2 rotate-90 animate-bounce bg-gray-200/60 shadow-lg backdrop-blur-sm dark:bg-gray-900/60" style={{ animationDelay: '0.8s', animationDuration: '3s' }} />
        <div className="absolute top-2/3 right-1/6 h-18 w-2 -rotate-30 animate-bounce bg-gray-400/70 shadow-lg backdrop-blur-sm dark:bg-gray-700/70" style={{ animationDelay: '1.8s', animationDuration: '3.2s' }} />
        <div className="absolute bottom-1/4 left-2/3 h-14 w-2 rotate-60 animate-pulse bg-gray-300/55 shadow-lg backdrop-blur-sm dark:bg-gray-800/55" style={{ animationDelay: '3s', animationDuration: '6s' }} />
      </div>
    </>
  );
}

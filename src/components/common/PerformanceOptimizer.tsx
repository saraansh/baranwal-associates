'use client';

import { useEffect } from 'react';

type PerformanceOptimizerProps = {
  preloadImages?: string[];
  preloadFonts?: string[];
};

// Default values to avoid array expressions in default props
const defaultPreloadImages: string[] = [];
const defaultPreloadFonts: string[] = [];

export function PerformanceOptimizer({
  preloadImages: _preloadImages = defaultPreloadImages,
  preloadFonts: _preloadFonts = defaultPreloadFonts,
}: PerformanceOptimizerProps) {
  useEffect(() => {
    // Check if mobile device
    const isMobile = window.innerWidth < 768;

    // Optimize font loading - use system fonts to avoid blocking
    const optimizeFonts = () => {
      // Use system fonts to avoid Google Fonts CSP issues
      document.documentElement.style.fontFamily
        = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    };

    // Optimize images with lazy loading - only on desktop
    const optimizeImages = () => {
      if (isMobile) {
        return; // Skip on mobile for performance
      }

      const images = document.querySelectorAll('img[loading="lazy"]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || img.src;
            img.srcset = img.dataset.srcset || img.srcset;
            img.onload = () => img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // Add resource hints - optimized for mobile
    const addResourceHints = () => {
      // DNS prefetch for critical domains
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = 'https://fonts.googleapis.com';
      document.head.appendChild(dnsPrefetch);

      // Preconnect for critical resources
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://fonts.gstatic.com';
      preconnect.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect);

      // Preload critical images only on desktop
      if (!isMobile && _preloadImages.length > 0) {
        _preloadImages.forEach((image) => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = image;
          document.head.appendChild(link);
        });
      }
    };

    // Register service worker - only on desktop for better performance
    const registerServiceWorker = async () => {
      if (isMobile) {
        return; // Skip on mobile for performance
      }

      if ('serviceWorker' in navigator) {
        try {
          // Check if service worker file exists before registering
          const response = await fetch('/sw.js', { method: 'HEAD' });
          if (response.ok) {
            await navigator.serviceWorker.register('/sw.js');
          }
        } catch {
          // Service worker registration failed or file doesn't exist
        }
      }
    };

    // Defer non-critical scripts
    const deferNonCriticalScripts = () => {
      const scripts = document.querySelectorAll('script[data-defer]');
      scripts.forEach((script) => {
        script.setAttribute('defer', 'true');
      });
    };

    // Optimize animations for mobile
    const optimizeAnimations = () => {
      if (isMobile) {
        // Reduce animation complexity on mobile
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
        document.documentElement.style.setProperty('--transition-duration', '0.2s');
      }
    };

    // Initialize optimizations
    optimizeFonts();
    optimizeImages();
    addResourceHints();
    deferNonCriticalScripts();
    optimizeAnimations();

    // Register service worker after a delay to not block initial load
    const timeoutId = setTimeout(registerServiceWorker, 2000);

    return () => {
      // Cleanup event listeners if any
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array as optimizations run once

  return null;
}

export const performanceUtils = {
  measureLCP: () => {
    // Measure Largest Contentful Paint
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        // console.log('LCP:', lastEntry.startTime);
      }
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  },
  measureFID: () => {
    // Measure First Input Delay
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((_entry) => {
        // console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    observer.observe({ entryTypes: ['first-input'] });
  },
  measureCLS: () => {
    // Measure Cumulative Layout Shift
    let _clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          _clsValue += (entry as any).value;
        }
      });
      // console.log('CLS:', clsValue);
    });
    observer.observe({ entryTypes: ['layout-shift'] });
  },
  measureTBT: () => {
    // Measure Total Blocking Time
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      let _totalBlockingTime = 0;
      entries.forEach((entry) => {
        if (entry.duration > 50) {
          _totalBlockingTime += entry.duration - 50;
        }
      });
      // console.log('TBT:', totalBlockingTime);
    });
    observer.observe({ entryTypes: ['longtask'] });
  },
};

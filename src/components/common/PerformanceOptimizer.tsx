'use client';

import { useEffect } from 'react';

type PerformanceOptimizerProps = {
  preloadImages?: string[];
  preloadFonts?: string[];
  deferScripts?: string[];
};

// Default values to avoid array expressions in default props
const defaultPreloadImages: string[] = [];
const defaultPreloadFonts: string[] = [];
const defaultDeferScripts: string[] = [];

export function PerformanceOptimizer({
  preloadImages = defaultPreloadImages,
  preloadFonts = defaultPreloadFonts,
  deferScripts = defaultDeferScripts,
}: PerformanceOptimizerProps) {
  useEffect(() => {
    // Preload critical images
    preloadImages.forEach((imageSrc) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageSrc;
      document.head.appendChild(link);
    });

    // Preload critical fonts
    preloadFonts.forEach((fontSrc) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = fontSrc;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Defer non-critical scripts
    deferScripts.forEach((scriptSrc) => {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.defer = true;
      script.async = true;
      document.head.appendChild(script);
    });

    // Add resource hints for external domains
    const externalDomains = [
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    externalDomains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Add preconnect for critical external resources
    const criticalDomains = [
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
    ];

    criticalDomains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Optimize images with lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));

    // Add loading="lazy" to non-critical images
    const nonCriticalImages = document.querySelectorAll('img:not([loading])');
    nonCriticalImages.forEach((img) => {
      if (!(img instanceof HTMLImageElement)) {
        return;
      }
      if (!img.classList.contains('critical')) {
        img.loading = 'lazy';
      }
    });

    // Optimize font loading
    const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    fontLinks.forEach((link) => {
      link.setAttribute('media', 'print');
      link.setAttribute('onload', 'this.media=\'all\'');
    });

    // Add service worker for caching (if available)
    const handleServiceWorkerRegistration = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then((_registration) => {
            // Service worker registered successfully
            // You can add analytics tracking here if needed
          })
          .catch((_registrationError) => {
            // Service worker registration failed
            // You can add error tracking here if needed
          });
      }
    };

    window.addEventListener('load', handleServiceWorkerRegistration);

    // Cleanup function
    return () => {
      // Remove dynamically added resource hints
      const dynamicLinks = document.querySelectorAll('link[rel="dns-prefetch"], link[rel="preconnect"], link[rel="preload"]');
      dynamicLinks.forEach(link => link.remove());

      // Disconnect observers
      imageObserver.disconnect();

      // Remove event listener
      window.removeEventListener('load', handleServiceWorkerRegistration);
    };
  }, [preloadImages, preloadFonts, deferScripts]);

  return null;
}

// Performance monitoring utilities
export const performanceUtils = {
  // Measure Core Web Vitals
  measureCoreWebVitals: () => {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          // Send to analytics
          if (window.gtag) {
            window.gtag('event', 'LCP', {
              value: Math.round(lastEntry.startTime),
              event_category: 'Web Vitals',
            });
          }
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (window.gtag) {
            window.gtag('event', 'FID', {
              value: Math.round((entry as any).processingStart - entry.startTime),
              event_category: 'Web Vitals',
            });
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;

            if (window.gtag) {
              window.gtag('event', 'CLS', {
                value: Math.round(clsValue * 1000) / 1000,
                event_category: 'Web Vitals',
              });
            }
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  },

  // Measure page load time
  measurePageLoadTime: () => {
    const handleLoad = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;

      if (window.gtag) {
        window.gtag('event', 'page_load_time', {
          value: Math.round(loadTime),
          event_category: 'Performance',
        });
      }
    };

    window.addEventListener('load', handleLoad);

    // Return cleanup function
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  },

  // Optimize images
  optimizeImages: () => {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      // Add loading="lazy" to images below the fold
      if (!img.classList.contains('critical')) {
        img.loading = 'lazy';
      }

      // Add error handling
      img.addEventListener('error', () => {
        img.src = '/assets/images/placeholder.jpg';
        img.alt = 'Image not available';
      });
    });
  },

  // Optimize fonts
  optimizeFonts: () => {
    // Use font-display: swap for better performance
    const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    fontLinks.forEach((link) => {
      const url = new URL(link.getAttribute('href') || '');
      url.searchParams.set('display', 'swap');
      link.setAttribute('href', url.toString());
    });
  },
};

// Declare global gtag for TypeScript
declare global {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

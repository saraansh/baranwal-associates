'use client';

import { useEffect } from 'react';
import { StructuredData } from './StructuredData';

type SEOOptimizerProps = {
  pageType: 'homepage' | 'about' | 'services' | 'projects' | 'contact';
  currentUrl: string;
  locale: string;
};

export function SEOOptimizer({ pageType, currentUrl, locale }: SEOOptimizerProps) {
  useEffect(() => {
    // Ensure all parameters are defined before proceeding
    if (!pageType || !currentUrl || !locale) {
      console.warn('SEOOptimizer: Missing required parameters', { pageType, currentUrl, locale });
      return;
    }

    // Remove existing meta tags to avoid duplicates
    const existingMetaTags = document.querySelectorAll('meta[name="description"], meta[name="viewport"], meta[name="language"], meta[name="X-UA-Compatible"], meta[name="referrer"], meta[name="theme-color"], meta[name="mobile-web-app-capable"], meta[name="apple-mobile-web-app-capable"], meta[name="apple-mobile-web-app-status-bar-style"], meta[name="apple-mobile-web-app-title"], meta[name="application-name"]');
    existingMetaTags.forEach(tag => tag.remove());

    // Remove existing hreflang links
    const existingHreflangLinks = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflangLinks.forEach(link => link.remove());

    // Add essential meta tags
    const metaTags = [
      { name: 'description', content: getPageDescription(pageType) },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5' },
      { name: 'language', content: locale === 'hi' ? 'hi-IN' : 'en-US' },
      { name: 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      { name: 'theme-color', content: '#0f172a' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'Baranwal Associates' },
      { name: 'application-name', content: 'Baranwal Associates' },
      { name: 'format-detection', content: 'telephone=no, email=no, address=no' },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'googlebot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'author', content: 'Er. Anand Prakash Baranwal' },
      { name: 'creator', content: 'Baranwal Associates' },
      { name: 'publisher', content: 'Baranwal Associates' },
      { name: 'keywords', content: getPageKeywords(pageType) },
      { name: 'geo.region', content: 'IN-MH' },
      { name: 'geo.placename', content: 'Mumbai' },
      { name: 'geo.position', content: '19.0760;72.8777' },
      { name: 'ICBM', content: '19.0760, 72.8777' },
    ];

    metaTags.forEach((tag) => {
      const meta = document.createElement('meta');
      meta.name = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });

    // Add hreflang links for internationalization
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://baranwalassociates.com';
    const hreflangLinks = [
      { rel: 'alternate', hreflang: 'en-US', href: `${baseUrl}/en` },
      { rel: 'alternate', hreflang: 'hi-IN', href: `${baseUrl}/hi` },
      { rel: 'alternate', hreflang: 'x-default', href: baseUrl },
    ];

    hreflangLinks.forEach((link) => {
      const linkElement = document.createElement('link');
      linkElement.rel = link.rel;
      linkElement.hreflang = link.hreflang;
      linkElement.href = link.href;
      document.head.appendChild(linkElement);
    });

    // Add social media meta tags
    const socialMetaTags = [
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: currentUrl },
      { property: 'og:site_name', content: 'Baranwal Associates' },
      { property: 'og:locale', content: locale === 'hi' ? 'hi_IN' : 'en_US' },
      { property: 'og:image', content: `${baseUrl}/assets/images/og-image.jpg` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Baranwal Associates - Premier Architectural Design & Construction Services' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@baranwalassociates' },
      { name: 'twitter:creator', content: '@baranwalassociates' },
      { name: 'twitter:image', content: `${baseUrl}/assets/images/twitter-image.jpg` },
    ];

    socialMetaTags.forEach((tag) => {
      const meta = document.createElement('meta');
      if (tag.property) {
        meta.setAttribute('property', tag.property);
      } else if (tag.name) {
        meta.name = tag.name;
      }
      meta.content = tag.content;
      document.head.appendChild(meta);
    });

    // Add canonical link
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = currentUrl;
    document.head.appendChild(canonicalLink);

    // Add preconnect for performance
    const preconnectLinks = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
      { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
    ];

    preconnectLinks.forEach((link) => {
      const linkElement = document.createElement('link');
      linkElement.rel = link.rel;
      linkElement.href = link.href;
      if (link.crossorigin) {
        linkElement.crossOrigin = link.crossorigin;
      }
      document.head.appendChild(linkElement);
    });

    return () => {
      // Cleanup function to remove added meta tags
      const addedMetaTags = document.querySelectorAll('meta[name="description"], meta[name="viewport"], meta[name="language"], meta[name="X-UA-Compatible"], meta[name="referrer"], meta[name="theme-color"], meta[name="mobile-web-app-capable"], meta[name="apple-mobile-web-app-capable"], meta[name="apple-mobile-web-app-status-bar-style"], meta[name="apple-mobile-web-app-title"], meta[name="application-name"], meta[name="format-detection"], meta[name="robots"], meta[name="googlebot"], meta[name="author"], meta[name="creator"], meta[name="publisher"], meta[name="keywords"], meta[name="geo.region"], meta[name="geo.placename"], meta[name="geo.position"], meta[name="ICBM"]');
      addedMetaTags.forEach(tag => tag.remove());

      const addedHreflangLinks = document.querySelectorAll('link[rel="alternate"][hreflang]');
      addedHreflangLinks.forEach(link => link.remove());

      const addedCanonicalLink = document.querySelector('link[rel="canonical"]');
      if (addedCanonicalLink) {
        addedCanonicalLink.remove();
      }

      const addedPreconnectLinks = document.querySelectorAll('link[rel="preconnect"], link[rel="dns-prefetch"]');
      addedPreconnectLinks.forEach(link => link.remove());
    };
  }, [pageType, currentUrl, locale]);

  return (
    <>
      <StructuredData data={getPageSchema(pageType)} />
    </>
  );
}

function getPageDescription(pageType: string): string {
  switch (pageType) {
    case 'homepage':
      return 'Premier architectural design and construction services in Mumbai. We create exceptional spaces that blend functionality with aesthetic excellence. 20+ years of experience, 500+ projects completed.';
    case 'about':
      return 'Learn about Baranwal Associates, Mumbai\'s leading architectural firm. Meet our experienced team and discover our commitment to innovative design and sustainable architecture.';
    case 'services':
      return 'Comprehensive architectural services in Mumbai including design, planning, interior design, and property valuation. Expert solutions for residential and commercial projects.';
    case 'projects':
      return 'Explore our portfolio of architectural projects in Mumbai. From residential homes to commercial complexes, see how we transform spaces with innovative design solutions.';
    case 'contact':
      return 'Contact Baranwal Associates for architectural services in Mumbai. Get in touch for consultations, project inquiries, and expert architectural solutions.';
    default:
      return 'Premier architectural design and construction services in Mumbai. We create exceptional spaces that blend functionality with aesthetic excellence.';
  }
}

function getPageKeywords(pageType: string): string {
  const baseKeywords = 'architectural design, construction services, Mumbai architects, interior design, urban planning, property valuation';

  switch (pageType) {
    case 'homepage':
      return `${baseKeywords}, residential architecture, commercial architecture, sustainable design, building design, construction company, architectural firm, design and build, project management, construction consultancy`;
    case 'about':
      return `${baseKeywords}, about us, team, experience, expertise, Er. Anand Prakash Baranwal, architectural excellence`;
    case 'services':
      return `${baseKeywords}, architectural services, design services, planning services, interior design services, valuation services, consultation`;
    case 'projects':
      return `${baseKeywords}, portfolio, projects, residential projects, commercial projects, architectural portfolio, completed projects`;
    case 'contact':
      return `${baseKeywords}, contact us, consultation, project inquiry, architectural consultation, Mumbai contact`;
    default:
      return baseKeywords;
  }
}

function getPageSchema(pageType: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://baranwalassociates.com';

  switch (pageType) {
    case 'homepage':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': 'Baranwal Associates - Premier Architectural Design & Construction Services',
        'description': 'Premier architectural design and construction services in Mumbai. We create exceptional spaces that blend functionality with aesthetic excellence.',
        'url': baseUrl,
        'mainEntity': {
          '@type': 'Organization',
          'name': 'Baranwal Associates',
          'description': 'Premier architectural design and construction services in Mumbai',
          'url': baseUrl,
          'logo': `${baseUrl}/assets/images/logo.png`,
          'contactPoint': {
            '@type': 'ContactPoint',
            'telephone': '+91-XXXXXXXXXX',
            'contactType': 'customer service',
            'areaServed': 'IN',
            'availableLanguage': ['English', 'Hindi'],
          },
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Mumbai',
            'addressRegion': 'Maharashtra',
            'addressCountry': 'IN',
          },
          'sameAs': [
            'https://www.facebook.com/baranwalassociates',
            'https://www.linkedin.com/company/baranwalassociates',
            'https://www.instagram.com/baranwalassociates',
          ],
        },
      };
    case 'about':
      return {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        'name': 'About Baranwal Associates',
        'description': 'Learn about Baranwal Associates, Mumbai\'s leading architectural firm.',
        'url': `${baseUrl}/about`,
        'mainEntity': {
          '@type': 'Person',
          'name': 'Er. Anand Prakash Baranwal',
          'jobTitle': 'Chief Architect',
          'worksFor': {
            '@type': 'Organization',
            'name': 'Baranwal Associates',
          },
          'description': 'Experienced architect with over 20 years in the industry',
        },
      };
    case 'services':
      return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'Architectural Services',
        'description': 'Comprehensive architectural services offered by Baranwal Associates',
        'url': `${baseUrl}/services`,
        'itemListElement': [
          {
            '@type': 'Service',
            'name': 'Architectural Design',
            'description': 'Comprehensive architectural design services',
          },
          {
            '@type': 'Service',
            'name': 'Interior Design',
            'description': 'Professional interior design services',
          },
          {
            '@type': 'Service',
            'name': 'Urban Planning',
            'description': 'Expert urban planning and development services',
          },
          {
            '@type': 'Service',
            'name': 'Property Valuation',
            'description': 'Accurate property valuation and assessment services',
          },
        ],
      };
    case 'contact':
      return {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        'name': 'Contact Baranwal Associates',
        'description': 'Contact Baranwal Associates for architectural services in Mumbai',
        'url': `${baseUrl}/contact`,
        'mainEntity': {
          '@type': 'Organization',
          'name': 'Baranwal Associates',
          'contactPoint': {
            '@type': 'ContactPoint',
            'telephone': '+91-XXXXXXXXXX',
            'contactType': 'customer service',
            'areaServed': 'IN',
            'availableLanguage': ['English', 'Hindi'],
          },
        },
      };
    default:
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': 'Baranwal Associates',
        'description': 'Premier architectural design and construction services in Mumbai',
      };
  }
}

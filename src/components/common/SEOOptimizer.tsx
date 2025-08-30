'use client';

import { useEffect } from 'react';
import { StructuredData } from './StructuredData';

type SEOOptimizerProps = {
  pageType?: 'homepage' | 'about' | 'services' | 'contact' | 'portfolio';
  currentUrl?: string;
  locale?: string;
};

export function SEOOptimizer({ pageType = 'homepage', currentUrl, locale = 'en' }: SEOOptimizerProps) {
  useEffect(() => {
    // Add meta description if not present
    if (!document.querySelector('meta[name="description"]')) {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Premier architectural design and construction services in Mumbai. We create exceptional spaces that blend functionality with aesthetic excellence.';
      document.head.appendChild(meta);
    }

    // Add viewport meta tag if not present
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, shrink-to-fit=no';
      document.head.appendChild(meta);
    }

    // Add language meta tag
    const langMeta = document.createElement('meta');
    langMeta.httpEquiv = 'content-language';
    langMeta.content = locale;
    document.head.appendChild(langMeta);

    // Add X-UA-Compatible meta tag
    const uaMeta = document.createElement('meta');
    uaMeta.httpEquiv = 'X-UA-Compatible';
    uaMeta.content = 'IE=edge';
    document.head.appendChild(uaMeta);

    // Add referrer policy
    const referrerMeta = document.createElement('meta');
    referrerMeta.name = 'referrer';
    referrerMeta.content = 'strict-origin-when-cross-origin';
    document.head.appendChild(referrerMeta);

    // Add theme-color for mobile browsers
    const themeMeta = document.createElement('meta');
    themeMeta.name = 'theme-color';
    themeMeta.content = '#0f172a';
    document.head.appendChild(themeMeta);

    // Add mobile web app capable
    const mobileMeta = document.createElement('meta');
    mobileMeta.name = 'mobile-web-app-capable';
    mobileMeta.content = 'yes';
    document.head.appendChild(mobileMeta);

    // Add apple mobile web app capable
    const appleMeta = document.createElement('meta');
    appleMeta.name = 'apple-mobile-web-app-capable';
    appleMeta.content = 'yes';
    document.head.appendChild(appleMeta);

    // Add apple mobile web app status bar style
    const appleStatusMeta = document.createElement('meta');
    appleStatusMeta.name = 'apple-mobile-web-app-status-bar-style';
    appleStatusMeta.content = 'default';
    document.head.appendChild(appleStatusMeta);

    // Add apple mobile web app title
    const appleTitleMeta = document.createElement('meta');
    appleTitleMeta.name = 'apple-mobile-web-app-title';
    appleTitleMeta.content = 'Baranwal Associates';
    document.head.appendChild(appleTitleMeta);

    // Add format detection
    const formatMeta = document.createElement('meta');
    formatMeta.name = 'format-detection';
    formatMeta.content = 'telephone=no, email=no, address=no';
    document.head.appendChild(formatMeta);

    // Add canonical link if not present
    if (currentUrl && !document.querySelector('link[rel="canonical"]')) {
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = currentUrl;
      document.head.appendChild(canonical);
    }

    // Add hreflang links for internationalization
    if (currentUrl) {
      const baseUrl = currentUrl.replace(/\/[a-z]{2}$/, '');

      // English
      const enLink = document.createElement('link');
      enLink.rel = 'alternate';
      enLink.hreflang = 'en';
      enLink.href = `${baseUrl}/en`;
      document.head.appendChild(enLink);

      // Hindi
      const hiLink = document.createElement('link');
      hiLink.rel = 'alternate';
      hiLink.hreflang = 'hi';
      hiLink.href = `${baseUrl}/hi`;
      document.head.appendChild(hiLink);

      // Default
      const defaultLink = document.createElement('link');
      defaultLink.rel = 'alternate';
      defaultLink.hreflang = 'x-default';
      defaultLink.href = baseUrl;
      document.head.appendChild(defaultLink);
    }

    // Add preconnect for performance
    const preconnectGoogle = document.createElement('link');
    preconnectGoogle.rel = 'preconnect';
    preconnectGoogle.href = 'https://www.google.com';
    document.head.appendChild(preconnectGoogle);

    const preconnectGoogleAnalytics = document.createElement('link');
    preconnectGoogleAnalytics.rel = 'preconnect';
    preconnectGoogleAnalytics.href = 'https://www.googletagmanager.com';
    document.head.appendChild(preconnectGoogleAnalytics);

    // Add DNS prefetch for external resources
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = 'https://fonts.googleapis.com';
    document.head.appendChild(dnsPrefetch);

    // Cleanup function
    return () => {
      // Remove dynamically added meta tags on unmount
      const dynamicMetaTags = document.querySelectorAll('meta[http-equiv="content-language"], meta[http-equiv="X-UA-Compatible"], meta[name="referrer"], meta[name="theme-color"], meta[name="mobile-web-app-capable"], meta[name="apple-mobile-web-app-capable"], meta[name="apple-mobile-web-app-status-bar-style"], meta[name="apple-mobile-web-app-title"], meta[name="format-detection"]');
      dynamicMetaTags.forEach(tag => tag.remove());

      const dynamicLinks = document.querySelectorAll('link[rel="alternate"], link[rel="preconnect"], link[rel="dns-prefetch"]');
      dynamicLinks.forEach(link => link.remove());
    };
  }, [currentUrl, locale]);

  // Generate page-specific schema based on page type
  const getPageSchema = () => {
    const baseUrl = 'https://baranwalassociates.com';

    switch (pageType) {
      case 'homepage':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          'name': 'Baranwal Associates - Premier Architectural Design & Construction Services',
          'description': 'Premier architectural design and construction services in Mumbai. We create exceptional spaces that blend functionality with aesthetic excellence.',
          'url': `${baseUrl}/${locale}`,
          'mainEntity': {
            '@type': 'Organization',
            'name': 'Baranwal Associates',
            'description': 'Premier architectural design and construction services in Mumbai',
            'url': baseUrl,
            'logo': `${baseUrl}/assets/images/logo.png`,
            'contactPoint': {
              '@type': 'ContactPoint',
              'telephone': '+91-98765-43210',
              'contactType': 'customer service',
              'areaServed': 'IN',
            },
          },
        };

      case 'about':
        return {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          'name': 'About Baranwal Associates',
          'description': 'Learn about Baranwal Associates, our team, and our commitment to architectural excellence.',
          'url': `${baseUrl}/${locale}#about`,
          'mainEntity': {
            '@type': 'Organization',
            'name': 'Baranwal Associates',
            'founder': {
              '@type': 'Person',
              'name': 'Er. Anand Prakash Baranwal',
              'jobTitle': 'Principal Architect & Founder',
              'description': 'With over two decades of experience in architectural design and urban planning',
            },
            'foundingDate': '2004',
            'numberOfEmployees': '25+',
            'description': 'Premier architectural design and construction services in Mumbai',
          },
        };

      case 'services':
        return {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          'name': 'Architectural Services',
          'description': 'Comprehensive architectural services including design, planning, and construction',
          'url': `${baseUrl}/${locale}#services`,
          'itemListElement': [
            {
              '@type': 'Service',
              'position': 1,
              'name': 'Architectural Design',
              'description': 'Comprehensive architectural design services for residential and commercial projects',
            },
            {
              '@type': 'Service',
              'position': 2,
              'name': 'Interior Design',
              'description': 'Professional interior design and space planning services',
            },
            {
              '@type': 'Service',
              'position': 3,
              'name': 'Urban Planning',
              'description': 'Strategic urban planning and development consulting',
            },
            {
              '@type': 'Service',
              'position': 4,
              'name': 'Property Valuation',
              'description': 'Expert property valuation and assessment services',
            },
          ],
        };

      case 'contact':
        return {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          'name': 'Contact Baranwal Associates',
          'description': 'Get in touch with Baranwal Associates for your architectural and construction needs.',
          'url': `${baseUrl}/${locale}#contact`,
          'mainEntity': {
            '@type': 'Organization',
            'name': 'Baranwal Associates',
            'contactPoint': {
              '@type': 'ContactPoint',
              'telephone': '+91-98765-43210',
              'email': 'info@baranwalassociates.com',
              'contactType': 'customer service',
              'areaServed': 'IN',
              'availableLanguage': ['English', 'Hindi'],
            },
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': '123 Architecture Lane, Design District',
              'addressLocality': 'Mumbai',
              'addressRegion': 'Maharashtra',
              'postalCode': '400001',
              'addressCountry': 'IN',
            },
          },
        };

      default:
        return null;
    }
  };

  const pageSchema = getPageSchema();

  return pageSchema ? <StructuredData data={pageSchema} /> : null;
}

'use client';

import { useEffect } from 'react';

type StructuredDataProps = {
  data: Record<string, any>;
};

export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Remove any existing structured data
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [data]);

  return null;
}

// Predefined structured data schemas
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'Baranwal Associates',
  'alternateName': 'Baranwal Associates Architectural Firm',
  'url': 'https://baranwalassociates.com',
  'logo': 'https://baranwalassociates.com/assets/images/logo.png',
  'description': 'Premier architectural design and construction services in Mumbai. We create exceptional spaces that blend functionality with aesthetic excellence.',
  'foundingDate': '2004',
  'founder': {
    '@type': 'Person',
    'name': 'Er. Anand Prakash Baranwal',
    'jobTitle': 'Principal Architect & Founder',
    'description': 'With over two decades of experience in architectural design and urban planning',
  },
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': '123 Architecture Lane, Design District',
    'addressLocality': 'Mumbai',
    'postalCode': '400001',
    'addressCountry': 'IN',
  },
  'contactPoint': {
    '@type': 'ContactPoint',
    'telephone': '+91-98765-43210',
    'contactType': 'customer service',
    'areaServed': 'IN',
    'availableLanguage': ['English', 'Hindi'],
  },
  'sameAs': [
    'https://www.facebook.com/baranwalassociates',
    'https://www.linkedin.com/company/baranwal-associates',
    'https://www.instagram.com/baranwalassociates',
    'https://twitter.com/baranwalassociates',
  ],
  'serviceArea': {
    '@type': 'GeoCircle',
    'geoMidpoint': {
      '@type': 'GeoCoordinates',
      'latitude': 19.0760,
      'longitude': 72.8777,
    },
    'geoRadius': '50000',
  },
  'hasOfferCatalog': {
    '@type': 'OfferCatalog',
    'name': 'Architectural Services',
    'itemListElement': [
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Architectural Design',
          'description': 'Comprehensive architectural design services for residential and commercial projects',
        },
      },
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Interior Design',
          'description': 'Professional interior design and space planning services',
        },
      },
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Urban Planning',
          'description': 'Strategic urban planning and development consulting',
        },
      },
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Property Valuation',
          'description': 'Expert property valuation and assessment services',
        },
      },
    ],
  },
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': '4.9',
    'reviewCount': '150',
    'bestRating': '5',
    'worstRating': '1',
  },
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  'name': 'Baranwal Associates',
  'image': 'https://baranwalassociates.com/assets/images/office.jpg',
  'description': 'Premier architectural design and construction services in Mumbai',
  'url': 'https://baranwalassociates.com',
  'telephone': '+91-98765-43210',
  'email': 'info@baranwalassociates.com',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': '123 Architecture Lane, Design District',
    'addressLocality': 'Mumbai',
    'addressRegion': 'Maharashtra',
    'postalCode': '400001',
    'addressCountry': 'IN',
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 19.0760,
    'longitude': 72.8777,
  },
  'openingHoursSpecification': [
    {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      'opens': '09:00',
      'closes': '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': 'Saturday',
      'opens': '09:00',
      'closes': '14:00',
    },
  ],
  'priceRange': '₹₹₹',
  'paymentAccepted': ['Cash', 'Credit Card', 'Bank Transfer'],
  'currenciesAccepted': 'INR',
  'areaServed': {
    '@type': 'City',
    'name': 'Mumbai',
  },
  'hasOfferCatalog': {
    '@type': 'OfferCatalog',
    'name': 'Architectural Services',
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'Baranwal Associates',
  'url': 'https://baranwalassociates.com',
  'description': 'Premier architectural design and construction services in Mumbai',
  'publisher': {
    '@type': 'Organization',
    'name': 'Baranwal Associates',
  },
  'potentialAction': {
    '@type': 'SearchAction',
    'target': {
      '@type': 'EntryPoint',
      'urlTemplate': 'https://baranwalassociates.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  'inLanguage': ['en-US', 'hi-IN'],
  'isAccessibleForFree': true,
};

export const breadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': breadcrumbs.map((breadcrumb, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': breadcrumb.name,
    'item': breadcrumb.url,
  })),
});

export const faqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': faqs.map(faq => ({
    '@type': 'Question',
    'name': faq.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.answer,
    },
  })),
});

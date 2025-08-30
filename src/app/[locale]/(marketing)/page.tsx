import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FloatingWhatsApp, PerformanceOptimizer, SEOOptimizer } from '@/components/common';
import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FooterSection } from '@/components/sections/FooterSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { QuoteSection } from '@/components/sections/QuoteSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://baranwalassociates.com';
  const currentUrl = `${baseUrl}/${locale}`;

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: [
      'architectural design Mumbai',
      'construction services Mumbai',
      'interior design Mumbai',
      'urban planning Mumbai',
      'property valuation Mumbai',
      'residential architecture',
      'commercial architecture',
      'sustainable design',
      'building design',
      'construction company Mumbai',
      'architectural firm Mumbai',
      'design and build',
      'project management',
      'construction consultancy',
      'Er. Anand Prakash Baranwal',
      'Baranwal Associates',
    ],
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: currentUrl,
      siteName: 'Baranwal Associates',
      locale: locale === 'hi' ? 'hi_IN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta_title'),
      description: t('meta_description'),
    },
    alternates: {
      canonical: currentUrl,
      languages: {
        'en-US': `${baseUrl}/en`,
        'hi-IN': `${baseUrl}/hi`,
      },
    },
    other: {
      'article:published_time': '2024-01-01T00:00:00.000Z',
      'article:modified_time': new Date().toISOString(),
      'article:author': 'Er. Anand Prakash Baranwal',
      'article:section': 'Architecture',
      'article:tag': ['Architecture', 'Design', 'Construction', 'Mumbai'],
    },
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://baranwalassociates.com';
  const currentUrl = `${baseUrl}/${locale}`;

  // Critical images to preload - optimized for mobile
  const criticalImages = [
    '/assets/images/hero-bg-mobile.jpg', // Mobile-optimized hero background
    '/assets/images/logo-mobile.png', // Mobile-optimized logo
    '/assets/images/chief-architect.jpg',
  ];

  // Critical fonts to preload - using system fonts instead of Google Fonts to avoid CSP issues
  const criticalFonts: string[] = [
    // Using system fonts to avoid CSP blocking
  ];

  return (
    <>
      <SEOOptimizer
        pageType="homepage"
        currentUrl={currentUrl}
        locale={locale}
      />

      <PerformanceOptimizer
        preloadImages={criticalImages}
        preloadFonts={criticalFonts}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Quote Section */}
      <QuoteSection />

      {/* Footer Section */}
      <FooterSection />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />
    </>
  );
};

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

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://baranwalassociates.com';
  const currentUrl = `${baseUrl}/${locale}`;

  // Critical images to preload
  const criticalImages = [
    '/assets/images/hero-bg.jpg',
    '/assets/images/logo.png',
    '/assets/images/chief-architect.jpg',
  ];

  // Critical fonts to preload
  const criticalFonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
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

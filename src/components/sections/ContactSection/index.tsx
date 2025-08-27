'use client';

import { useTranslations } from 'next-intl';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';
import { ContactMap } from './ContactMap';
import { ContactStats } from './ContactStats';

export function ContactSection() {
  const t = useTranslations('Contact');

  return (
    <section id="contact" className="pattern-circuit bg-background py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              {t('title')}
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              {t('subtitle')}
            </p>
            <div className="mx-auto h-1 w-24 bg-primary" />
          </div>

          {/* Contact Details Section */}
          <div className="mb-16">
            <ContactInfo />
          </div>

          {/* Maps Section */}
          <div className="mb-16">
            <ContactMap />
          </div>

          {/* Request a Quote Section */}
          <div className="mb-16">
            <ContactForm />
          </div>

          {/* Quick Stats Section */}
          <div className="mb-16">
            <ContactStats />
          </div>
        </div>
      </div>
    </section>
  );
}

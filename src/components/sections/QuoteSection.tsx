'use client';

import { useTranslations } from 'next-intl';
import { ContactForm } from './ContactSection/ContactForm';

export function QuoteSection() {
  const t = useTranslations('Quote');

  return (
    <section id="quote" className="pattern-circuit bg-background py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-4xl">
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

          {/* Quote Form */}
          <div className="mx-auto max-w-2xl">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

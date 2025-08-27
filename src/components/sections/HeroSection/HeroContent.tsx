'use client';

import { ArrowDown, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export function HeroContent() {
  const t = useTranslations('Hero');

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToNext = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
      <div className="animate-fade-in space-y-6">
        {/* Main heading with gradient text */}
        <h1 className="text-4xl leading-tight font-bold md:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
            {t('title')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl lg:text-2xl">
          {t('subtitle')}
        </p>

        {/* CTA Button with hover animation */}
        <div className="pt-8">
          <Button
            onClick={scrollToProjects}
            size="lg"
            className="group relative overflow-hidden bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-2xl"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('cta_button')}
              <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>

            {/* Animated background effect */}
            <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-primary/0 via-primary-foreground/20 to-primary/0 transition-transform duration-700 group-hover:translate-x-[100%]" />
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
        <button
          type="button"
          onClick={scrollToNext}
          className="group flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="text-sm font-medium">{t('scroll_hint')}</span>
          <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
        </button>
      </div>
    </div>
  );
}

'use client';

import { Building2, Calculator, Home, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ServicesSection() {
  const t = useTranslations('Services');

  const services = [
    {
      icon: Building2,
      title: t('architectural.title'),
      description: t('architectural.description'),
      variant: 'primary' as const,
    },
    {
      icon: Home,
      title: t('interior.title'),
      description: t('interior.description'),
      variant: 'accent' as const,
    },
    {
      icon: MapPin,
      title: t('planning.title'),
      description: t('planning.description'),
      variant: 'secondary' as const,
    },
    {
      icon: Calculator,
      title: t('valuation.title'),
      description: t('valuation.description'),
      variant: 'muted' as const,
    },
  ];

  return (
    <section id="services" className="pattern-hexagon bg-background py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-6xl">
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

          {/* Services Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              const getVariantColors = (variant: string) => {
                switch (variant) {
                  case 'primary':
                    return {
                      iconBg: 'bg-primary',
                      iconText: 'text-primary-foreground',
                      border: 'border-primary/20',
                      hover: 'hover:border-primary/40',
                      accent: 'bg-primary',
                    };
                  case 'accent':
                    return {
                      iconBg: 'bg-accent',
                      iconText: 'text-accent-foreground',
                      border: 'border-accent/20',
                      hover: 'hover:border-accent/40',
                      accent: 'bg-accent',
                    };
                  case 'secondary':
                    return {
                      iconBg: 'bg-secondary',
                      iconText: 'text-secondary-foreground',
                      border: 'border-secondary/20',
                      hover: 'hover:border-secondary/40',
                      accent: 'bg-secondary',
                    };
                  default:
                    return {
                      iconBg: 'bg-muted',
                      iconText: 'text-muted-foreground',
                      border: 'border-muted/20',
                      hover: 'hover:border-muted/40',
                      accent: 'bg-muted',
                    };
                }
              };

              const colors = getVariantColors(service.variant);

              return (
                <Card
                  key={`service-${service.title}`}
                  className={`group relative overflow-hidden border-2 ${colors.border} ${colors.hover} cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20`}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Floating background shape */}
                  <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 opacity-50 transition-transform duration-500 group-hover:scale-150" />

                  <CardHeader className="relative z-10 bg-secondary/30 transition-colors duration-300 group-hover:bg-secondary/50">
                    <div className="flex flex-col items-center space-y-4 text-center">
                      {/* Icon with animated background */}
                      <div className={`relative rounded-full p-4 ${colors.iconBg} ${colors.iconText} transition-transform duration-300 group-hover:scale-110`}>
                        <IconComponent className="h-8 w-8" />

                        {/* Pulsing ring effect */}
                        <div className="absolute inset-0 scale-150 rounded-full bg-primary/30 opacity-0 group-hover:animate-ping group-hover:opacity-100" />
                      </div>

                      <CardTitle className="text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                        {service.title}
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10 pt-4">
                    <CardDescription className="text-center leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                      {service.description}
                    </CardDescription>
                  </CardContent>

                  {/* Hover overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Bottom accent line */}
                  <div className={`absolute right-0 bottom-0 left-0 h-1 ${colors.accent} origin-left scale-x-0 transform transition-transform duration-300 group-hover:scale-x-100`} />
                </Card>
              );
            })}
          </div>

          {/* Bottom decorative elements */}
          <div className="mt-16 flex justify-center space-x-4">
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <div className="h-2 w-2 animate-pulse rounded-full bg-accent" style={{ animationDelay: '0.5s' }} />
            <div className="h-2 w-2 animate-pulse rounded-full bg-secondary" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </section>
  );
}

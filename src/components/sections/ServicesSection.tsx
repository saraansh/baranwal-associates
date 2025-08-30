'use client';

import { ArrowRight, Building2, Calculator, CheckCircle, Home, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ServicesSection() {
  const t = useTranslations('Services');

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = [
    {
      icon: Building2,
      title: t('architectural.title'),
      description: t('architectural.description'),
      variant: 'primary' as const,
      features: ['Concept Development', '3D Visualization', 'Construction Drawings', 'Site Supervision'],
    },
    {
      icon: Home,
      title: t('interior.title'),
      description: t('interior.description'),
      variant: 'accent' as const,
      features: ['Space Planning', 'Material Selection', 'Furniture Design', 'Lighting Design'],
    },
    {
      icon: MapPin,
      title: t('planning.title'),
      description: t('planning.description'),
      variant: 'secondary' as const,
      features: ['Site Analysis', 'Zoning Compliance', 'Master Planning', 'Sustainability'],
    },
    {
      icon: Calculator,
      title: t('valuation.title'),
      description: t('valuation.description'),
      variant: 'muted' as const,
      features: ['Property Assessment', 'Market Analysis', 'Investment Advisory', 'Legal Compliance'],
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
            <p className="mx-auto mb-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
              {t('subtitle')}
            </p>
            <p className="mx-auto mb-6 max-w-4xl text-base text-muted-foreground">
              Our comprehensive architectural services encompass every aspect of the design and construction process, from initial concept development to final project delivery. We combine innovative design solutions with practical expertise to create spaces that exceed expectations and stand the test of time.
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
                    <CardDescription className="mb-4 text-center leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                      {service.description}
                    </CardDescription>

                    {/* Service Features */}
                    <div className="space-y-2">
                      {service.features.map(feature => (
                        <div key={`feature-${service.title}-${feature}`} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  {/* Hover overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Bottom accent line */}
                  <div className={`absolute right-0 bottom-0 left-0 h-1 ${colors.accent} origin-left scale-x-0 transform transition-transform duration-300 group-hover:scale-x-100`} />
                </Card>
              );
            })}
          </div>

          {/* Additional Content Section */}
          <div className="mt-20 grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">
                Why Choose Our Services?
              </h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  With over two decades of experience in the architectural industry, we have successfully completed hundreds of projects across Mumbai and surrounding areas. Our team combines creativity with technical expertise to deliver exceptional results.
                </p>
                <p className="text-muted-foreground">
                  We understand that every project is unique, which is why we take a personalized approach to each assignment. From residential homes to commercial complexes, we ensure that our designs not only meet functional requirements but also reflect our clients' vision and lifestyle.
                </p>
                <p className="text-muted-foreground">
                  Our commitment to sustainability and innovation sets us apart in the industry. We incorporate eco-friendly materials and energy-efficient design principles to create spaces that are both beautiful and environmentally responsible.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">
                Our Process
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Initial Consultation</h4>
                    <p className="text-sm text-muted-foreground">Understanding your requirements and vision</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Concept Development</h4>
                    <p className="text-sm text-muted-foreground">Creating initial design concepts and layouts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Detailed Design</h4>
                    <p className="text-sm text-muted-foreground">Finalizing designs and technical drawings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Project Execution</h4>
                    <p className="text-sm text-muted-foreground">Overseeing construction and quality control</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="mx-auto max-w-2xl space-y-6">
              <h3 className="text-2xl font-bold text-foreground">
                Ready to Start Your Project?
              </h3>
              <p className="text-muted-foreground">
                Let's discuss your vision and create something extraordinary together. Our team is ready to bring your architectural dreams to life.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button onClick={scrollToContact} className="group">
                  <span>Get Free Consultation</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button onClick={scrollToProjects} variant="outline">
                  <span>View Our Portfolio</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
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

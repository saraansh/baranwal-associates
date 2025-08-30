'use client';

import { ArrowRight, Award, Building, MapPin, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function AboutSection() {
  const t = useTranslations('About');

  const scrollToServices = () => {
    const element = document.getElementById('services');
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

  return (
    <section id="about" className="pattern-grid bg-secondary/30 py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              {t('title')}
            </h2>
            <div className="mx-auto h-1 w-24 bg-primary" />
            <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
              Leading architectural excellence in Mumbai with over two decades of experience in creating innovative, sustainable, and functional spaces that transform the urban landscape.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Side - Chief Architect Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Double tone splash background */}
                <div className="absolute inset-0 h-80 w-80 -translate-x-4 translate-y-4 transform rounded-full bg-gradient-to-br from-primary/30 to-accent/40 blur-3xl" />
                <div className="absolute inset-0 h-80 w-80 translate-x-4 -translate-y-4 transform rounded-full bg-gradient-to-tl from-secondary/40 to-primary/20 blur-2xl" />

                {/* Main circular image container */}
                <div className="relative h-80 w-80 overflow-hidden rounded-full border-4 border-background shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/30" />
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src="/api/placeholder/320/320"
                      alt={t('chief_architect_name')}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-6xl font-bold text-primary-foreground">
                      APB
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Floating elements around the image */}
                <div className="absolute -top-4 -right-4 h-8 w-8 animate-pulse rounded-full bg-primary" />
                <div className="absolute -bottom-6 -left-6 h-6 w-6 animate-pulse rounded-full bg-accent" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/4 -left-8 h-4 w-4 animate-pulse rounded-full bg-secondary" style={{ animationDelay: '2s' }} />
              </div>
            </div>

            {/* Right Side - Chief Architect Details */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
                  {t('chief_architect_name')}
                </h3>
                <Badge variant="secondary" className="mb-4 text-sm font-medium">
                  {t('chief_architect_title')}
                </Badge>
              </div>

              <div className="prose prose-lg max-w-none space-y-4">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {t('chief_architect_message')}
                </p>

                <p className="text-base leading-relaxed text-muted-foreground">
                  With a passion for innovative design and sustainable architecture, our team at Baranwal Associates has been at the forefront of transforming Mumbai's architectural landscape. We specialize in creating spaces that not only meet functional requirements but also inspire and enhance the quality of life for our clients.
                </p>

                <p className="text-base leading-relaxed text-muted-foreground">
                  Our comprehensive approach encompasses everything from initial concept development to final construction supervision, ensuring that every project reflects our commitment to excellence, sustainability, and client satisfaction.
                </p>
              </div>

              {/* Company Highlights */}
              <div className="grid grid-cols-1 gap-4 pt-6">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Award-winning architectural firm in Mumbai</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Specialized in residential and commercial projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Serving Mumbai and surrounding areas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Experienced team of architects and designers</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 pt-6 sm:flex-row">
                <Button onClick={scrollToServices} className="group">
                  <span>Our Services</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button onClick={scrollToProjects} variant="outline">
                  <span>View Projects</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="rounded-lg border bg-card p-4 text-center">
                  <div className="mb-1 text-2xl font-bold text-primary">
                    {t('experience_years')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Years Experience
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4 text-center">
                  <div className="mb-1 text-2xl font-bold text-primary">
                    {t('projects_completed')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Projects Completed
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4 text-center">
                  <div className="mb-1 text-2xl font-bold text-primary">
                    {t('client_satisfaction')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Client Satisfaction
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4 text-center">
                  <div className="mb-1 text-2xl font-bold text-primary">
                    {t('team_members')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Team Members
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

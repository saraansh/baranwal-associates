'use client';

import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function AboutSection() {
  const t = useTranslations('About');

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

              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {t('chief_architect_message')}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="rounded-lg border bg-card p-4 text-center">
                  <div className="mb-1 text-2xl font-bold text-primary">
                    {t('experience_years')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Experience
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4 text-center">
                  <div className="mb-1 text-2xl font-bold text-primary">
                    {t('projects_completed')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Projects
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4 text-center">
                  <div className="mb-1 text-2xl font-bold text-primary">
                    {t('client_satisfaction')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Satisfaction
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4 text-center">
                  <div className="mb-1 text-2xl font-bold text-primary">
                    {t('team_members')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Team Size
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

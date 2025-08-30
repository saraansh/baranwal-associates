'use client';

import { Building, Calendar, Trophy, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

type CountUpProps = {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
};

function CountUp({ end, duration = 2000, suffix = '', prefix = '' }: CountUpProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = 1 - (1 - progress) ** 3;
      setCount(Math.floor(easeOutCubic * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <div ref={countRef} className="text-3xl font-bold text-foreground md:text-4xl">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

export function TestimonialsSection() {
  const t = useTranslations('Testimonials');

  const metrics = [
    {
      icon: Building,
      value: 3000,
      suffix: '+',
      label: t('projects_completed_label'),
      description: 'Successfully completed projects across residential, commercial, and institutional sectors',
      variant: 'primary' as const,
    },
    {
      icon: Users,
      value: 3000,
      suffix: '+',
      label: t('satisfied_clients_label'),
      description: 'Happy clients who trusted us with their architectural dreams and visions',
      variant: 'accent' as const,
    },
    {
      icon: Calendar,
      value: 38,
      suffix: '',
      label: t('years_experience_label'),
      description: 'Years of excellence in architectural design and construction management',
      variant: 'secondary' as const,
    },
    {
      icon: Trophy,
      value: 99,
      suffix: '%',
      label: t('success_rate_label'),
      description: 'Projects delivered on time and within budget, exceeding client expectations',
      variant: 'muted' as const,
    },
  ];

  return (
    <section id="testimonials" className="pattern-dots bg-gradient-to-br from-secondary/30 via-background to-accent/20 py-20 lg:py-32">
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

          {/* Metrics Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => {
              const IconComponent = metric.icon;
              const getVariantColors = (variant: string) => {
                switch (variant) {
                  case 'primary':
                    return {
                      iconBg: 'bg-primary',
                      iconText: 'text-primary-foreground',
                      accent: 'bg-primary',
                      gradient: 'from-primary/10 to-primary/5',
                    };
                  case 'accent':
                    return {
                      iconBg: 'bg-accent',
                      iconText: 'text-accent-foreground',
                      accent: 'bg-accent',
                      gradient: 'from-accent/10 to-accent/5',
                    };
                  case 'secondary':
                    return {
                      iconBg: 'bg-secondary',
                      iconText: 'text-secondary-foreground',
                      accent: 'bg-secondary',
                      gradient: 'from-secondary/10 to-secondary/5',
                    };
                  default:
                    return {
                      iconBg: 'bg-muted',
                      iconText: 'text-muted-foreground',
                      accent: 'bg-muted',
                      gradient: 'from-muted/10 to-muted/5',
                    };
                }
              };

              const colors = getVariantColors(metric.variant);

              return (
                <div
                  key={`metric-${metric.label}`}
                  className="group relative rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
                >
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                  {/* Floating background elements */}
                  <div className="absolute top-0 right-0 h-16 w-16 translate-x-8 -translate-y-8 transform rounded-full bg-gradient-to-br from-primary/10 to-accent/10 transition-transform duration-500 group-hover:scale-150" />

                  <div className="relative z-10 space-y-4 text-center">
                    {/* Icon */}
                    <div className={`inline-flex rounded-full p-3 ${colors.iconBg} ${colors.iconText} mb-4 transition-transform duration-300 group-hover:scale-110`}>
                      <IconComponent className="h-6 w-6" />
                    </div>

                    {/* Animated counter */}
                    <CountUp
                      end={metric.value}
                      suffix={metric.suffix}
                      duration={2500}
                    />

                    {/* Label */}
                    <h3 className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                      {metric.label}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                      {metric.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className={`absolute right-0 bottom-0 left-0 h-1 ${colors.accent} origin-center scale-x-0 transform rounded-b-2xl transition-transform duration-300 group-hover:scale-x-100`} />

                  {/* Pulse effect on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} animate-pulse rounded-2xl opacity-0 group-hover:opacity-50`} />
                </div>
              );
            })}
          </div>

          {/* Additional decorative elements */}
          <div className="mt-16 flex items-center justify-center space-x-8">
            <div className="flex space-x-2">
              <div className="h-3 w-3 animate-bounce rounded-full bg-primary" />
              <div className="h-3 w-3 animate-bounce rounded-full bg-accent" style={{ animationDelay: '0.1s' }} />
              <div className="h-3 w-3 animate-bounce rounded-full bg-secondary" style={{ animationDelay: '0.2s' }} />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground">
                Excellence in Every Project
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="h-3 w-3 animate-bounce rounded-full bg-secondary" style={{ animationDelay: '0.2s' }} />
              <div className="h-3 w-3 animate-bounce rounded-full bg-accent" style={{ animationDelay: '0.1s' }} />
              <div className="h-3 w-3 animate-bounce rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

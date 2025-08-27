'use client';

import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <HeroBackground />
      <HeroContent />
    </section>
  );
}

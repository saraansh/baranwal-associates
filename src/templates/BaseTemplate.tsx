'use client';

import { Building2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { LocaleSwitcher, ThemeToggleButton } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { AppConfig } from '@/utils/config';

export const BaseTemplate = (props: {
  children: React.ReactNode;
  leftNav?: React.ReactNode;
  rightNav?: React.ReactNode;
}) => {
  const t = useTranslations('RootLayout');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Company Name */}
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {AppConfig.name}
                </h1>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  {AppConfig.tagline}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center space-x-8 md:flex">
              {props.leftNav || (
                <>
                  <button
                    type="button"
                    onClick={() => scrollToSection('home')}
                    className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {t('home_link')}
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('about')}
                    className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {t('about_link')}
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('services')}
                    className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {t('services_link')}
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('projects')}
                    className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {t('collection_link')}
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('contact')}
                    className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {t('contact_link')}
                  </button>
                </>
              )}
            </nav>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4">
              {props.rightNav || (
                <>
                  <Button
                    onClick={() => scrollToSection('quote')}
                    className="hidden sm:inline-flex"
                    size="sm"
                  >
                    {t('get_quote')}
                  </Button>

                  <div className="hidden sm:block">
                    <LocaleSwitcher />
                  </div>
                </>
              )}

              <ThemeToggleButton />

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex h-6 w-6 flex-col items-center justify-center space-y-1 md:hidden"
              >
                <span className={`h-0.5 w-6 bg-foreground transition-all ${isMobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
                <span className={`h-0.5 w-6 bg-foreground transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`h-0.5 w-6 bg-foreground transition-all ${isMobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="border-t border-border py-4 md:hidden">
              <nav className="flex flex-col space-y-4">
                {props.leftNav || (
                  <>
                    <button
                      type="button"
                      onClick={() => scrollToSection('home')}
                      className="text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {t('home_link')}
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection('about')}
                      className="text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {t('about_link')}
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection('services')}
                      className="text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {t('services_link')}
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection('projects')}
                      className="text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {t('collection_link')}
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection('contact')}
                      className="text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {t('contact_link')}
                    </button>
                  </>
                )}
                <div className="border-t border-border pt-2">
                  {props.rightNav || (
                    <>
                      <Button
                        onClick={() => scrollToSection('quote')}
                        className="mb-3 w-full"
                        size="sm"
                      >
                        {t('get_quote')}
                      </Button>
                      <LocaleSwitcher />
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {props.children}
      </main>
    </div>
  );
};

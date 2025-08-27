'use client';

import { Building2, Calendar, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AppConfig } from '@/utils/config';

export function FooterSection() {
  const t = useTranslations('Footer');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="pattern-waves bg-foreground py-16 text-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Main Footer Content */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">

            {/* First Division - Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Building2 className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-background">
                    {AppConfig.name}
                  </h3>
                  <p className="text-sm text-background/70">
                    {AppConfig.tagline}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-background/80">
                {t('company_description')}
              </p>

              {/* Awards & Certifications */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-background/70">
                  <Calendar className="h-4 w-4" />
                  <span>Established 1985</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-background/70">
                  <Building2 className="h-4 w-4" />
                  <span>LEED Certified</span>
                </div>
              </div>
            </div>

            {/* Second Division - Services */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-background">
                {t('services_title')}
              </h4>

              <ul className="space-y-3">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('services')}
                    className="text-left text-sm text-background/80 transition-colors hover:text-background hover:underline"
                  >
                    {t('services.architectural_design')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('services')}
                    className="text-left text-sm text-background/80 transition-colors hover:text-background hover:underline"
                  >
                    {t('services.interior_design')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('services')}
                    className="text-left text-sm text-background/80 transition-colors hover:text-background hover:underline"
                  >
                    {t('services.urban_planning')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('services')}
                    className="text-left text-sm text-background/80 transition-colors hover:text-background hover:underline"
                  >
                    {t('services.property_valuation')}
                  </button>
                </li>
              </ul>

              {/* Service Highlights */}
              <div className="border-t border-background/20 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-background/70">
                    <Clock className="h-4 w-4" />
                    <span>24/7 Project Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-background/70">
                    <Building2 className="h-4 w-4" />
                    <span>Sustainable Design Focus</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Third Division - Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-background">
                {t('quick_links_title')}
              </h4>

              <ul className="space-y-3">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('home')}
                    className="text-left text-sm text-background/80 transition-colors hover:text-background hover:underline"
                  >
                    {t('quick_links.home')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('about')}
                    className="text-left text-sm text-background/80 transition-colors hover:text-background hover:underline"
                  >
                    {t('quick_links.about')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('services')}
                    className="text-left text-sm text-background/80 transition-colors hover:text-background hover:underline"
                  >
                    {t('quick_links.services')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('projects')}
                    className="text-left text-sm text-background/80 transition-colors hover:text-background hover:underline"
                  >
                    {t('quick_links.portfolio')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('contact')}
                    className="text-left text-sm text-background/80 transition-colors hover:text-background hover:underline"
                  >
                    {t('quick_links.contact')}
                  </button>
                </li>
                <li>
                  <a
                    href="#careers"
                    className="text-sm text-background/80 transition-colors hover:text-background hover:underline"
                  >
                    {t('quick_links.careers')}
                  </a>
                </li>
              </ul>

              {/* Additional Links */}
              <div className="border-t border-background/20 pt-4">
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#privacy"
                      className="text-xs text-background/70 transition-colors hover:text-background hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#terms"
                      className="text-xs text-background/70 transition-colors hover:text-background hover:underline"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Fourth Division - Contact Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-background">
                {t('contact_title')}
              </h4>

              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-lg bg-primary/20 p-2">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed text-background/80">
                      123 Architecture Lane
                      <br />
                      Design District
                      <br />
                      Mumbai 400001, India
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/20 p-2">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-background/80">+91 98765 43210</p>
                    <p className="text-xs text-background/70">Mon-Fri: 9AM-6PM</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/20 p-2">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-background/80">info@baranwalassociates.com</p>
                    <p className="text-xs text-background/70">24hr response time</p>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="border-t border-background/20 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-red-500/20 p-2">
                      <Phone className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-background/80">Emergency</p>
                      <p className="text-xs text-background/70">+91 98765 00000</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-background">Follow Us</h5>
                <div className="flex gap-3">
                  <a
                    href="#facebook"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 transition-colors hover:bg-primary/30"
                    aria-label="Facebook"
                  >
                    <span className="text-xs font-bold text-primary">f</span>
                  </a>
                  <a
                    href="#instagram"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 transition-colors hover:bg-primary/30"
                    aria-label="Instagram"
                  >
                    <span className="text-xs font-bold text-primary">i</span>
                  </a>
                  <a
                    href="#linkedin"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 transition-colors hover:bg-primary/30"
                    aria-label="LinkedIn"
                  >
                    <span className="text-xs font-bold text-primary">in</span>
                  </a>
                  <a
                    href="#twitter"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 transition-colors hover:bg-primary/30"
                    aria-label="Twitter"
                  >
                    <span className="text-xs font-bold text-primary">x</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-12 border-t border-background/20 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-background/70">
                {t('copyright', { year: new Date().getFullYear() })}
              </p>

              <div className="flex items-center gap-6 text-xs text-background/60">
                <span>Made with ❤️ in India</span>
                <span>•</span>
                <span>ISO 9001:2015 Certified</span>
                <span>•</span>
                <span>LEED Accredited</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

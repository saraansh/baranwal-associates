import type { LocalizationResource } from '@clerk/types';
import type { LocalePrefixMode } from 'next-intl/routing';
import { enUS, hiIN } from '@clerk/localizations';

const localePrefix: LocalePrefixMode = 'as-needed';

// Architecture firm configuration
export const AppConfig = {
  name: 'Baranwal Associates',
  tagline: 'Transforming Dreams Into Reality',
  description: 'Premier architectural design and construction services',
  locales: ['en', 'hi'],
  defaultLocale: 'en',
  localePrefix,
};

const supportedLocales: Record<string, LocalizationResource> = {
  en: enUS,
  hi: hiIN,
};

export const ClerkLocalizations = {
  defaultLocale: enUS,
  supportedLocales,
};

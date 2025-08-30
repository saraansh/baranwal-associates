import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { organizationSchema, StructuredData, websiteSchema } from '@/components/common';
import { ThemeProvider } from '@/components/layout';
import { routing } from '@/libs/I18nRouting';
import '@/styles/global.css';
import '@/styles/performance.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://baranwalassociates.com'),
  title: {
    default: 'Baranwal Associates - Premier Architectural Design & Construction Services',
    template: '%s | Baranwal Associates',
  },
  description: 'Premier architectural design and construction services in Mumbai. We create exceptional spaces that blend functionality with aesthetic excellence. 20+ years of experience, 500+ projects completed.',
  keywords: [
    'architectural design',
    'construction services',
    'interior design',
    'urban planning',
    'property valuation',
    'Mumbai architects',
    'residential architecture',
    'commercial architecture',
    'sustainable design',
    'building design',
    'construction company',
    'architectural firm',
    'design and build',
    'project management',
    'construction consultancy',
  ],
  authors: [{ name: 'Er. Anand Prakash Baranwal' }],
  creator: 'Baranwal Associates',
  publisher: 'Baranwal Associates',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'hi_IN',
    url: 'https://baranwalassociates.com',
    siteName: 'Baranwal Associates',
    title: 'Baranwal Associates - Premier Architectural Design & Construction Services',
    description: 'Premier architectural design and construction services in Mumbai. We create exceptional spaces that blend functionality with aesthetic excellence.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baranwal Associates - Premier Architectural Design & Construction Services',
    description: 'Premier architectural design and construction services in Mumbai. We create exceptional spaces that blend functionality with aesthetic excellence.',
    creator: '@baranwalassociates',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      'index': true,
      'follow': true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://baranwalassociates.com',
    languages: {
      'en-US': 'https://baranwalassociates.com/en',
      'hi-IN': 'https://baranwalassociates.com/hi',
    },
  },
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
    {
      rel: 'manifest',
      url: '/site.webmanifest',
    },
  ],
  other: {
    'theme-color': '#0f172a',
    'msapplication-TileColor': '#0f172a',
    'msapplication-config': '/browserconfig.xml',
    'viewport': 'width=device-width, initial-scale=1, maximum-scale=5',
    'charset': 'utf-8',
    'X-UA-Compatible': 'IE=edge',
    'referrer': 'strict-origin-when-cross-origin',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Baranwal Associates',
    'application-name': 'Baranwal Associates',
    'msapplication-TileImage': '/mstile-144x144.png',
    'msapplication-square70x70logo': '/mstile-70x70.png',
    'msapplication-square150x150logo': '/mstile-150x150.png',
    'msapplication-wide310x150logo': '/mstile-310x150.png',
    'msapplication-square310x310logo': '/mstile-310x310.png',
  },
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Baranwal Associates" />
        <meta name="application-name" content="Baranwal Associates" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="msapplication-square70x70logo" content="/mstile-70x70.png" />
        <meta name="msapplication-square150x150logo" content="/mstile-150x150.png" />
        <meta name="msapplication-wide310x150logo" content="/mstile-310x150.png" />
        <meta name="msapplication-square310x310logo" content="/mstile-310x310.png" />
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={['light', 'dark', 'nature', 'dawn', 'dusk', 'system']}
        >
          <NextIntlClientProvider>
            <PostHogProvider>
              {props.children}
            </PostHogProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

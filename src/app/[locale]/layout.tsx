import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { organizationSchema, StructuredData, websiteSchema } from '@/components/common';
import { ThemeProvider } from '@/components/layout';
import { routing } from '@/libs/I18nRouting';
import '@/styles/global.css';

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
    images: [
      {
        url: '/assets/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Baranwal Associates - Architectural Excellence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baranwal Associates - Premier Architectural Design & Construction Services',
    description: 'Premier architectural design and construction services in Mumbai. We create exceptional spaces that blend functionality with aesthetic excellence.',
    images: ['/assets/images/twitter-image.jpg'],
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

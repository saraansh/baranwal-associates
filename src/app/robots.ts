import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/utils/helpers';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api/*',
          '/_next/*',
          '/admin/*',
          '/private/*',
          '/*.json$',
          '/sitemap.xml',
          '/robots.txt',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api/*',
          '/_next/*',
          '/admin/*',
          '/private/*',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api/*',
          '/_next/*',
          '/admin/*',
          '/private/*',
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-news.xml`,
      `${baseUrl}/sitemap-projects.xml`,
    ],
    host: baseUrl,
  };
}

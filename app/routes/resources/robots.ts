import { SITE_URL } from "~/lib/seo";

export function loader() {
  const body = `User-agent: *
Allow: /
Disallow: /portal
Disallow: /admin
Disallow: /auth

Sitemap: ${SITE_URL}/sitemap.xml
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

import { firm } from "./content";

export const SITE_URL = "https://baranwalassociates.com";

export function pageMeta({
  title,
  description,
  path = "/",
  image,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}) {
  const url = `${SITE_URL}${path}`;
  const img =
    image ??
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: img },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: firm.name },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

/** LocalBusiness + ProfessionalService structured data (home page). */
export function firmJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    name: firm.name,
    description:
      "Architecture, structural engineering and interior design studio in Gorakhpur, serving Eastern Uttar Pradesh since 1987.",
    url: SITE_URL,
    telephone: firm.phones[0].replace(/\s/g, ""),
    email: firm.email,
    foundingDate: String(firm.since),
    founder: { "@type": "Person", name: firm.principal },
    address: {
      "@type": "PostalAddress",
      streetAddress: "25 Hari Om Nagar, Civil Lines",
      addressLocality: "Gorakhpur",
      addressRegion: "Uttar Pradesh",
      postalCode: "273009",
      addressCountry: "IN",
    },
    areaServed: "Eastern Uttar Pradesh",
    openingHours: "Mo-Sa 10:30-19:00",
    sameAs: Object.values(firm.social),
  };
}

export function articleJsonLd(post: {
  title: string;
  summary: string;
  slug: string;
  cover_image_url?: string | null;
  published_at?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    image: post.cover_image_url ?? undefined,
    datePublished: post.published_at ?? undefined,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { "@type": "Organization", name: firm.name },
    publisher: { "@type": "Organization", name: firm.name },
  };
}

export function JsonLd(data: object): string {
  return JSON.stringify(data);
}

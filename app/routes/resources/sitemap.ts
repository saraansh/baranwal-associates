import type { Route } from "./+types/sitemap";
import { fallbackPosts, fallbackProjects } from "~/lib/content";
import { SITE_URL } from "~/lib/seo";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export async function loader({ request }: Route.LoaderArgs) {
  let projectSlugs: string[] = fallbackProjects.map((p) => p.slug);
  let postSlugs: string[] = fallbackPosts.map((p) => p.slug);

  try {
    const { supabase } = createSupabaseServerClient(request);
    const [{ data: projects }, { data: posts }] = await Promise.all([
      supabase.from("projects").select("slug").eq("is_public", true),
      supabase.from("blog_posts").select("slug").not("published_at", "is", null),
    ]);
    if (projects?.length) projectSlugs = projects.map((p) => p.slug);
    if (posts?.length) postSlugs = posts.map((p) => p.slug);
  } catch {
    // static fallbacks already set
  }

  const urls = [
    "",
    "/portfolio",
    "/blog",
    "/about",
    "/contact",
    ...projectSlugs.map((s) => `/portfolio/${s}`),
    ...postSlugs.map((s) => `/blog/${s}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

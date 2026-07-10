import { Link } from "react-router";

import type { Route } from "./+types/blog";
import { FadeRise, ImageSettle, RuleDraw } from "~/components/motion";
import { fallbackPosts } from "~/lib/content";
import { pageMeta } from "~/lib/seo";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Journal — Baranwal Associates",
    description:
      "Essays and field notes on architecture, interiors, materials and building in Eastern Uttar Pradesh — from the Baranwal Associates drafting table.",
    path: "/blog",
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const { supabase } = createSupabaseServerClient(request);
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, title, category, summary, cover_image_url, published_at")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false });
    return { posts: posts?.length ? posts : fallbackPosts };
  } catch {
    return { posts: fallbackPosts };
  }
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  const [lead, ...rest] = posts;

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-10">
      <FadeRise>
        <p className="annotation">Journal</p>
        <h1 className="mt-4 font-display text-5xl font-light md:text-6xl">
          From the drafting table
        </h1>
      </FadeRise>

      <RuleDraw className="mt-12" />

      {lead && (
        <FadeRise className="mt-16">
          <Link to={`/blog/${lead.slug}`} viewTransition className="group grid gap-8 md:grid-cols-12">
            <ImageSettle
              src={lead.cover_image_url ?? ""}
              alt=""
              className="aspect-[16/9] rounded-sm md:col-span-8"
            />
            <div className="md:col-span-4 md:self-end">
              <p className="annotation">{lead.category}</p>
              <h2 className="mt-3 font-display text-3xl font-light leading-snug transition-colors group-hover:text-accent">
                {lead.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {lead.summary}
              </p>
            </div>
          </Link>
        </FadeRise>
      )}

      <div className="mt-20 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post, i) => (
          <FadeRise key={post.slug} delay={(i % 3) * 0.06}>
            <Link to={`/blog/${post.slug}`} viewTransition className="group block">
              <ImageSettle
                src={post.cover_image_url ?? ""}
                alt=""
                className="aspect-[3/2] rounded-sm"
              />
              <p className="annotation mt-4">{post.category}</p>
              <h2 className="mt-2 font-display text-xl font-light leading-snug transition-colors group-hover:text-accent">
                {post.title}
              </h2>
            </Link>
          </FadeRise>
        ))}
      </div>
    </main>
  );
}

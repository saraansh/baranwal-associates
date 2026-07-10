import { Link } from "react-router";

import type { Route } from "./+types/blog-detail";
import { FadeRise, ImageSettle, RuleDraw } from "~/components/motion";
import { fallbackPosts } from "~/lib/content";
import { articleJsonLd, JsonLd, pageMeta } from "~/lib/seo";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export function meta({ loaderData }: Route.MetaArgs) {
  const p = loaderData?.post;
  return pageMeta({
    title: p ? `${p.title} — Baranwal Associates` : "Journal — Baranwal Associates",
    description: p?.summary ?? "",
    path: `/blog/${p?.slug ?? ""}`,
    image: p?.cover_image_url ?? undefined,
  });
}

export async function loader({ request, params }: Route.LoaderArgs) {
  try {
    const { supabase } = createSupabaseServerClient(request);
    const { data: post } = await supabase
      .from("blog_posts")
      .select(
        "slug, title, category, summary, body_md, cover_image_url, published_at",
      )
      .eq("slug", params.slug)
      .not("published_at", "is", null)
      .maybeSingle();
    if (post) return { post };
  } catch {
    // fall through to static fallback
  }
  const fallback = fallbackPosts.find((p) => p.slug === params.slug);
  if (!fallback) throw new Response("Not Found", { status: 404 });
  return { post: { ...fallback, body_md: "Full article coming soon." } };
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-36 lg:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JsonLd(articleJsonLd(post)) }}
      />
      <FadeRise>
        <Link to="/blog" viewTransition className="annotation hover:text-accent">
          ← Journal
        </Link>
        <p className="annotation mt-8">
          {post.category}
          {date ? ` — ${date}` : ""}
        </p>
        <h1 className="mt-4 font-display text-4xl font-light leading-tight md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          {post.summary}
        </p>
      </FadeRise>

      <FadeRise className="mt-10">
        <ImageSettle
          src={post.cover_image_url ?? ""}
          alt=""
          className="aspect-[16/9] rounded-sm"
          loading="eager"
        />
      </FadeRise>

      <FadeRise className="prose-lg mt-12 max-w-none leading-relaxed">
        {post.body_md.split("\n\n").map((para: string, i: number) => (
          <p key={i} className="mb-6">
            {para}
          </p>
        ))}
      </FadeRise>

      <RuleDraw className="mt-16" />
      <FadeRise className="mt-8">
        <p className="annotation">
          Written at the Baranwal Associates studio, Gorakhpur
        </p>
      </FadeRise>
    </main>
  );
}

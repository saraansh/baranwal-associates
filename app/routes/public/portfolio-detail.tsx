import { Link } from "react-router";

import type { Route } from "./+types/portfolio-detail";
import { FadeRise, ImageSettle, RuleDraw } from "~/components/motion";
import { fallbackProjects, firm } from "~/lib/content";
import { pageMeta } from "~/lib/seo";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export function meta({ loaderData }: Route.MetaArgs) {
  const p = loaderData?.project;
  return pageMeta({
    title: p ? `${p.name} — Baranwal Associates` : "Project — Baranwal Associates",
    description: p?.description ?? "Project case study by Baranwal Associates.",
    path: `/portfolio/${p?.slug ?? ""}`,
    image: p?.cover_image_url ?? undefined,
  });
}

export async function loader({ request, params }: Route.LoaderArgs) {
  try {
    const { supabase } = createSupabaseServerClient(request);
    const { data: project } = await supabase
      .from("projects")
      .select(
        "slug, name, location, description, cover_image_url, status, progress, starts_on, ends_on",
      )
      .eq("slug", params.slug)
      .eq("is_public", true)
      .maybeSingle();
    if (project) return { project };
  } catch {
    // fall through to static fallback
  }
  const fallback = fallbackProjects.find((p) => p.slug === params.slug);
  if (!fallback) throw new Response("Not Found", { status: 404 });
  return { project: fallback };
}

export default function ProjectDetail({ loaderData }: Route.ComponentProps) {
  const { project } = loaderData;
  const status = "status" in project ? project.status : undefined;

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-10">
      <FadeRise>
        <Link to="/portfolio" viewTransition className="annotation hover:text-accent">
          ← All projects
        </Link>
        <h1 className="mt-6 font-display text-5xl font-light md:text-6xl">
          {project.name}
        </h1>
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
          <span className="annotation">{project.location}</span>
          {status && <span className="annotation">status — {status}</span>}
        </div>
      </FadeRise>

      <FadeRise className="mt-12">
        <ImageSettle
          src={project.cover_image_url ?? ""}
          alt={project.name}
          className="aspect-[16/9] rounded-sm"
          loading="eager"
        />
      </FadeRise>

      <div className="mt-16 grid gap-12 md:grid-cols-12">
        <FadeRise className="md:col-span-7">
          <p className="annotation mb-4">The brief</p>
          <p className="text-xl font-light leading-relaxed">
            {project.description}
          </p>
        </FadeRise>
        <FadeRise className="md:col-span-4 md:col-start-9">
          <p className="annotation mb-4">Enquire</p>
          <p className="text-sm leading-relaxed text-muted">
            Planning something similar? We'd be glad to talk it through.
          </p>
          <a
            href={`https://wa.me/${firm.whatsapp}?text=${encodeURIComponent(
              `Hello! I saw the ${project.name} project on your website and I'm interested in something similar.`,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-85"
          >
            WhatsApp the studio
          </a>
        </FadeRise>
      </div>

      <RuleDraw className="mt-20" />
    </main>
  );
}

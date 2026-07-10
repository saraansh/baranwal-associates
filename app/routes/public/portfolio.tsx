import { Link } from "react-router";

import type { Route } from "./+types/portfolio";
import { FadeRise, ImageSettle, RuleDraw } from "~/components/motion";
import { fallbackProjects } from "~/lib/content";
import { pageMeta } from "~/lib/seo";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Portfolio — Baranwal Associates",
    description:
      "Selected residential, commercial and heritage projects by Baranwal Associates — architects and interior designers in Gorakhpur, Eastern U.P.",
    path: "/portfolio",
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const { supabase } = createSupabaseServerClient(request);
    const { data: projects } = await supabase
      .from("projects")
      .select("slug, name, location, description, cover_image_url, status")
      .eq("is_public", true)
      .order("created_at", { ascending: false });
    return { projects: projects?.length ? projects : fallbackProjects };
  } catch {
    return { projects: fallbackProjects };
  }
}

export default function Portfolio({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-10">
      <FadeRise>
        <p className="annotation">Selected work</p>
        <h1 className="mt-4 font-display text-5xl font-light md:text-6xl">
          Portfolio
        </h1>
        <p className="mt-6 max-w-lg text-lg text-muted">
          Homes, showrooms, townships and restorations across Eastern Uttar
          Pradesh — each drawn with intent, built to last.
        </p>
      </FadeRise>

      <RuleDraw className="mt-12" />

      <div className="mt-16 grid gap-x-10 gap-y-20 md:grid-cols-12">
        {projects.map((p, i) => (
          <FadeRise
            key={p.slug}
            delay={(i % 2) * 0.08}
            className={i % 3 === 0 ? "md:col-span-7" : "md:col-span-5"}
          >
            <Link
              to={`/portfolio/${p.slug}`}
              viewTransition
              className="group block"
            >
              <ImageSettle
                src={p.cover_image_url ?? ""}
                alt={p.name}
                className={`rounded-sm ${i % 3 === 0 ? "aspect-[16/10]" : "aspect-[4/3]"}`}
              />
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h2 className="font-display text-2xl font-light transition-colors group-hover:text-accent md:text-3xl">
                  {p.name}
                </h2>
                <span className="annotation shrink-0">{p.location}</span>
              </div>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                {p.description}
              </p>
            </Link>
          </FadeRise>
        ))}
      </div>
    </main>
  );
}

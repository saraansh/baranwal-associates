import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";

import type { Route } from "./+types/home";
import {
  EASE,
  FadeRise,
  ImageSettle,
  RuleDraw,
  Stagger,
  StaggerItem,
} from "~/components/motion";
import {
  fallbackPosts,
  fallbackProjects,
  faqs,
  firm,
  services,
  stats,
  testimonial,
} from "~/lib/content";
import { firmJsonLd, JsonLd, pageMeta } from "~/lib/seo";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Baranwal Associates — Architects in Gorakhpur, Since 1987",
    description:
      "Architecture, structural engineering and interior design studio in Gorakhpur. Designing dreams and building legacies across Eastern Uttar Pradesh since 1987.",
    path: "/",
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const { supabase } = createSupabaseServerClient(request);
    const [{ data: projects }, { data: posts }] = await Promise.all([
      supabase
        .from("projects")
        .select("slug, name, location, description, cover_image_url, status")
        .eq("is_public", true)
        .limit(3),
      supabase
        .from("blog_posts")
        .select("slug, title, category, summary, cover_image_url, published_at")
        .not("published_at", "is", null)
        .order("published_at", { ascending: false })
        .limit(3),
    ]);
    return {
      projects: projects?.length ? projects : fallbackProjects,
      posts: posts?.length ? posts : fallbackPosts.slice(0, 3),
    };
  } catch {
    return { projects: fallbackProjects, posts: fallbackPosts.slice(0, 3) };
  }
}

const HERO_LINES = ["Designing dreams,", "building legacy."] as const;

export default function Home({ loaderData }: Route.ComponentProps) {
  const { projects, posts } = loaderData;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JsonLd(firmJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JsonLd({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      {/* ------------------------------------------------ Hero */}
      <section className="relative min-h-screen overflow-hidden pt-24">
        <div className="drafting-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-10 lg:grid-cols-12 lg:px-10 lg:pt-20">
          <div className="lg:col-span-7">
            <motion.p
              className="annotation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Architects & structural engineers — {firm.city} — est.{" "}
              {firm.since}
            </motion.p>
            <h1 className="mt-6 font-display text-[clamp(2.8rem,7.5vw,6.2rem)] font-light leading-[1.04] tracking-tight">
              {HERO_LINES.map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.15 + i * 0.12,
                      ease: EASE,
                    }}
                  >
                    {i === 1 ? (
                      <>
                        building <em className="text-accent">legacy</em>.
                      </>
                    ) : (
                      line
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              className="mt-8 max-w-md text-lg leading-relaxed text-muted"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
            >
              A {firm.city} studio shaping homes, showrooms and townships
              across {firm.region} — where every line is drawn with intent.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            >
              <Link
                to="/contact"
                className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent"
              >
                Start your project
              </Link>
              <Link
                to="/portfolio"
                viewTransition
                className="rounded-full border border-line px-6 py-3 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                View portfolio
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="relative lg:col-span-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            <ImageSettle
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
              alt="Modern residence at dusk designed by Baranwal Associates"
              className="aspect-[4/5] rounded-sm"
              loading="eager"
            />
            <p className="annotation mt-3 text-right">
              fig. 01 — residence, dusk elevation
            </p>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------ Stats */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <RuleDraw />
        <Stagger className="grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <p className="font-display text-5xl font-light text-accent">
                {s.value}
              </p>
              <p className="annotation mt-2">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <RuleDraw />
      </section>

      {/* ------------------------------------------------ Services index */}
      <ServicesIndex />

      {/* ------------------------------------------------ Featured projects */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <FadeRise>
          <p className="annotation">02 — Selected work</p>
          <h2 className="mt-4 font-display text-4xl font-light md:text-5xl">
            Recent <span className="italic text-accent">projects</span>
          </h2>
        </FadeRise>
        <div className="mt-14 grid gap-10 md:grid-cols-12">
          {projects.map((p, i) => (
            <FadeRise
              key={p.slug}
              delay={i * 0.08}
              className={
                i === 0
                  ? "md:col-span-7"
                  : i === 1
                    ? "md:col-span-5 md:mt-20"
                    : "md:col-span-6 md:col-start-4"
              }
            >
              <Link
                to={`/portfolio/${p.slug}`}
                viewTransition
                className="group block"
              >
                <ImageSettle
                  src={p.cover_image_url ?? ""}
                  alt={p.name}
                  className={`rounded-sm ${i === 0 ? "aspect-[16/10]" : "aspect-[4/3]"}`}
                />
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl font-light transition-colors group-hover:text-accent">
                    {p.name}
                  </h3>
                  <span className="annotation shrink-0">{p.location}</span>
                </div>
              </Link>
            </FadeRise>
          ))}
        </div>
        <FadeRise className="mt-14">
          <Link
            to="/portfolio"
            viewTransition
            className="annotation !text-accent underline-offset-8 hover:underline"
          >
            All projects →
          </Link>
        </FadeRise>
      </section>

      {/* ------------------------------------------------ Testimonial */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <FadeRise>
            <p className="annotation">What clients say</p>
            <blockquote className="mt-8 font-display text-3xl font-light leading-snug md:text-4xl">
              “{testimonial.quote}”
            </blockquote>
            <p className="annotation mt-8">
              — {testimonial.author}, via {testimonial.source} · 5.0★ on
              Justdial
            </p>
          </FadeRise>
        </div>
      </section>

      {/* ------------------------------------------------ Journal preview */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <FadeRise>
          <p className="annotation">03 — Journal</p>
          <h2 className="mt-4 font-display text-4xl font-light md:text-5xl">
            From the <span className="italic text-accent">drafting table</span>
          </h2>
        </FadeRise>
        <Stagger className="mt-14 grid gap-10 md:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
              <Link
                to={`/blog/${post.slug}`}
                viewTransition
                className="group block"
              >
                <ImageSettle
                  src={post.cover_image_url ?? ""}
                  alt=""
                  className="aspect-[3/2] rounded-sm"
                />
                <p className="annotation mt-4">{post.category}</p>
                <h3 className="mt-2 font-display text-xl font-light leading-snug transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ------------------------------------------------ FAQ */}
      <section className="mx-auto max-w-4xl px-6 py-24 lg:px-10">
        <FadeRise>
          <p className="annotation">04 — Questions</p>
          <h2 className="mt-4 font-display text-4xl font-light md:text-5xl">
            Frequently <span className="italic text-accent">asked</span>
          </h2>
        </FadeRise>
        <div className="mt-12">
          {faqs.map((f) => (
            <FadeRise key={f.q}>
              <details className="group border-b border-line py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-accent transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                  {f.a}
                </p>
              </details>
            </FadeRise>
          ))}
        </div>
      </section>
    </main>
  );
}

/** Editorial hover-preview index of the seven services. */
function ServicesIndex() {
  const [active, setActive] = useState(0);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <FadeRise>
        <p className="annotation">01 — What we do</p>
        <h2 className="mt-4 font-display text-4xl font-light md:text-5xl">
          Seven disciplines,
          <br />
          one <span className="italic text-accent">standard</span>
        </h2>
      </FadeRise>

      <div className="mt-14 grid gap-12 lg:grid-cols-12">
        <ul className="lg:col-span-7">
          {services.map((s, i) => (
            <FadeRise key={s.slug} delay={i * 0.04}>
              <li
                onMouseEnter={() => setActive(i)}
                className="border-b border-line"
              >
                <div className="flex items-baseline gap-6 py-6">
                  <span className="annotation w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3
                      className={`font-display text-2xl font-light transition-colors md:text-3xl ${
                        active === i ? "text-accent" : ""
                      }`}
                    >
                      {s.title}
                    </h3>
                    <p
                      className={`mt-2 overflow-hidden text-sm text-muted transition-all duration-500 ${
                        active === i
                          ? "max-h-10 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {s.features.join(" · ")}
                    </p>
                  </div>
                </div>
              </li>
            </FadeRise>
          ))}
        </ul>

        <div className="relative hidden lg:col-span-5 lg:block">
          <div className="sticky top-32 aspect-[4/5] overflow-hidden rounded-sm">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={services[active].slug}
                src={services[active].image}
                alt={services[active].title}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </AnimatePresence>
            <p className="annotation absolute bottom-4 left-4 z-10 rounded-full bg-paper/80 px-3 py-1.5 backdrop-blur">
              {services[active].title}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

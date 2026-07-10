import type { Route } from "./+types/about";
import { FadeRise, ImageSettle, RuleDraw, Stagger, StaggerItem } from "~/components/motion";
import { firm, stats } from "~/lib/content";
import { pageMeta } from "~/lib/seo";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "About — Baranwal Associates",
    description: `${firm.name} is an architecture, structural engineering and interior design studio in ${firm.city}, led by ${firm.principal} since ${firm.since}.`,
    path: "/about",
  });
}

const PROCESS = [
  {
    step: "Listen",
    detail:
      "Every project begins with your plot, your budget and your way of living. We measure, we ask, we sketch nothing yet.",
  },
  {
    step: "Draw",
    detail:
      "Concept drawings, Vastu reconciliation where it matters, and 3D models you can orbit on your phone — before you approve anything.",
  },
  {
    step: "Sanction",
    detail:
      "We carry the drawings through development-authority approvals — GDA, VDA and beyond — until the file says yes.",
  },
  {
    step: "Build",
    detail:
      "Scheduled site supervision, milestone tracking, and drawing versions kept in order — so the building matches the drawing.",
  },
] as const;

export default function About(_: Route.ComponentProps) {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-10">
      <FadeRise>
        <p className="annotation">The studio</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-light leading-tight md:text-6xl">
          Four decades of drawing
          <br />
          <span className="italic text-accent">Eastern U.P.</span> forward
        </h1>
      </FadeRise>

      <div className="mt-16 grid gap-12 md:grid-cols-12">
        <FadeRise className="md:col-span-7">
          <ImageSettle
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80"
            alt="Architect drafting over rolled plans"
            className="aspect-[4/3] rounded-sm"
            loading="eager"
          />
          <p className="annotation mt-3">fig. 02 — the drafting table</p>
        </FadeRise>
        <FadeRise className="md:col-span-5 md:self-center" delay={0.1}>
          <p className="text-xl font-light leading-relaxed">
            Founded by <strong className="font-medium">{firm.principal}</strong>{" "}
            in {firm.since}, Baranwal Associates has carried thousands of
            projects from first sketch to final handover — homes, showrooms,
            hospitals, townships and century-old havelis given new life.
          </p>
          <p className="mt-6 leading-relaxed text-muted">
            The studio practices from Civil Lines, {firm.city}, pairing
            old-school drafting discipline with modern tools: 3D visualization,
            structural analysis, and a client portal where you watch your
            project take shape — drawings, progress and conversations in one
            place.
          </p>
        </FadeRise>
      </div>

      <RuleDraw className="mt-24" />

      <section className="py-20">
        <FadeRise>
          <p className="annotation">How we work</p>
          <h2 className="mt-4 font-display text-4xl font-light">
            The <span className="italic text-accent">process</span>
          </h2>
        </FadeRise>
        <Stagger className="mt-14 grid gap-10 md:grid-cols-4">
          {PROCESS.map((p, i) => (
            <StaggerItem key={p.step}>
              <p className="annotation">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-display text-2xl font-light">
                {p.step}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {p.detail}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

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
    </main>
  );
}

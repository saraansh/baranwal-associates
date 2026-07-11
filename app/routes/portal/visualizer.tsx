import { data } from "react-router";

import type { Route } from "./+types/visualizer";
import { requireUser } from "~/lib/auth.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Interior Visualizer — Baranwal Associates" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { profile, supabase, headers } = await requireUser(request);
  const { data: rows } = await supabase
    .from("credits_ledger")
    .select("delta")
    .eq("user_id", profile.id);
  const credits = (rows ?? []).reduce((sum, r) => sum + r.delta, 0);
  return data({ credits }, { headers });
}

/** Placeholder — the full AI visualizer ships in the payments/AI phase. */
export default function Visualizer({ loaderData }: Route.ComponentProps) {
  return (
    <main className="mx-auto max-w-2xl text-center">
      <p className="annotation">Interior visualizer</p>
      <h1 className="mt-2 font-display text-4xl font-light">
        Reimagine your room with <span className="italic text-accent">AI</span>
      </h1>
      <p className="mx-auto mt-6 max-w-md text-muted">
        Upload a photo of your space, pick a style, lighting mood and
        materials, and see it transformed. Launching shortly — your{" "}
        <strong className="text-ink">{loaderData.credits} credits</strong> are
        ready and waiting.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {[
          "Modern Minimal",
          "Contemporary Indian",
          "Japandi",
          "Industrial",
          "Warm Ambient",
          "Golden Hour",
          "Italian Marble",
          "Light Oak",
          "Kota Stone",
        ].map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-line px-4 py-1.5 text-sm text-muted"
          >
            {chip}
          </span>
        ))}
      </div>
    </main>
  );
}

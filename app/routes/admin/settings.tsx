import { data, useFetcher } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/settings";
import { requireUser } from "~/lib/auth.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Admin · Settings — Baranwal Associates" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = await requireUser(request, ["system_admin"]);
  const { data: settings } = await supabase
    .from("system_settings")
    .select("key, value, description, updated_at")
    .order("key");
  return data({ settings: settings ?? [] }, { headers });
}

const updateSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
});

export async function action({ request }: Route.ActionArgs) {
  const { profile, supabase, headers } = await requireUser(request, [
    "system_admin",
  ]);
  const parsed = updateSchema.safeParse(
    Object.fromEntries(await request.formData()),
  );
  if (!parsed.success) {
    return data({ error: "Invalid input" }, { status: 400, headers });
  }

  let value: unknown;
  try {
    value = JSON.parse(parsed.data.value);
  } catch {
    // Treat bare strings as JSON strings.
    value = parsed.data.value;
  }

  const { error } = await supabase
    .from("system_settings")
    .update({ value, updated_by: profile.id })
    .eq("key", parsed.data.key);
  if (error) return data({ error: error.message }, { status: 500, headers });
  return data({ ok: true, key: parsed.data.key }, { headers });
}

export default function Settings({ loaderData }: Route.ComponentProps) {
  const { settings } = loaderData;

  return (
    <main>
      <p className="annotation">
        Runtime constants — changes apply on the next request, no deploy
        needed
      </p>
      <div className="mt-6 space-y-4">
        {settings.map((s) => (
          <SettingRow key={s.key} setting={s} />
        ))}
      </div>
    </main>
  );
}

function SettingRow({
  setting,
}: {
  setting: {
    key: string;
    value: unknown;
    description: string;
    updated_at: string;
  };
}) {
  const fetcher = useFetcher();
  const saved =
    fetcher.state === "idle" &&
    fetcher.data &&
    "ok" in (fetcher.data as object);

  return (
    <fetcher.Form
      method="post"
      className="flex flex-wrap items-end gap-4 rounded-sm border border-line p-4"
    >
      <input type="hidden" name="key" value={setting.key} />
      <div className="min-w-56 flex-1">
        <p className="font-mono text-sm">{setting.key}</p>
        <p className="annotation mt-0.5">{setting.description}</p>
      </div>
      <input
        name="value"
        defaultValue={JSON.stringify(setting.value)}
        className="field-input w-48 font-mono text-sm"
      />
      <button
        type="submit"
        disabled={fetcher.state !== "idle"}
        className="rounded-full border border-line px-4 py-1.5 text-sm transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
      >
        {fetcher.state !== "idle" ? "Saving…" : saved ? "Saved ✓" : "Save"}
      </button>
    </fetcher.Form>
  );
}

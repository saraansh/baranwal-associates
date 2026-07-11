import { data, Form } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/payments";
import { requireUser } from "~/lib/auth.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Payments — Baranwal Associates" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = await requireUser(request, [
    "system_admin",
    "accountant",
  ]);

  const [{ data: payments }, { data: clients }] = await Promise.all([
    supabase
      .from("payments")
      .select(
        "id, amount_inr, method, status, notes, razorpay_payment_id, created_at, user_id, profiles!payments_user_id_fkey(full_name)",
      )
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "client")
      .eq("is_active", true)
      .order("full_name"),
  ]);

  return data({ payments: payments ?? [], clients: clients ?? [] }, { headers });
}

const cashSchema = z.object({
  // z.guid(), not z.uuid(): seed ids fail RFC variant-bit validation
  user_id: z.guid(),
  amount_inr: z.coerce.number().positive(),
  notes: z.string().trim().min(3, "Add a receipt no. / description"),
});

export async function action({ request }: Route.ActionArgs) {
  const { profile, supabase, headers } = await requireUser(request, [
    "system_admin",
    "accountant",
  ]);
  const parsed = cashSchema.safeParse(
    Object.fromEntries(await request.formData()),
  );
  if (!parsed.success) {
    return data(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400, headers },
    );
  }

  const { error } = await supabase.from("payments").insert({
    user_id: parsed.data.user_id,
    amount_inr: parsed.data.amount_inr,
    method: "cash",
    status: "paid",
    recorded_by: profile.id,
    notes: parsed.data.notes,
  });
  if (error) return data({ error: error.message }, { status: 500, headers });
  return data({ ok: true }, { headers });
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function Payments({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { payments, clients } = loaderData;
  const error =
    actionData && "error" in actionData ? actionData.error : undefined;

  return (
    <main>
      <p className="annotation">Accounts</p>
      <h1 className="mt-2 font-display text-4xl font-light">Payments ledger</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                {["Date", "Client", "Description", "Method", "Amount"].map(
                  (h) => (
                    <th key={h} className="annotation py-3 font-normal">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 text-muted">
                    {new Date(p.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-3">
                    {(p.profiles as { full_name?: string })?.full_name}
                  </td>
                  <td className="max-w-56 truncate py-3 text-muted">
                    {p.notes || p.razorpay_payment_id}
                  </td>
                  <td className="py-3">
                    <span
                      className={`annotation ${p.method === "cash" ? "" : "!text-accent"}`}
                    >
                      {p.method}
                    </span>
                  </td>
                  <td className="py-3 text-right font-medium">
                    {inr.format(Number(p.amount_inr))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="lg:col-span-4">
          <div className="rounded-sm border border-line p-6">
            <p className="annotation">Record a cash payment</p>
            <Form method="post" className="mt-4 space-y-5">
              <div>
                <label htmlFor="user_id" className="annotation mb-1 block">
                  Client
                </label>
                <select
                  id="user_id"
                  name="user_id"
                  required
                  className="field-input"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="amount_inr" className="annotation mb-1 block">
                  Amount (INR)
                </label>
                <input
                  id="amount_inr"
                  name="amount_inr"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="notes" className="annotation mb-1 block">
                  Receipt no. / description
                </label>
                <input
                  id="notes"
                  name="notes"
                  required
                  className="field-input"
                  placeholder="RCPT-2026-021 — design fee instalment"
                />
              </div>
              {error && <p className="text-sm text-accent">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent"
              >
                Record payment
              </button>
            </Form>
          </div>
        </aside>
      </div>
    </main>
  );
}

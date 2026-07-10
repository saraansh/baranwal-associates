import { data, Form, useNavigation } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/contact";
import { FadeRise, RuleDraw } from "~/components/motion";
import { firm } from "~/lib/content";
import { pageMeta } from "~/lib/seo";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Contact — Baranwal Associates",
    description: `Reach ${firm.name} in ${firm.city} — enquiry form, phone, email or WhatsApp. ${firm.hours}.`,
    path: "/contact",
  });
}

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name"),
  email: z.string().trim().email("That email doesn't look right"),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(10, "Tell us a little about your project"),
  // Honeypot — bots fill this, humans never see it.
  company: z.string().max(0).optional(),
});

export async function action({ request }: Route.ActionArgs) {
  const form = Object.fromEntries(await request.formData());
  const parsed = enquirySchema.safeParse(form);

  if (!parsed.success) {
    const errors = Object.fromEntries(
      parsed.error.issues.map((i) => [i.path[0], i.message]),
    );
    return data({ ok: false as const, errors }, { status: 400 });
  }
  if (form.company) return { ok: true as const }; // silently drop bots

  try {
    const { supabase } = createSupabaseServerClient(request);
    const { error } = await supabase.from("contact_enquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    });
    if (error) throw error;
  } catch (e) {
    console.error("Enquiry insert failed:", e);
    return data(
      {
        ok: false as const,
        errors: {
          message:
            "We couldn't save your enquiry just now — please WhatsApp or call us instead.",
        },
      },
      { status: 500 },
    );
  }

  return { ok: true as const };
}

export default function Contact({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";
  const errors =
    actionData && !actionData.ok
      ? (actionData.errors as Record<string, string>)
      : undefined;

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-36 lg:px-10">
      <FadeRise>
        <p className="annotation">Contact</p>
        <h1 className="mt-4 font-display text-5xl font-light md:text-6xl">
          Tell us about
          <br />
          your <span className="italic text-accent">plot</span>
        </h1>
      </FadeRise>

      <RuleDraw className="mt-12" />

      <div className="mt-16 grid gap-16 lg:grid-cols-12">
        <FadeRise className="lg:col-span-7">
          {actionData?.ok ? (
            <div className="rounded-sm border border-accent/40 bg-surface p-10">
              <p className="font-display text-3xl font-light">
                Namaste — enquiry received. 🙏
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                We reply within one working day ({firm.hours}). If it's urgent,
                WhatsApp or call us directly.
              </p>
            </div>
          ) : (
            <Form method="post" className="space-y-7">
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden
              />
              <Field label="Your name" name="name" error={errors?.name}>
                <input
                  id="name"
                  name="name"
                  required
                  className="field-input"
                  placeholder="Full name"
                />
              </Field>
              <div className="grid gap-7 sm:grid-cols-2">
                <Field label="Email" name="email" error={errors?.email}>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    className="field-input"
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="Phone (optional)" name="phone" error={errors?.phone}>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    className="field-input"
                    placeholder="+91"
                  />
                </Field>
              </div>
              <Field
                label="About your project"
                name="message"
                error={errors?.message}
              >
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="field-input resize-y"
                  placeholder="Plot size, location, what you're dreaming of…"
                />
              </Field>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-ink px-8 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-accent disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send enquiry"}
              </button>
            </Form>
          )}
        </FadeRise>

        <FadeRise className="lg:col-span-4 lg:col-start-9" delay={0.1}>
          <div className="space-y-10">
            <div>
              <p className="annotation mb-3">Prefer to talk?</p>
              <a
                href={`https://wa.me/${firm.whatsapp}?text=${encodeURIComponent("Hello! I'm interested in your architectural services.")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-85"
              >
                WhatsApp the studio
              </a>
            </div>
            <div>
              <p className="annotation mb-3">Phone</p>
              {firm.phones.map((p) => (
                <a
                  key={p}
                  href={`tel:${p.replace(/\s/g, "")}`}
                  className="block text-lg transition-colors hover:text-accent"
                >
                  {p}
                </a>
              ))}
            </div>
            <div>
              <p className="annotation mb-3">Email</p>
              <a
                href={`mailto:${firm.email}`}
                className="text-lg transition-colors hover:text-accent"
              >
                {firm.email}
              </a>
            </div>
            <div>
              <p className="annotation mb-3">Studio</p>
              <address className="text-sm not-italic leading-7 text-muted">
                {firm.address}
                <br />
                {firm.hours}
              </address>
            </div>
          </div>
        </FadeRise>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="annotation mb-2 block">
        {label}
      </label>
      {children}
      {error && <p className="mt-2 text-sm text-accent">{error}</p>}
    </div>
  );
}

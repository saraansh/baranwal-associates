import { useEffect, useRef, useState } from "react";
import { data, Link, useRevalidator, useSearchParams } from "react-router";

import type { Route } from "./+types/visualizer";
import { AttachmentImage } from "~/components/attachment";
import { requireUser } from "~/lib/auth.server";
import { presignAndUpload } from "~/lib/files.client";
import { PRESET_DIMENSIONS } from "~/lib/presets";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Interior Visualizer — Baranwal Associates" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { profile, supabase, headers } = await requireUser(request);
  const url = new URL(request.url);
  const activeThread = url.searchParams.get("thread");

  const [{ data: ledger }, { data: threads }, { data: settings }] =
    await Promise.all([
      supabase.from("credits_ledger").select("delta").eq("user_id", profile.id),
      supabase
        .from("threads")
        .select("id, title, created_at")
        .eq("kind", "ai_chat")
        .eq("created_by", profile.id)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("system_settings")
        .select("key, value")
        .in("key", ["credits.inr_per_credit", "ai.trial_generations"]),
    ]);

  let messages: {
    id: string;
    body: string;
    is_ai: boolean;
    created_at: string;
    message_attachments: {
      id: string;
      storage_key: string;
      filename: string;
      mime_type: string;
    }[];
  }[] = [];
  if (activeThread) {
    const { data: msgs } = await supabase
      .from("messages")
      .select(
        "id, body, is_ai, created_at, message_attachments(id, storage_key, filename, mime_type)",
      )
      .eq("thread_id", activeThread)
      .order("created_at");
    messages = msgs ?? [];
  }

  const cfg = Object.fromEntries(
    (settings ?? []).map((s) => [s.key, s.value]),
  );
  const { count: trialUsed } = await supabase
    .from("ai_generations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("is_trial", true);

  return data(
    {
      credits: (ledger ?? []).reduce((s, r) => s + r.delta, 0),
      threads: threads ?? [],
      activeThread,
      messages,
      inrPerCredit: Number(cfg["credits.inr_per_credit"] ?? 99),
      trialRemaining: Math.max(
        0,
        Number(cfg["ai.trial_generations"] ?? 2) - (trialUsed ?? 0),
      ),
    },
    { headers },
  );
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open(): void };
  }
}

export default function Visualizer({ loaderData }: Route.ComponentProps) {
  const {
    credits: initialCredits,
    threads,
    activeThread,
    messages,
    inrPerCredit,
    trialRemaining: initialTrial,
  } = loaderData;

  const revalidator = useRevalidator();
  const [, setSearchParams] = useSearchParams();
  const [credits, setCredits] = useState(initialCredits);
  const [trialRemaining, setTrialRemaining] = useState(initialTrial);
  const [presets, setPresets] = useState<Record<string, string>>({});
  const [prompt, setPrompt] = useState("");
  const [photo, setPhoto] = useState<{ key: string; localUrl: string } | null>(
    null,
  );
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(activeThread);
  const [showFineTune, setShowFineTune] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCredits(initialCredits);
    setTrialRemaining(initialTrial);
  }, [initialCredits, initialTrial]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages.length]);

  async function pickPhoto(file: File) {
    setUploadingPhoto(true);
    setError(null);
    try {
      const key = await presignAndUpload(null, file, file.name, "ai-input");
      setPhoto({ key, localUrl: URL.createObjectURL(file) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: threadId ?? undefined,
          imageKey: photo?.key,
          presets,
          prompt,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Generation failed");
        return;
      }
      setCredits(body.credits);
      setTrialRemaining(body.trialRemaining);
      setPrompt("");
      if (!threadId) {
        // Move into the thread URL (through the router, so loaders re-run).
        setThreadId(body.threadId);
        setSearchParams({ thread: body.threadId }, { replace: true });
      } else {
        revalidator.revalidate();
      }
    } finally {
      setGenerating(false);
    }
  }

  async function buyCredits(pack: number) {
    setError(null);
    const res = await fetch("/api/payments/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credits: pack }),
    });
    const order = await res.json();
    if (!res.ok) {
      setError(order.error ?? "Could not start payment");
      return;
    }

    async function verify(extra: Record<string, string> = {}) {
      const v = await fetch("/api/payments/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: order.paymentId,
          credits: pack,
          ...extra,
        }),
      });
      const result = await v.json();
      if (v.ok) setCredits(result.credits);
      else setError(result.error ?? "Payment verification failed");
    }

    if (order.mock) {
      await verify();
      return;
    }

    if (!window.Razorpay) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Could not load Razorpay"));
        document.head.appendChild(s);
      });
    }
    new window.Razorpay!({
      key: order.keyId,
      order_id: order.orderId,
      amount: Math.round(order.amountInr * 100),
      currency: "INR",
      name: "Baranwal Associates",
      description: `${pack} visualizer credits`,
      handler: (response: Record<string, string>) => void verify(response),
      theme: { color: "#B45309" },
    }).open();
  }

  const canGenerate =
    !generating && !uploadingPhoto && (trialRemaining > 0 || credits > 0);

  return (
    <main className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
      {/* Sidebar: sessions + credits */}
      <aside className="lg:col-span-3">
        <p className="annotation">Interior visualizer</p>
        <div className="mt-4 rounded-sm border border-line p-5">
          <p className="annotation">Balance</p>
          <p className="mt-1 font-display text-4xl font-light text-accent">
            {credits}
            <span className="ml-2 text-base text-muted">credits</span>
          </p>
          {trialRemaining > 0 && (
            <p className="annotation mt-2 !text-accent">
              {trialRemaining} free trial generation
              {trialRemaining === 1 ? "" : "s"} left
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {[5, 10, 25].map((pack) => (
              <button
                key={pack}
                type="button"
                onClick={() => buyCredits(pack)}
                className="rounded-full border border-line px-3 py-1.5 text-xs transition-colors hover:border-accent hover:text-accent"
              >
                +{pack} · ₹{pack * inrPerCredit}
              </button>
            ))}
          </div>
        </div>

        <p className="annotation mt-8">Sessions</p>
        <ul className="mt-3 space-y-1">
          <li>
            <Link
              to="/portal/visualizer"
              className={`block rounded-sm px-3 py-2 text-sm transition-colors ${!threadId ? "bg-surface text-accent" : "text-muted hover:text-ink"}`}
            >
              + New session
            </Link>
          </li>
          {threads.map((t) => (
            <li key={t.id}>
              <Link
                to={`/portal/visualizer?thread=${t.id}`}
                className={`block truncate rounded-sm px-3 py-2 text-sm transition-colors ${threadId === t.id ? "bg-surface text-accent" : "text-muted hover:text-ink"}`}
              >
                {new Date(t.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                — {t.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat + composer */}
      <section className="flex min-h-[70vh] flex-col lg:col-span-9">
        <div className="flex-1 space-y-5 overflow-y-auto pb-6">
          {messages.length === 0 && (
            <div className="rounded-sm border border-dashed border-line p-8 text-center">
              <h1 className="font-display text-3xl font-light">
                Reimagine your room with{" "}
                <span className="italic text-accent">AI</span>
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted">
                Upload a photo of your space, choose a style, and generate.
                Refine with follow-ups — "warmer light", "add plants near the
                window". Your first {initialTrial > 0 ? initialTrial : "few"}{" "}
                generations are free.
              </p>
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.is_ai ? "items-start" : "items-end"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.is_ai
                    ? "rounded-bl-sm border border-accent/30 bg-surface"
                    : "rounded-br-sm bg-accent text-paper"
                }`}
              >
                {m.body}
                {m.message_attachments.map((a) => (
                  <AttachmentImage key={a.id} storageKey={a.storage_key} />
                ))}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Presets */}
        <div className="border-t border-line pt-4">
          <PresetRow
            dimension={PRESET_DIMENSIONS[0]}
            value={presets.style}
            onSelect={(v) => setPresets((p) => ({ ...p, style: v }))}
            large
          />
          <button
            type="button"
            onClick={() => setShowFineTune((v) => !v)}
            className="annotation mt-3 !text-accent"
          >
            {showFineTune ? "− Hide fine-tuning" : "+ Fine-tune lighting, floors, walls…"}
          </button>
          {showFineTune && (
            <div className="mt-2 space-y-3">
              {PRESET_DIMENSIONS.slice(1).map((dim) => (
                <PresetRow
                  key={dim.key}
                  dimension={dim}
                  value={presets[dim.key]}
                  onSelect={(v) =>
                    setPresets((p) =>
                      p[dim.key] === v
                        ? { ...p, [dim.key]: "" }
                        : { ...p, [dim.key]: v },
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="mt-4 space-y-3">
          {photo && (
            <div className="flex items-center gap-3">
              <img
                src={photo.localUrl}
                alt="Room to redesign"
                className="h-14 w-20 rounded-sm object-cover"
              />
              <button
                type="button"
                onClick={() => setPhoto(null)}
                className="text-sm text-muted hover:text-ink"
              >
                Remove photo ✕
              </button>
            </div>
          )}
          <div className="flex items-end gap-3">
            <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line text-lg text-muted transition-colors hover:border-accent hover:text-accent">
              {uploadingPhoto ? "…" : "📷"}
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && pickPhoto(e.target.files[0])
                }
              />
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              placeholder="Describe what you want — or just pick a style and generate…"
              className="field-input flex-1 resize-none rounded-sm border border-line px-3 py-2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && canGenerate) {
                  e.preventDefault();
                  void generate();
                }
              }}
            />
            <button
              type="button"
              disabled={!canGenerate}
              onClick={() => void generate()}
              className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent disabled:opacity-50"
            >
              {generating
                ? "Generating…"
                : trialRemaining > 0
                  ? "Generate (free)"
                  : "Generate (1 credit)"}
            </button>
          </div>
          {trialRemaining === 0 && credits === 0 && (
            <p className="text-sm text-muted">
              Your free trial is used up — buy credits to keep generating.
            </p>
          )}
          {error && <p className="text-sm text-accent">{error}</p>}
        </div>
      </section>
    </main>
  );
}

function PresetRow({
  dimension,
  value,
  onSelect,
  large,
}: {
  dimension: (typeof PRESET_DIMENSIONS)[number];
  value: string | undefined;
  onSelect: (v: string) => void;
  large?: boolean;
}) {
  return (
    <div>
      <p className="annotation mb-2">{dimension.label}</p>
      <div className="flex gap-2 overflow-x-auto pb-1" role="radiogroup">
        {dimension.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            onClick={() => onSelect(opt.value)}
            className={`shrink-0 rounded-lg border text-left transition-colors ${
              value === opt.value
                ? "border-accent ring-1 ring-accent"
                : "border-line hover:border-accent/50"
            } ${large ? "w-24" : "px-3 py-1.5 text-xs"}`}
          >
            {large && opt.thumb && (
              <img
                src={opt.thumb}
                alt=""
                className="h-16 w-full rounded-t-lg object-cover"
                loading="lazy"
              />
            )}
            {large ? (
              <span className="block px-1.5 py-1 text-[11px] leading-tight">
                {opt.label}
              </span>
            ) : (
              opt.label
            )}
          </button>
        ))}
      </div>
    </div>
  );
}


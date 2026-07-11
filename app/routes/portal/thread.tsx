import { useEffect, useRef, useState } from "react";
import { data, Link, useFetcher, useRevalidator, useRouteLoaderData } from "react-router";

import type { Route } from "./+types/thread";
import { AttachmentImage, AttachmentLink } from "~/components/attachment";
import { requireUser } from "~/lib/auth.server";
import { presignAndUpload } from "~/lib/files.client";
import { getSupabaseBrowserClient } from "~/lib/supabase.client";
import type { loader as rootLoader } from "~/root";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: `${loaderData?.thread.title ?? "Conversation"} — Baranwal Associates` },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { profile, supabase, headers } = await requireUser(request);

  const { data: thread } = await supabase
    .from("threads")
    .select("id, kind, title, project_id, projects(name)")
    .eq("id", params.id)
    .maybeSingle();
  if (!thread) throw new Response("Not Found", { status: 404 });

  const { data: messages } = await supabase
    .from("messages")
    .select(
      "id, body, is_ai, created_at, sender_id, profiles(full_name), message_attachments(id, filename, storage_key, mime_type)",
    )
    .eq("thread_id", params.id)
    .order("created_at");

  return data({ profile, thread, messages: messages ?? [] }, { headers });
}

export async function action({ request, params }: Route.ActionArgs) {
  const { profile, supabase, headers } = await requireUser(request);
  const form = await request.formData();
  const body = form.get("body")?.toString().trim();
  const attachmentKey = form.get("attachmentKey")?.toString();
  const attachmentName = form.get("attachmentName")?.toString();
  const attachmentMime = form.get("attachmentMime")?.toString();

  if (!body && !attachmentKey) {
    return data({ error: "Empty message" }, { status: 400, headers });
  }

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      thread_id: params.id,
      sender_id: profile.id,
      body: body ?? "",
    })
    .select("id")
    .single();
  if (error) return data({ error: error.message }, { status: 500, headers });

  if (attachmentKey && attachmentName) {
    const { error: attachError } = await supabase
      .from("message_attachments")
      .insert({
        message_id: message.id,
        storage_key: attachmentKey,
        filename: attachmentName,
        mime_type: attachmentMime ?? "application/octet-stream",
      });
    if (attachError) {
      return data({ error: attachError.message }, { status: 500, headers });
    }
  }
  return data({ ok: true }, { headers });
}

export default function Thread({ loaderData }: Route.ComponentProps) {
  const { profile, thread, messages } = loaderData;
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const bottomRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Live updates: any new message in this thread revalidates the loader.
  useEffect(() => {
    if (!rootData?.env) return;
    const supabase = getSupabaseBrowserClient(rootData.env);
    const channel = supabase
      .channel(`thread-${thread.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${thread.id}`,
        },
        () => revalidator.revalidate(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [thread.id, rootData?.env, revalidator]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && "ok" in (fetcher.data as object)) {
      formRef.current?.reset();
    }
  }, [fetcher.state, fetcher.data]);

  const project = thread.projects as { name?: string } | null;
  const [pending, setPending] = useState<{
    key: string;
    name: string;
    mime: string;
  } | null>(null);
  const [attaching, setAttaching] = useState(false);

  async function attach(file: File) {
    if (!thread.project_id) return;
    setAttaching(true);
    try {
      const key = await presignAndUpload(
        thread.project_id,
        file,
        file.name,
        "attachment",
      );
      setPending({
        key,
        name: file.name,
        mime: file.type || "application/octet-stream",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setAttaching(false);
    }
  }

  return (
    <main className="mx-auto flex h-[calc(100vh-8.5rem)] max-w-3xl flex-col">
      <div className="border-b border-line pb-4">
        {thread.project_id && (
          <Link
            to={`/portal/projects/${thread.project_id}`}
            className="annotation hover:text-accent"
          >
            ← {project?.name ?? "Project"}
          </Link>
        )}
        <h1 className="mt-2 font-display text-2xl font-light">
          {thread.title || "Conversation"}
        </h1>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto py-6">
        {messages.map((m) => {
          const mine = m.sender_id === profile.id;
          const sender = m.is_ai
            ? "AI Assistant"
            : ((m.profiles as { full_name?: string })?.full_name ?? "Unknown");
          return (
            <div
              key={m.id}
              className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
            >
              <p className="annotation mb-1">
                {mine ? "You" : sender} —{" "}
                {new Date(m.created_at).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  mine
                    ? "rounded-br-sm bg-accent text-paper"
                    : m.is_ai
                      ? "rounded-bl-sm border border-accent/30 bg-surface"
                      : "rounded-bl-sm bg-surface"
                }`}
              >
                {m.body}
                {(m.message_attachments ?? []).map(
                  (a: {
                    id: string;
                    filename: string;
                    storage_key: string;
                    mime_type: string;
                  }) =>
                    a.mime_type.startsWith("image/") ? (
                      <AttachmentImage key={a.id} storageKey={a.storage_key} />
                    ) : (
                      <AttachmentLink
                        key={a.id}
                        storageKey={a.storage_key}
                        filename={a.filename}
                      />
                    ),
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <fetcher.Form
        ref={formRef}
        method="post"
        onSubmit={() => setPending(null)}
        className="flex items-end gap-3 border-t border-line pt-4"
      >
        {pending && (
          <>
            <input type="hidden" name="attachmentKey" value={pending.key} />
            <input type="hidden" name="attachmentName" value={pending.name} />
            <input type="hidden" name="attachmentMime" value={pending.mime} />
          </>
        )}
        {thread.project_id && (
          <label
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
            title="Attach a file"
          >
            {attaching ? "…" : "📎"}
            <input
              type="file"
              className="hidden"
              accept="image/*,.pdf,.dwg,.dxf,.skp,.obj,.fbx,.dae,.glb,.gltf"
              onChange={(e) =>
                e.target.files?.[0] && void attach(e.target.files[0])
              }
            />
          </label>
        )}
        <textarea
          name="body"
          required={!pending}
          rows={2}
          placeholder={
            pending ? `📎 ${pending.name} — add a note…` : "Write a message…"
          }
          className="field-input flex-1 resize-none rounded-sm border border-line px-3 py-2"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <button
          type="submit"
          disabled={fetcher.state !== "idle"}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent disabled:opacity-60"
        >
          Send
        </button>
      </fetcher.Form>
    </main>
  );
}

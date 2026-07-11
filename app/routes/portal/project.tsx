import { useState } from "react";
import { data, Form, Link, useFetcher } from "react-router";
import { z } from "zod";

import type { Route } from "./+types/project";
import { ModelViewer } from "~/components/model-viewer";
import { UploadVersion } from "~/components/upload-version";
import { isStaff, requireUser } from "~/lib/auth.server";
import { getDownloadUrl } from "~/lib/files.client";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    {
      title: `${loaderData?.project.name ?? "Project"} — Baranwal Associates`,
    },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { profile, supabase, headers } = await requireUser(request);

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();
  if (!project) throw new Response("Not Found", { status: 404 });

  const [
    { data: milestones },
    { data: members },
    { data: drawings },
    { data: threads },
  ] = await Promise.all([
    supabase
      .from("milestones")
      .select("*")
      .eq("project_id", project.id)
      .order("position"),
    supabase
      .from("project_members")
      .select(
        "member_role, user_id, profiles!project_members_user_id_fkey(full_name, role)",
      )
      .eq("project_id", project.id),
    supabase
      .from("drawings")
      .select(
        "id, title, kind, drawing_versions(id, version_no, original_filename, original_key, preview_kind, preview_key, notes, approval, created_at)",
      )
      .eq("project_id", project.id),
    supabase
      .from("threads")
      .select("id, kind, title, created_at")
      .eq("project_id", project.id)
      .order("created_at"),
  ]);

  return data(
    {
      profile,
      staff: isStaff(profile),
      project,
      milestones: milestones ?? [],
      members: members ?? [],
      drawings: drawings ?? [],
      threads: threads ?? [],
    },
    { headers },
  );
}

const actionSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("progress"),
    progress: z.coerce.number().min(0).max(100),
  }),
  z.object({ intent: z.literal("toggle-milestone"), milestoneId: z.string() }),
  z.object({
    intent: z.literal("add-milestone"),
    title: z.string().trim().min(2),
    due_on: z.string().optional(),
  }),
  z.object({
    intent: z.literal("new-thread"),
    title: z.string().trim().min(2),
  }),
  z.object({
    intent: z.literal("add-drawing"),
    title: z.string().trim().min(2),
    kind: z.enum(["dwg_2d", "sketchup_3d", "max_3d", "image", "document"]),
  }),
  z.object({
    intent: z.literal("set-approval"),
    versionId: z.guid(),
    approval: z.enum(["pending", "approved", "changes_requested"]),
  }),
  z.object({
    intent: z.literal("add-version"),
    drawingId: z.guid(),
    originalKey: z.string().min(1),
    originalFilename: z.string().min(1),
    sizeBytes: z.coerce.number().nonnegative(),
    previewKind: z.enum(["gltf", "pdf", "image", "none"]),
    previewKey: z.string(),
    notes: z.string(),
  }),
]);

export async function action({ request, params }: Route.ActionArgs) {
  const { profile, supabase, headers } = await requireUser(request);
  const form = Object.fromEntries(await request.formData());
  const parsed = actionSchema.safeParse(form);
  if (!parsed.success) {
    return data({ error: "Invalid input" }, { status: 400, headers });
  }
  const input = parsed.data;
  const staff = isStaff(profile);

  // Threads, drawings and versions are open to project members too — RLS
  // enforces membership. The rest is staff-only.
  const memberAllowed = ["new-thread", "add-drawing", "add-version"];
  if (!memberAllowed.includes(input.intent) && !staff) {
    return data({ error: "Not allowed" }, { status: 403, headers });
  }

  switch (input.intent) {
    case "progress": {
      const { error } = await supabase
        .from("projects")
        .update({ progress: input.progress })
        .eq("id", params.id);
      if (error) return data({ error: error.message }, { status: 500, headers });
      break;
    }
    case "toggle-milestone": {
      const { data: m } = await supabase
        .from("milestones")
        .select("completed_at")
        .eq("id", input.milestoneId)
        .single();
      const { error } = await supabase
        .from("milestones")
        .update({ completed_at: m?.completed_at ? null : new Date().toISOString() })
        .eq("id", input.milestoneId);
      if (error) return data({ error: error.message }, { status: 500, headers });
      break;
    }
    case "add-milestone": {
      const { error } = await supabase.from("milestones").insert({
        project_id: params.id,
        title: input.title,
        due_on: input.due_on || null,
        position: 999,
      });
      if (error) return data({ error: error.message }, { status: 500, headers });
      break;
    }
    case "set-approval": {
      const { error } = await supabase
        .from("drawing_versions")
        .update({ approval: input.approval })
        .eq("id", input.versionId);
      if (error) return data({ error: error.message }, { status: 500, headers });
      break;
    }
    case "add-drawing": {
      const { error } = await supabase.from("drawings").insert({
        project_id: params.id,
        title: input.title,
        kind: input.kind,
        created_by: profile.id,
      });
      if (error) return data({ error: error.message }, { status: 500, headers });
      break;
    }
    case "add-version": {
      const { data: latest } = await supabase
        .from("drawing_versions")
        .select("version_no")
        .eq("drawing_id", input.drawingId)
        .order("version_no", { ascending: false })
        .limit(1)
        .maybeSingle();
      const { error } = await supabase.from("drawing_versions").insert({
        drawing_id: input.drawingId,
        version_no: (latest?.version_no ?? 0) + 1,
        original_key: input.originalKey,
        original_filename: input.originalFilename,
        original_size_bytes: input.sizeBytes,
        preview_kind: input.previewKind,
        preview_key: input.previewKey || null,
        notes: input.notes,
        uploaded_by: profile.id,
      });
      if (error) return data({ error: error.message }, { status: 500, headers });
      break;
    }
    case "new-thread": {
      const { data: thread, error } = await supabase
        .from("threads")
        .insert({
          kind: "project_chat",
          project_id: params.id,
          title: input.title,
          created_by: profile.id,
        })
        .select("id")
        .single();
      if (error) return data({ error: error.message }, { status: 500, headers });
      return data({ ok: true, threadId: thread.id }, { headers });
    }
  }
  return data({ ok: true }, { headers });
}

interface VersionInfo {
  id: string;
  version_no: number;
  original_filename: string;
  original_key: string;
  preview_kind: string;
  preview_key: string | null;
  notes: string;
  approval: string;
  created_at: string;
}

/** One drawing version: notes, approval, preview (3D/PDF/image), download. */
function VersionRow({
  version: v,
  staff,
}: {
  version: VersionInfo;
  staff: boolean;
}) {
  const fetcher = useFetcher();
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function openPreview() {
    if (!v.preview_key) return;
    setBusy(true);
    // Open the tab synchronously (inside the click) — async window.open is
    // popup-blocked.
    const tab = v.preview_kind === "gltf" ? null : window.open("", "_blank");
    try {
      const url = await getDownloadUrl(v.preview_key);
      if (v.preview_kind === "gltf") setViewerUrl(url);
      else if (tab) tab.location.href = url;
    } catch {
      tab?.close();
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    setBusy(true);
    try {
      const url = await getDownloadUrl(v.original_key, v.original_filename);
      // Anchor click, not window.open: survives popup blockers, and the
      // presigned URL's content-disposition makes it a download.
      const a = document.createElement("a");
      a.href = url;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="py-2.5 text-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="annotation w-8 shrink-0">v{v.version_no}</span>
        <span className="min-w-0 flex-1 truncate text-muted">
          {v.notes || v.original_filename}
        </span>
        {staff ? (
          <fetcher.Form method="post" className="shrink-0">
            <input type="hidden" name="intent" value="set-approval" />
            <input type="hidden" name="versionId" value={v.id} />
            <select
              name="approval"
              defaultValue={v.approval}
              onChange={(e) => fetcher.submit(e.currentTarget.form)}
              className="annotation cursor-pointer border-b border-line bg-transparent py-0.5"
            >
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="changes_requested">changes requested</option>
            </select>
          </fetcher.Form>
        ) : (
          <span
            className={`annotation shrink-0 ${v.approval === "approved" ? "!text-accent" : ""}`}
          >
            {v.approval.replace("_", " ")}
          </span>
        )}
        <span className="flex shrink-0 gap-3">
          {v.preview_key && (
            <button
              type="button"
              disabled={busy}
              onClick={openPreview}
              className="annotation !text-accent underline-offset-4 hover:underline disabled:opacity-50"
            >
              {v.preview_kind === "gltf"
                ? "view 3D"
                : v.preview_kind === "pdf"
                  ? "view PDF"
                  : "view"}
            </button>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={download}
            className="annotation underline-offset-4 hover:text-accent hover:underline disabled:opacity-50"
          >
            download
          </button>
        </span>
      </div>

      {viewerUrl && (
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <p className="annotation">
              {v.original_filename} — v{v.version_no}
            </p>
            <button
              type="button"
              onClick={() => setViewerUrl(null)}
              className="text-sm text-muted hover:text-ink"
            >
              Close ✕
            </button>
          </div>
          <ModelViewer
            url={viewerUrl}
            className="mt-2 h-96 w-full rounded-sm border border-line"
          />
        </div>
      )}
    </li>
  );
}

const KIND_LABELS: Record<string, string> = {
  dwg_2d: "AutoCAD 2D",
  sketchup_3d: "SketchUp 3D",
  max_3d: "3ds Max",
  image: "Image",
  document: "Document",
};

export default function Project({ loaderData }: Route.ComponentProps) {
  const { staff, project, milestones, members, drawings, threads } =
    loaderData;
  const progressFetcher = useFetcher();

  return (
    <main>
      <Link to="/portal" className="annotation hover:text-accent">
        ← Dashboard
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-light">{project.name}</h1>
          <p className="annotation mt-2">
            {project.location} — {project.status} — {project.progress}%
          </p>
        </div>
        {staff && (
          <progressFetcher.Form
            method="post"
            className="flex items-center gap-3"
          >
            <input type="hidden" name="intent" value="progress" />
            <label htmlFor="progress" className="annotation">
              Progress
            </label>
            <input
              id="progress"
              type="number"
              name="progress"
              min={0}
              max={100}
              defaultValue={project.progress}
              className="field-input w-20 text-center"
            />
            <button
              type="submit"
              className="rounded-full border border-line px-4 py-1.5 text-sm hover:border-accent hover:text-accent"
            >
              Update
            </button>
          </progressFetcher.Form>
        )}
      </div>

      <div className="mt-2 h-1 overflow-hidden rounded bg-surface">
        <div
          className="h-full bg-accent transition-all duration-700"
          style={{ width: `${project.progress}%` }}
        />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        {/* Milestones */}
        <section className="lg:col-span-5">
          <h2 className="annotation">Milestones</h2>
          <ul className="mt-4 space-y-1">
            {milestones.map((m) => (
              <li key={m.id} className="flex items-start gap-3 py-2">
                {staff ? (
                  <Form method="post" className="mt-0.5">
                    <input
                      type="hidden"
                      name="intent"
                      value="toggle-milestone"
                    />
                    <input type="hidden" name="milestoneId" value={m.id} />
                    <button
                      type="submit"
                      aria-label={
                        m.completed_at ? "Mark incomplete" : "Mark complete"
                      }
                      className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition-colors ${
                        m.completed_at
                          ? "border-accent bg-accent text-paper"
                          : "border-line hover:border-accent"
                      }`}
                    >
                      {m.completed_at ? "✓" : ""}
                    </button>
                  </Form>
                ) : (
                  <span
                    className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                      m.completed_at
                        ? "border-accent bg-accent text-paper"
                        : "border-line"
                    }`}
                  >
                    {m.completed_at ? "✓" : ""}
                  </span>
                )}
                <div>
                  <p
                    className={`text-sm ${m.completed_at ? "text-muted line-through" : ""}`}
                  >
                    {m.title}
                  </p>
                  {m.due_on && <p className="annotation mt-0.5">{m.due_on}</p>}
                </div>
              </li>
            ))}
          </ul>
          {staff && (
            <Form method="post" className="mt-6 flex items-end gap-3">
              <input type="hidden" name="intent" value="add-milestone" />
              <div className="flex-1">
                <label htmlFor="title" className="annotation mb-1 block">
                  New milestone
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  className="field-input"
                  placeholder="e.g. Roof slab cast"
                />
              </div>
              <input type="date" name="due_on" className="field-input w-36" />
              <button
                type="submit"
                className="rounded-full border border-line px-4 py-1.5 text-sm hover:border-accent hover:text-accent"
              >
                Add
              </button>
            </Form>
          )}
        </section>

        {/* Drawings */}
        <section className="lg:col-span-7">
          <h2 className="annotation">Drawings & versions</h2>
          {drawings.length === 0 && (
            <p className="mt-4 rounded-sm border border-line p-6 text-sm text-muted">
              No drawings uploaded yet.
            </p>
          )}
          <div className="mt-4 space-y-6">
            {drawings.map((d) => (
              <div key={d.id} className="rounded-sm border border-line p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl font-light">{d.title}</h3>
                  <span className="annotation">
                    {KIND_LABELS[d.kind] ?? d.kind}
                  </span>
                </div>
                <ul className="mt-3 divide-y divide-line">
                  {[...(d.drawing_versions ?? [])]
                    .sort((a, b) => b.version_no - a.version_no)
                    .map((v) => (
                      <VersionRow key={v.id} version={v} staff={staff} />
                    ))}
                </ul>
                <div className="mt-3">
                  <UploadVersion projectId={project.id} drawingId={d.id} />
                </div>
              </div>
            ))}
          </div>

          <Form
            method="post"
            className="mt-6 flex flex-wrap items-end gap-3 rounded-sm border border-dashed border-line p-4"
          >
            <input type="hidden" name="intent" value="add-drawing" />
            <div className="min-w-40 flex-1">
              <label htmlFor="drawing-title" className="annotation mb-1 block">
                New drawing set
              </label>
              <input
                id="drawing-title"
                name="title"
                required
                className="field-input"
                placeholder="e.g. Electrical layout"
              />
            </div>
            <select name="kind" className="field-input w-40">
              <option value="dwg_2d">AutoCAD 2D</option>
              <option value="sketchup_3d">SketchUp 3D</option>
              <option value="max_3d">3ds Max</option>
              <option value="image">Image</option>
              <option value="document">Document</option>
            </select>
            <button
              type="submit"
              className="rounded-full border border-line px-4 py-1.5 text-sm hover:border-accent hover:text-accent"
            >
              Add
            </button>
          </Form>

          {/* Threads */}
          <h2 className="annotation mt-10">Conversations</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {threads.map((t) => (
              <li key={t.id}>
                <Link
                  to={`/portal/threads/${t.id}`}
                  className="group flex items-center justify-between py-3"
                >
                  <span className="text-sm transition-colors group-hover:text-accent">
                    {t.title || "Untitled thread"}
                  </span>
                  <span className="annotation">{t.kind.replace("_", " ")}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Form method="post" className="mt-5 flex items-end gap-3">
            <input type="hidden" name="intent" value="new-thread" />
            <div className="flex-1">
              <label htmlFor="thread-title" className="annotation mb-1 block">
                Start a conversation
              </label>
              <input
                id="thread-title"
                name="title"
                required
                className="field-input"
                placeholder="Topic — e.g. Kitchen finishes"
              />
            </div>
            <button
              type="submit"
              className="rounded-full border border-line px-4 py-1.5 text-sm hover:border-accent hover:text-accent"
            >
              Start
            </button>
          </Form>

          {/* Team */}
          <h2 className="annotation mt-10">Team</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {members.map((m) => (
              <li
                key={m.user_id}
                className="rounded-full border border-line px-3.5 py-1.5 text-sm"
              >
                {(m.profiles as { full_name?: string })?.full_name}
                <span className="annotation ml-2">{m.member_role}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

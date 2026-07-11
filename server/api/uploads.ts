import express from "express";
import { z } from "zod";

import { requireApiUser } from "./auth";
import { presignDownload, presignUpload } from "./storage";

export const uploadsRouter = express.Router();

uploadsRouter.use(requireApiUser);

const EXTENSIONS: Record<string, string> = {
  dwg: "application/acad",
  dxf: "image/vnd.dxf",
  skp: "application/octet-stream",
  max: "application/octet-stream",
  obj: "text/plain",
  fbx: "application/octet-stream",
  dae: "model/vnd.collada+xml",
  gltf: "model/gltf+json",
  glb: "model/gltf-binary",
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

const presignSchema = z
  .object({
    projectId: z.guid().optional(),
    filename: z
      .string()
      .min(1)
      .max(200)
      .regex(/^[^/\\]+$/, "Plain filename only"),
    contentType: z.string().min(1).max(120),
    sizeBytes: z.coerce.number().positive(),
    purpose: z.enum(["original", "preview", "attachment", "ai-input"]),
  })
  .refine((v) => v.purpose === "ai-input" || v.projectId, {
    message: "projectId is required",
  });

/**
 * True when the user is staff, the project's client, or a project member.
 * Deliberately stricter than RLS visibility: is_public exposes portfolio
 * rows to everyone, which must NOT grant file access.
 */
async function canAccessProject(req: express.Request, projectId: string) {
  const uid = req.user!.id;
  const supabase = req.supabase!;
  const [{ data: profile }, { data: member }, { data: project }] =
    await Promise.all([
      supabase.from("profiles").select("role").eq("id", uid).maybeSingle(),
      supabase
        .from("project_members")
        .select("project_id")
        .eq("project_id", projectId)
        .eq("user_id", uid)
        .maybeSingle(),
      supabase
        .from("projects")
        .select("client_id")
        .eq("id", projectId)
        .maybeSingle(),
    ]);

  if (["system_admin", "employee", "accountant"].includes(profile?.role ?? ""))
    return true;
  if (member) return true;
  return project?.client_id === uid;
}

async function maxUploadMb(req: express.Request): Promise<number> {
  const { data } = await req.supabase!
    .from("system_settings")
    .select("value")
    .eq("key", "upload.max_file_mb")
    .maybeSingle();
  return typeof data?.value === "number" ? data.value : 200;
}

uploadsRouter.post("/presign", async (req, res) => {
  const parsed = presignSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message });
    return;
  }
  const { projectId, filename, contentType, sizeBytes, purpose } = parsed.data;

  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (!(ext in EXTENSIONS)) {
    res.status(400).json({ error: `File type .${ext} is not supported` });
    return;
  }
  const limitMb = await maxUploadMb(req);
  if (sizeBytes > limitMb * 1024 * 1024) {
    res.status(400).json({ error: `Files are limited to ${limitMb} MB` });
    return;
  }
  const stamp = Date.now().toString(36);
  const safe = filename.replace(/[^\w.\-]+/g, "_");
  let key: string;

  if (purpose === "ai-input") {
    // AI visualizer inputs are user-scoped, not project-scoped.
    if (!contentType.startsWith("image/") && contentType !== "application/pdf") {
      res.status(400).json({ error: "Upload an image or PDF" });
      return;
    }
    key = `ai/${req.user!.id}/input/${stamp}-${safe}`;
  } else {
    if (!(await canAccessProject(req, projectId!))) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    key = `uploads/${projectId}/${purpose}/${stamp}-${safe}`;
  }

  const url = await presignUpload(key, contentType);
  res.json({ key, url });
});

const downloadSchema = z.object({
  key: z
    .string()
    .regex(/^(uploads|ai)\/[0-9a-f-]{36}\//i, "Invalid key"),
  filename: z.string().max(200).optional(),
});

uploadsRouter.get("/download", async (req, res) => {
  const parsed = downloadSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message });
    return;
  }
  const [scope, ownerId] = parsed.data.key.split("/") as [string, string];

  if (scope === "ai") {
    // AI artifacts: the owner, or staff.
    if (ownerId !== req.user!.id) {
      const { data: profile } = await req.supabase!
        .from("profiles")
        .select("role")
        .eq("id", req.user!.id)
        .maybeSingle();
      if (
        !["system_admin", "employee", "accountant"].includes(
          profile?.role ?? "",
        )
      ) {
        res.status(404).json({ error: "Not found" });
        return;
      }
    }
  } else if (!(await canAccessProject(req, ownerId))) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const url = await presignDownload(parsed.data.key, parsed.data.filename);
  res.json({ url });
});

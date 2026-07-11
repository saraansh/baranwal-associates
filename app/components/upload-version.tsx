import { useRef, useState } from "react";
import { useFetcher } from "react-router";

import {
  CONVERTIBLE_3D,
  convertToGlb,
  fileExt,
  presignAndUpload,
} from "~/lib/files.client";
import { ModelViewer } from "./model-viewer";

type Phase =
  | { step: "idle" }
  | { step: "converting" }
  | { step: "ready"; previewUrl: string | null; glb: Blob | null }
  | { step: "uploading" }
  | { step: "error"; message: string };

/**
 * Version uploader: picks a file, converts 3D exports to GLB in the browser
 * (with a live preview BEFORE anything uploads), pairs 2D drawings with an
 * optional PDF plot, then presign-uploads and records the version.
 */
export function UploadVersion({
  projectId,
  drawingId,
}: {
  projectId: string;
  drawingId: string;
}) {
  const fetcher = useFetcher();
  const fileRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>({ step: "idle" });
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");

  async function onPick(picked: File) {
    setFile(picked);
    const ext = fileExt(picked.name);
    if ((CONVERTIBLE_3D as readonly string[]).includes(ext)) {
      setPhase({ step: "converting" });
      try {
        const glb = await convertToGlb(picked);
        setPhase({
          step: "ready",
          glb,
          previewUrl: URL.createObjectURL(glb),
        });
      } catch (e) {
        setPhase({
          step: "error",
          message: `3D conversion failed: ${e instanceof Error ? e.message : e}`,
        });
      }
    } else {
      setPhase({ step: "ready", glb: null, previewUrl: null });
    }
  }

  async function submit() {
    if (!file || phase.step !== "ready") return;
    const { glb } = phase;
    setPhase({ step: "uploading" });
    try {
      const originalKey = await presignAndUpload(
        projectId,
        file,
        file.name,
        "original",
      );

      let previewKind = "none";
      let previewKey: string | null = null;

      if (glb) {
        previewKind = "gltf";
        previewKey = await presignAndUpload(
          projectId,
          glb,
          file.name.replace(/\.[^.]+$/, "") + ".glb",
          "preview",
        );
      } else if (fileExt(file.name) === "pdf") {
        previewKind = "pdf";
        previewKey = originalKey;
      } else if (["png", "jpg", "jpeg", "webp"].includes(fileExt(file.name))) {
        previewKind = "image";
        previewKey = originalKey;
      } else {
        const pdf = pdfRef.current?.files?.[0];
        if (pdf) {
          previewKind = "pdf";
          previewKey = await presignAndUpload(
            projectId,
            pdf,
            pdf.name,
            "preview",
          );
        }
      }

      fetcher.submit(
        {
          intent: "add-version",
          drawingId,
          originalKey,
          originalFilename: file.name,
          sizeBytes: String(file.size),
          previewKind,
          previewKey: previewKey ?? "",
          notes,
        },
        { method: "post" },
      );
      setOpen(false);
      setPhase({ step: "idle" });
      setFile(null);
      setNotes("");
    } catch (e) {
      setPhase({
        step: "error",
        message: e instanceof Error ? e.message : "Upload failed",
      });
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="annotation !text-accent underline-offset-4 hover:underline"
      >
        + Upload new version
      </button>
    );
  }

  const needsPdfCompanion =
    file &&
    ["dwg", "dxf", "skp", "max"].includes(fileExt(file.name)) &&
    phase.step === "ready" &&
    !phase.glb;

  return (
    <div className="mt-3 space-y-4 rounded-sm border border-dashed border-line p-4">
      <div className="flex items-center justify-between">
        <p className="annotation">New version</p>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setPhase({ step: "idle" });
            setFile(null);
          }}
          className="text-sm text-muted hover:text-ink"
        >
          Cancel
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".dwg,.dxf,.skp,.max,.obj,.fbx,.dae,.stl,.gltf,.glb,.pdf,.png,.jpg,.jpeg,.webp"
        onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])}
        className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border file:border-line file:bg-transparent file:px-4 file:py-1.5 file:text-sm file:text-ink"
      />

      {phase.step === "converting" && (
        <p className="text-sm text-muted">Converting to glTF in your browser…</p>
      )}
      {phase.step === "error" && (
        <p className="text-sm text-accent">{phase.message}</p>
      )}

      {phase.step === "ready" && phase.previewUrl && (
        <div>
          <p className="annotation mb-2">
            Preview — this is exactly what clients will see
          </p>
          <ModelViewer
            url={phase.previewUrl}
            className="h-72 w-full rounded-sm border border-line"
          />
        </div>
      )}

      {needsPdfCompanion && (
        <div>
          <label className="annotation mb-1 block" htmlFor={`pdf-${drawingId}`}>
            PDF plot (optional, recommended for 2D drawings)
          </label>
          <input
            id={`pdf-${drawingId}`}
            ref={pdfRef}
            type="file"
            accept=".pdf"
            className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border file:border-line file:bg-transparent file:px-4 file:py-1.5 file:text-sm file:text-ink"
          />
        </div>
      )}

      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Version notes — what changed?"
        className="field-input"
      />

      <button
        type="button"
        disabled={!file || phase.step !== "ready"}
        onClick={submit}
        className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-accent disabled:opacity-50"
      >
        {phase.step === "uploading" ? "Uploading…" : "Upload version"}
      </button>
    </div>
  );
}

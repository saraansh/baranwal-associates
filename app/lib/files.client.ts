/** Browser-side upload helpers: presign, PUT, and 3D→glTF conversion. */

export const CONVERTIBLE_3D = ["obj", "fbx", "dae", "stl"] as const;

export function fileExt(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

export async function presignAndUpload(
  projectId: string | null,
  file: File | Blob,
  filename: string,
  purpose: "original" | "preview" | "attachment" | "ai-input",
): Promise<string> {
  const contentType =
    file instanceof File && file.type ? file.type : "application/octet-stream";
  const res = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...(projectId ? { projectId } : {}),
      filename,
      contentType,
      sizeBytes: file.size,
      purpose,
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Presign failed (${res.status})`);
  }
  const { key, url } = (await res.json()) as { key: string; url: string };

  const put = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });
  if (!put.ok) throw new Error(`Upload failed (${put.status})`);
  return key;
}

export async function getDownloadUrl(key: string, filename?: string) {
  const params = new URLSearchParams({ key });
  if (filename) params.set("filename", filename);
  const res = await fetch(`/api/uploads/download?${params}`);
  if (!res.ok) throw new Error("Could not fetch download link");
  const { url } = (await res.json()) as { url: string };
  return url;
}

/**
 * Converts OBJ/FBX/Collada/STL exports (from SketchUp / 3ds Max) to a GLB
 * blob entirely in the browser, so the server only ever stores glTF
 * previews next to the untouched originals.
 */
export async function convertToGlb(file: File): Promise<Blob> {
  const ext = fileExt(file.name);
  const [{ GLTFExporter }, THREE] = await Promise.all([
    import("three/addons/exporters/GLTFExporter.js"),
    import("three"),
  ]);

  let object3d: unknown;
  if (ext === "obj") {
    const { OBJLoader } = await import("three/addons/loaders/OBJLoader.js");
    object3d = new OBJLoader().parse(await file.text());
  } else if (ext === "fbx") {
    const { FBXLoader } = await import("three/addons/loaders/FBXLoader.js");
    object3d = new FBXLoader().parse(await file.arrayBuffer(), "");
  } else if (ext === "dae") {
    const { ColladaLoader } = await import(
      "three/addons/loaders/ColladaLoader.js"
    );
    const collada = new ColladaLoader().parse(await file.text(), "");
    if (!collada?.scene) throw new Error("Could not parse Collada file");
    object3d = collada.scene;
  } else if (ext === "stl") {
    const { STLLoader } = await import("three/addons/loaders/STLLoader.js");
    const geometry = new STLLoader().parse(await file.arrayBuffer());
    object3d = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ color: 0xd8d2c8 }),
    );
  } else {
    throw new Error(`Cannot convert .${ext} in the browser`);
  }

  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(object3d as never, {
    binary: true,
  });
  return new Blob([result as ArrayBuffer], { type: "model/gltf-binary" });
}

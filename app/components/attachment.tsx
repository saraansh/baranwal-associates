import { useEffect, useState } from "react";

import { getDownloadUrl } from "~/lib/files.client";

/** Lazily resolves a presigned URL and renders an inline image. */
export function AttachmentImage({ storageKey }: { storageKey: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    getDownloadUrl(storageKey)
      .then((u) => active && setUrl(u))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [storageKey]);
  if (!url) {
    return (
      <div className="mt-2 h-40 w-56 animate-pulse rounded-sm bg-line/50" />
    );
  }
  return (
    <img
      src={url}
      alt="Attachment"
      className="mt-2 max-h-80 rounded-sm"
      loading="lazy"
    />
  );
}

/** Non-image attachment: fetches a download link on click. */
export function AttachmentLink({
  storageKey,
  filename,
}: {
  storageKey: string;
  filename: string;
}) {
  const [busy, setBusy] = useState(false);
  async function open() {
    setBusy(true);
    try {
      const url = await getDownloadUrl(storageKey, filename);
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
    <button
      type="button"
      disabled={busy}
      onClick={open}
      className="mt-2 block text-xs underline underline-offset-4 disabled:opacity-50"
    >
      📎 {filename}
    </button>
  );
}

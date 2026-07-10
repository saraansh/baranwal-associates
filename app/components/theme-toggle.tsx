import { useFetcher } from "react-router";

import { THEMES, type Theme } from "~/lib/theme";

const ICONS: Record<Theme, string> = {
  light: "☀",
  dark: "☾",
  system: "◐",
};

export function ThemeToggle({ theme }: { theme: Theme }) {
  const fetcher = useFetcher();
  const current = (fetcher.formData?.get("theme") as Theme) ?? theme;
  const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];

  return (
    <fetcher.Form
      method="post"
      action="/resources/theme"
      onSubmit={() => {
        // Optimistic flip before the cookie round-trips.
        const dark =
          next === "dark" ||
          (next === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);
        document.documentElement.classList.toggle("dark", dark);
        document.documentElement.dataset.theme = next;
      }}
    >
      <button
        type="submit"
        name="theme"
        value={next}
        aria-label={`Theme: ${current}. Switch to ${next}.`}
        title={`Theme: ${current}`}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-sm text-muted transition-colors hover:border-accent hover:text-accent"
      >
        {ICONS[current]}
      </button>
    </fetcher.Form>
  );
}

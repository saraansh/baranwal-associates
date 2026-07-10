export const THEME_COOKIE = "ba-theme";
export const THEMES = ["light", "dark", "system"] as const;
export type Theme = (typeof THEMES)[number];

export function parseTheme(value: string | undefined | null): Theme {
  return THEMES.includes(value as Theme) ? (value as Theme) : "system";
}

export function themeFromRequest(request: Request): Theme {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(new RegExp(`${THEME_COOKIE}=([^;]+)`));
  return parseTheme(match?.[1]);
}

export function themeCookieHeader(theme: Theme): string {
  return `${THEME_COOKIE}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

/**
 * Runs before paint to apply the system preference when theme=system,
 * preventing a flash of the wrong theme. Inlined in root.tsx.
 */
export const THEME_BOOT_SCRIPT = `
(function () {
  var t = document.documentElement.dataset.theme;
  if (t === "system") {
    var dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  }
})();
`.trim();

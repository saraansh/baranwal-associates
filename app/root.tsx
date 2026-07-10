import { MotionConfig } from "motion/react";
import {
  isRouteErrorResponse,
  Links,
  Link,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { publicEnv } from "~/lib/env.server";
import { THEME_BOOT_SCRIPT, themeFromRequest } from "~/lib/theme";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Hanken+Grotesk:ital,wght@0,300..700;1,300..700&family=JetBrains+Mono:wght@400;500&display=swap",
  },
  { rel: "manifest", href: "/manifest.webmanifest" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
];

export async function loader({ request }: Route.LoaderArgs) {
  return {
    theme: themeFromRequest(request),
    env: publicEnv(),
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  const theme = data?.theme ?? "system";

  return (
    <html
      lang="en"
      data-theme={theme}
      className={theme === "dark" ? "dark" : undefined}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#161412" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="grain">
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Something went astray";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : `Error ${error.status}`;
    details =
      error.status === 404
        ? "This page doesn't exist on our drawing board."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="annotation mb-4">Baranwal Associates</p>
      <h1 className="font-display text-7xl font-light">{message}</h1>
      <p className="mt-4 max-w-md text-muted">{details}</p>
      <Link
        to="/"
        className="mt-8 rounded-full border border-ink px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
      >
        Back to home
      </Link>
      {stack && (
        <pre className="mt-8 w-full max-w-3xl overflow-x-auto p-4 text-left text-xs">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

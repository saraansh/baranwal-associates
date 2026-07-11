import { data, redirect } from "react-router";

import type { Route } from "./+types/theme";
import { parseTheme, themeCookieHeader } from "~/lib/theme";

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const theme = parseTheme(form.get("theme")?.toString());
  const headers = { "Set-Cookie": themeCookieHeader(theme) };

  // Progressive enhancement: a pre-hydration submit is a full document
  // POST — send the user back where they came from with the cookie set.
  if (request.headers.get("sec-fetch-dest") === "document") {
    return redirect(request.headers.get("referer") ?? "/", { headers });
  }
  return data({ theme }, { headers });
}

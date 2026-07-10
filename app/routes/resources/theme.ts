import { data } from "react-router";

import type { Route } from "./+types/theme";
import { parseTheme, themeCookieHeader } from "~/lib/theme";

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const theme = parseTheme(form.get("theme")?.toString());
  return data(
    { theme },
    { headers: { "Set-Cookie": themeCookieHeader(theme) } },
  );
}

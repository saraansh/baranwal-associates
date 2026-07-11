import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import type { NextFunction, Request, Response } from "express";
import type { SupabaseClient, User } from "@supabase/supabase-js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      supabase?: SupabaseClient;
      user?: User;
    }
  }
}

/** Express-side Supabase auth: binds a user-scoped client to the request. */
export async function requireApiUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const supabase = createServerClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return parseCookieHeader(req.headers.cookie ?? "").map(
            ({ name, value }) => ({ name, value: value ?? "" }),
          );
        },
        setAll(cookies) {
          for (const { name, value, options } of cookies) {
            res.appendHeader(
              "Set-Cookie",
              serializeCookieHeader(name, value, options),
            );
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.supabase = supabase;
  req.user = user;
  next();
}

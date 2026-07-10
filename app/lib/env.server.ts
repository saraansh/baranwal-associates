import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  SESSION_SECRET: z.string().min(16).default("dev-only-secret-change-me"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET: z.string().default("baranwal-associates"),
  R2_PUBLIC_BASE_URL: z.string().url().optional(),
  OPENAI_API_KEY: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_NOTIFY_EMAIL: z.string().email().optional(),
  WHATSAPP_PHONE: z.string().default("917007103393"),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

export function env(): Env {
  if (!cached) {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      throw new Error(
        `Invalid environment: ${parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; ")}`,
      );
    }
    cached = parsed.data;
  }
  return cached;
}

/** Values safe to expose to the browser via the root loader. */
export function publicEnv() {
  const e = env();
  return {
    SUPABASE_URL: e.SUPABASE_URL,
    SUPABASE_ANON_KEY: e.SUPABASE_ANON_KEY,
    WHATSAPP_PHONE: e.WHATSAPP_PHONE,
  };
}

export type PublicEnv = ReturnType<typeof publicEnv>;

# Deployment Guide

Total launch cost: **₹0/month** (plus the domain and OpenAI usage). Every
service below upgrades independently with no code changes.

## 1. Supabase (database, auth, realtime)

1. Create a project at [supabase.com](https://supabase.com) (free tier).
2. Link and push the schema + seed nothing (production starts clean):
   ```bash
   supabase link --project-ref <ref>
   supabase db push
   ```
3. **Auth → Providers → Google**: enable, using the OAuth client from step 2.
4. **Auth → URL Configuration**: site URL `https://baranwalassociates.com`,
   redirect URL `https://baranwalassociates.com/auth/callback`.
5. **Auth → MFA**: TOTP enroll/verify on.
6. Note for Render env: Project URL (`SUPABASE_URL`), anon key, service-role
   key, and the **connection pooler** URI (`DATABASE_URL`, transaction mode)
   for pg-boss.
7. Free-tier projects pause after ~1 week without traffic — the
   `supabase-keepalive` pg-boss job writes an event every 30 minutes to
   prevent that.
8. First admin: after signing in once with Google, run in the SQL editor:
   ```sql
   update profiles set role = 'system_admin' where id = (
     select id from auth.users where email = 'apbaranwal@gmail.com');
   ```

## 2. Google OAuth client

[console.cloud.google.com](https://console.cloud.google.com) → APIs &
Services → Credentials → Create OAuth client (Web):
- Authorized origins: `https://baranwalassociates.com`
- Redirect URI: `https://<supabase-ref>.supabase.co/auth/v1/callback`

Put the client ID/secret into Supabase's Google provider settings.

## 3. Cloudflare (DNS, CDN, R2)

1. Add the domain to Cloudflare (free plan) and point the registrar's
   nameservers at it.
2. **R2**: create bucket `baranwal-associates`; create an API token with
   object read/write. Note the endpoint
   `https://<account-id>.r2.cloudflarestorage.com` (`R2_ENDPOINT`), key id
   and secret. 10 GB storage and zero egress on the free tier.
3. DNS: CNAME `@` and `www` → the Render hostname (proxied/orange cloud).
   Cloudflare then caches static assets at the edge and hides Render
   cold-start latency for cached pages.

## 4. Render (app hosting)

1. New → Blueprint → point at this repo (`render.yaml` is picked up), branch
   `fable-dev`.
2. Fill the `sync: false` env vars from steps above.
3. Custom domain: add `baranwalassociates.com` (+ www) — Render issues TLS.
4. Free tier sleeps after idle (~50 s cold start). Upgrade to Starter
   ($7/mo) whenever that annoys you — zero migration.

## 5. Razorpay

1. Activate the account at [razorpay.com](https://razorpay.com); generate
   live key id/secret (`RAZORPAY_KEY_ID/SECRET`).
2. Webhook: `https://baranwalassociates.com/api/payments/razorpay/webhook`,
   event `payment.captured`, and set the webhook secret
   (`RAZORPAY_WEBHOOK_SECRET`).

## 6. OpenAI & Resend

- [platform.openai.com](https://platform.openai.com) → API key
  (`OPENAI_API_KEY`). Generations cost pay-as-you-go; the app never charges
  a client credit when the AI call fails.
- [resend.com](https://resend.com) → API key (`RESEND_API_KEY`), verify the
  sending domain, set `CONTACT_NOTIFY_EMAIL` to the inbox that should
  receive enquiry notifications. 3,000 emails/month free.

## 7. Post-launch checklist

- [ ] Google Search Console: submit `https://baranwalassociates.com/sitemap.xml`
- [ ] Verify JSON-LD with Google's Rich Results test (ProfessionalService, FAQ)
- [ ] Sign in as the admin → `/admin` → confirm health, jobs, settings
- [ ] Run a ₹1 Razorpay test payment end to end
- [ ] Upgrade path reminders: Render Starter $7/mo (no cold starts),
      Supabase Pro $25/mo (no pausing, 8 GB DB), R2 pennies per extra GB

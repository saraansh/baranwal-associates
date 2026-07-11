# Baranwal Associates

Full platform for the architecture firm — public portfolio + client portal +
AI interior visualizer. React Router v7 (framework mode, SSR) on a custom
Express server, Supabase (Postgres/Auth/Realtime), Cloudflare R2 storage,
OpenAI, Razorpay.

- **Design brief & research:** [docs/RESEARCH.md](docs/RESEARCH.md)
- **Deployment:** [docs/DEPLOY.md](docs/DEPLOY.md)

## What's inside

| Area | Highlights |
|---|---|
| Public site | SSR portfolio/journal/contact, light/dark/system themes, PWA, JSON-LD + sitemap SEO |
| Auth | Google OAuth (PKCE), optional TOTP 2FA, role-based access (system_admin / employee / accountant / collaborator / client) with Postgres RLS |
| Portal | Projects, milestones, progress, realtime chat with attachments, tokenized invites |
| Drawings | Presigned R2 uploads, versioning with approvals, **client-side OBJ/FBX/DAE/STL → glTF** with pre-upload 3D preview, PDF previews for 2D CAD |
| AI visualizer | ChatGPT-style room redesign with Indian-localized presets, 2 free trials, credit packs via Razorpay or accountant-recorded cash |
| Admin console | Health, metrics, telemetry events, request logs, pg-boss job monitor, runtime settings editor |

## Local development

Prereqs: Node 24+, Docker Desktop, [Supabase CLI](https://supabase.com/docs/guides/cli).

```bash
cp .env.example .env          # fill values printed by `supabase start`
supabase start                # local Postgres + Auth + Storage (Docker)
supabase db reset             # apply migrations + demo seed
npm install
npm run dev                   # http://localhost:3000
```

The demo seed creates users for every role, all with password `password123`
(dev-only password login is enabled outside production):

| Role | Email |
|---|---|
| System admin | saraansh.baranwal@example.com |
| Architect | priya.srivastava@example.com |
| Accountant | manoj.gupta@example.com |
| Collaborator | alok.verma@example.com |
| Clients | ramesh.agarwal / neha.khanna / sunil.jaiswal @example.com |

Without `OPENAI_API_KEY`/Razorpay keys, the visualizer and checkout run in
mock mode locally so every flow stays testable.

## Scripts

```bash
npm run dev        # dev server (Vite middleware + Express)
npm run build      # production build
npm start          # run the production build
npm run typecheck  # route typegen + tsc
npm test           # unit/API tests (Vitest)
npm run test:e2e   # Playwright suite (desktop + mobile)
```

## Branching

Active development happens on `fable-dev` via feature-branch PRs. The
legacy site lives on `main`.

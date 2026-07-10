# Research Synthesis — Baranwal Associates Platform

Five research reports live in [`docs/research/`](./research/). This document is the
synthesis: the facts we build on and the decisions locked from them.

## The firm (real-world facts for public site copy)

- **Baranwal Associates** — architecture, structural engineering & interior design
  practice in **Gorakhpur, Uttar Pradesh** (25 Hari Om Nagar, Civil Lines, 273009).
- Principal: **Er. Anand Prakash Baranwal**, practicing **since 1987** (site claim;
  directories say est. 1990-91 — we use "Since 1987" to match existing branding).
- Reputation: Justdial 5.0★ (12 ratings), ~4.9★/36 reviews on the Google Maps
  mirror; positioned as "Trusted across Eastern U.P.", 3000+ projects claimed.
- Contact: +91 7007103393 / +91 9415245083, apbaranwal@gmail.com; WhatsApp CTA
  already in use on the current site.
- Presence: Facebook ("Baranwal Associates Gorakhpur"), Houzz, IndiaMART, Justdial.
  Full details + caveats: [research/firm.md](./research/firm.md).

## The existing site (what we keep and fix)

`baranwalassociates.com` is live — a Lovable-built one-page React SPA
([research/existing-site.md](./research/existing-site.md)). We are replacing it
entirely, keeping its brand DNA:

**Keep:** copper/gold + charcoal identity, dark/light toggle, tagline
*"Designing Dreams, Building Legacy"*, the 7-service taxonomy (Architectural
Design, Structural Engineering, Interior Design, Landscape Design, Township
Planning, Retrofitting, Waterproofing), trust stats (Since 1987, 3000+ projects),
WhatsApp/call CTAs, FAQ section.

**Fix in the rebuild:** empty portfolio ("Loading projects… 0+"), single
placeholder testimonial, meta description says *Maharashtra* (SEO bug — firm is
in Gorakhpur, U.P.), no JSON-LD, everything client-rendered (invisible to
crawlers — our SSR fixes this), low-res WhatsApp-photo logo (rebuild as SVG),
real per-project case-study routes for "architect in Gorakhpur" queries.

## Imagery

30 verified, visually-inspected free images (Unsplash/Pexels — no attribution
required, commercial use allowed) mapped to placements in
[research/imagery.md](./research/imagery.md). Hotlink pattern:
`images.unsplash.com/photo-{ID}?auto=format&fit=crop&w={w}&q=80`
(hero w=2000, cards w=800, thumbs w=400). Long-term we self-host winners on R2.

## Seed data

[research/sample-content.md](./research/sample-content.md) defines an internally
consistent demo dataset (6 blog posts, 7 users across all 5 roles, 4 projects
with versioned DWG/SKP/glTF drawings, 3 conversation threads including an AI
visualizer session, and a Razorpay+cash ledger that reconciles with the credits
balances). It feeds `supabase/seed.sql`. Note: seed data is fictional/example.com;
public site copy uses the real-firm facts above.

## Design & animation decisions (locked)

Full reasoning: [research/design-animation.md](./research/design-animation.md).

| Decision | Choice |
|---|---|
| Animation library | `motion` package (`motion/react`), React 19 compatible |
| Motion defaults | `<MotionConfig reducedMotion="user">`, easing `[0.22, 1, 0.36, 1]`, rises ≤ 32px, stagger 0.08–0.12s |
| Signature moves | staggered fade-rise, image "Ken Burns settle" (scale 1.08→1), SVG hairline draws (drafting-line metaphor), hover lift −4px, parallax ±6% hero-only |
| Route transitions | React Router `<Link viewTransition>` with feature detection |
| Typography | **Fraunces** (display, variable) + **Inter** (body/UI) + **JetBrains Mono** (project metadata accents) |
| Palette | "Warm Gallery" adapted to the firm's copper brand — light: bg `#FAF7F2`, text `#1C1917`, accent copper `#B45309`; dark: bg `#161412`, text `#F5F0EA`, accent brass `#D4A574` |
| Themes | light / dark / system via CSS custom properties + Tailwind v4 `@theme`, `.dark` class override, no-FOUC cookie |
| AI preset taxonomy | style / lighting_mood / flooring / wall_finish / furniture_density / color_scheme — Indian-localized (contemporary-indian, kota-stone, cement tile); chip rows with thumbnails, progressive disclosure |

## Platform architecture (confirmed earlier, recorded here)

React Router v7 framework mode (SSR) + custom Express server · Supabase
(Postgres, Auth with Google OAuth + optional TOTP 2FA, Realtime, RLS) ·
Cloudflare R2 + CDN for files/images · client-side OBJ/FBX/DAE→glTF conversion,
PDF previews for 2D DWG · OpenAI interior visualizer with credits (2 free
post-login) · Razorpay + accountant-recorded cash · pg-boss jobs ·
pino → admin console telemetry · Render hosting behind Cloudflare.

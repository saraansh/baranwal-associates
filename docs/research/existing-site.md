# Website Analysis: baranwalassociates.com

## 1. Live Status
**The site is live** at `https://baranwalassociates.com` (the `www.` variant returns HTTP 421 Misdirected Request — a TLS/vhost misconfiguration worth noting). It is a modern single-page React application built with **Lovable / gpt-engineer** (asset uploads point to `storage.googleapis.com/gpt-engineer-file-uploads/...`), using Vite bundles, Tailwind CSS, shadcn/ui components, and a **Supabase** backend for dynamic project/photo data plus an admin login for content management.

Historical note: the only Wayback Machine snapshot (2021-11-27, `https://web.archive.org/web/20211127012217/http://baranwalassociates.com/`) is a **GoDaddy parking-lander ad page** — so the current site is the firm's first real website, launched recently (assets dated Aug–Sep 2025, "© 2024" in footer).

## 2. Structure & Pages
Single-page site with anchor navigation: **Home | About | Services | Projects | Contact**, plus a dark/light theme toggle and "Get Quote" / "Call Now" CTAs. Sections in order:
- Hero — tagline "Designing Dreams, Building Legacy"; badge "Architectural & Structural Experts Since 1987"
- About — founder profile: **Er. Anand Prakash Baranwal, Principal Architect & Founder**, "passionate about creating spaces that tell stories"
- Services (7 cards) — Achievements/stats — Projects (dynamic) — Testimonials — FAQ (8 questions) — Contact — Footer
- All other paths (`/projects`, `/about`, etc.) 404 to a styled "Oops! Page not found" page — it is truly a one-pager.

## 3. Textual Content
- **Taglines:** "Designing Dreams, Building Legacy"; "Creating exceptional architectural solutions"; footer: "Trusted architectural and structural engineering experts since 1987. Creating exceptional spaces across Eastern U.P."
- **Services (title + features, from JS bundle):**
  - Architectural Design — Concept Development, 3D Visualization, Construction Drawings, Site Supervision
  - Structural Engineering — Load Analysis, Foundation Design, Steel & Concrete Design, Seismic Analysis
  - Interior Design — Space Planning, Material Selection, Furniture Design, Lighting Design
  - Landscape Design — Garden Design, Hardscape Planning, Plant Selection, Irrigation Systems
  - Township Planning — Master Planning, Infrastructure Design, Zoning Compliance, Sustainability Planning
  - Retrofitting — Energy Efficiency, Structural Upgrades, Code Compliance, Aesthetic Improvements
  - Waterproofing — Basement Waterproofing, Roof Protection, Moisture Control, Sealant Application
- **Stats:** "38 Years of Experience (since 1987)", "3000+ Completed Projects", "3000+ Happy Clients", "Award-Winning Designs", "Trusted in Eastern U.P."
- **Testimonial (only one, likely placeholder):** Rajesh Kumar, Homeowner — "Baranwal Associates transformed our dream home into reality..."
- **Contact:** +91 7007103393 / +91 9415245083, apbaranwal@gmail.com, Gorakhpur, U.P.; Mon–Sat 10:30–19:00; WhatsApp deep-link ("Hello! I'm interested in your architectural services.")
- **Inconsistency found:** the meta description says "Architectural & structural design firm in **Maharashtra**" while all site copy says Eastern U.P./Gorakhpur — an SEO bug. Also "since 1987" on-site vs. "established 1991" on Justdial.

## 4. Branding
- **Logo** (`/tmp/ba_logo.png`, from og:image): gold/metallic "B" monogram crowned by flame/peacock-feather flourishes over grey 3D skyscrapers, wordmark "BARANWAL ASSOCIATES" in gold serif caps with "ENGINEERS & BUILDERS" beneath in white — designed for a black background (it is literally a WhatsApp image with background removed, low production quality).
- **Colors (CSS variables, HSL):** copper/gold primary `--copper: 30 65% 40%` (light) / `30 70% 50%` (dark), accent orange `25 95% 55%`, near-black backgrounds (`0 0% 8%`) for dark mode, white/warm-brown text (`30 60% 20%`) for light mode; copper gradients and glassmorphism ("gradient-glass-bright"), glow shadows.
- **Typography:** Inter (system fallback stack) — no display/serif face despite the serif logo.

## 5. Projects/Portfolio
Categories defined: Residential, Commercial, Industrial, Institutional. However, the rendered page shows **"Loading projects..." and "0+" completed projects** — the Supabase-driven portfolio is empty or failing to load. **No actual project entries are publicly visible.** Real project photos exist off-site: Justdial lists 20 photos; Houzz and IndiaMART profiles exist.

## 6. Imagery Style
Minimal: logo (twice), founder portrait, one testimonial avatar, Google Maps embed. No hero photography, no project gallery images live. Overall aesthetic is dark, glassy, copper-glow "AI-startup" styling — polished but generic and image-starved for an architecture firm.

## 7. Rebuild Recommendations
**Keep:**
- Copper/gold + charcoal palette (matches logo, distinctive for the sector) and dark/light toggle
- The clear 7-service taxonomy with feature bullets
- Strong trust signals: "Since 1987", 3000+ projects, Eastern U.P. regional positioning
- WhatsApp/call CTAs (right channel for the Indian residential market) and the FAQ section (good for local SEO)

**Drop/Fix:**
- The empty "Loading projects... / 0+" portfolio — worst credibility hit on the site; seed it with the 20+ photos already on Justdial/Houzz
- The single placeholder testimonial (Justdial shows 12 five-star reviews to pull from)
- "Maharashtra" in meta description (should be Gorakhpur/Uttar Pradesh); reconcile 1987 vs 1991 founding date; update "© 2024"
- The 421 error on `www.` (fix vhost/SSL so both hosts resolve)
- Exposed public admin login flow in the client bundle

**Improve:**
- Replace the WhatsApp-photo logo with a properly vectorized SVG rebuild of the monogram
- Add a serif/display typeface pairing to match the logo instead of Inter-only
- Real photography: hero image of a completed Gorakhpur project, founder at work, before/after retrofits
- Per-project case-study pages (real routes, not a SPA anchor) for SEO on "architect in Gorakhpur" queries
- LocalBusiness/ArchitecturalService JSON-LD schema (currently absent), and link the Houzz/Justdial/IndiaMART/Facebook profiles
- Server-render or pre-render content — currently everything meaningful is client-side JS, invisible to some crawlers

Sources: [baranwalassociates.com](https://baranwalassociates.com) (live site, CSS `/assets/index-BKKo5HGl.css`, JS `/assets/index-D4Zeq7Sb.js`), [Wayback snapshot 2021 (parked)](https://web.archive.org/web/20211127012217/http://baranwalassociates.com/), [Justdial listing](https://www.justdial.com/Gorakhpur/Baranwal-Associates-Civil-Lines-University/9999PMULDELSTD47223_BZDET), [Houzz profile](https://www.houzz.in/professionals/architects-and-building-designers/baranwal-associates-pfvwin-pf~344725857), [IndiaMART profile](https://www.indiamart.com/baranwal-associates/), [LinkedIn — Anand Baranwal](https://www.linkedin.com/in/anand-baranwal-96433810a/), [Facebook page](https://www.facebook.com/baranwalnassociates/). Local artifacts: `/tmp/ba_home.html`, `/tmp/ba.css`, `/tmp/ba.js`, `/tmp/ba_logo.png`, `/tmp/wb2021.html`.

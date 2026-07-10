# Design & Animation Research: Premium Architecture-Firm Web App (React 19 + Vite + Tailwind v4)

---

## 1. Clean, Subtle Animations

### The Motion library (formerly Framer Motion)

- **Package**: `motion` (NOT `framer-motion` — the project went independent in 2024/2025 and was renamed). Install: `npm install motion`. Import: `import { motion, AnimatePresence, useScroll, useInView, MotionConfig } from "motion/react"`.
- **React 19 compatibility**: Fully compatible. Motion v11.11+ supports React 19; current v12 line (2026) includes React 19-specific fixes (e.g., preserving in-flight motion values across React 19 reorder unmount/remount). Works fine with Vite — no framework coupling.
- **Engine**: Hybrid — animations run natively via WAAPI (hardware-accelerated, 120fps target) with a JS fallback. Tree-shakable; the mini `animate()` from `"motion"` (not `"motion/react"`) is ~2.5–5kb if you need micro-interactions without components. v12 added hardware-accelerated `useScroll`/`scroll()` offsets and `oklch`/`color-mix` support (pairs nicely with Tailwind v4's oklch-based palette).

### Key APIs to use

| API | Use for |
|---|---|
| `<motion.div initial animate whileHover whileTap>` | Base animated elements |
| `whileInView` + `viewport={{ once: true, margin: "-10%" }}` | Scroll-reveal without a hook |
| `useInView(ref, { once: true })` | Programmatic in-view triggers |
| `useScroll` + `useTransform` | Parallax, scroll progress, image scale-on-scroll |
| `layout` / `layoutId` | Shared-element morphs (e.g., project card → project hero, preset chip → expanded panel) |
| `<AnimatePresence mode="wait">` | Exit animations for route/gallery/theme changes |
| `<MotionConfig transition={...} reducedMotion="user">` | App-wide defaults |

### Scroll-driven reveal patterns (calm/premium recipes)

- **Staggered fade-rise**: parent `variants` with `staggerChildren: 0.08–0.12`; children `{ opacity: 0, y: 24 } → { opacity: 1, y: 0 }`, duration 0.6–0.9s, easing `[0.22, 1, 0.36, 1]` (easeOutQuint-ish). Rise ≤ 32px — big travel reads as cheap.
- **Image reveal**: clip-path or `scale: 1.08 → 1` inside an `overflow-hidden` frame ("Ken Burns settle") — the signature architecture-site move.
- **Parallax restraint**: `useScroll({ target, offset: ["start end", "end start"] })` + `useTransform(scrollYProgress, [0,1], ["-6%", "6%"])`. Keep parallax to ±5–8% on hero imagery only; never parallax text.
- **Hover lifts**: `whileHover={{ y: -4 }}` + shadow/border-color transition via Tailwind; 150–250ms. Subtle image zoom to 1.03–1.05 on project cards.
- **Line/rule draws**: SVG `pathLength: 0 → 1` for hairline dividers — on-brand for an architecture firm (drafting-line metaphor).

### View Transitions API (2026 status)

- **Same-document (SPA)**: Baseline Newly Available since Oct 2025 — Chrome/Edge 111+, Safari 18+, Firefox 133+. Safe to use with feature-detection: `if (document.startViewTransition) {...} else { update() }`.
- **Cross-document (MPA)**: Chrome 126+, Safari 18.2+; Firefox still behind a flag — not relevant for a Vite SPA anyway.
- **Practical advice**: use React Router's built-in `viewTransition` prop (`<Link viewTransition>`) or wrap route state changes in `document.startViewTransition()`. Reserve it for page-level transitions (project list → project detail with a `view-transition-name` on the hero image); keep Motion for in-page choreography. React's experimental `<ViewTransition>` component exists but is not yet stable — don't build on it for production in 2026.

### Reduced-motion accessibility

- Wrap the app: `<MotionConfig reducedMotion="user">` — automatically disables transform/layout animations while keeping opacity/color animations (i.e., reveals degrade to pure fades, which is exactly right for this brand).
- Use `useReducedMotion()` to additionally: disable parallax, stop autoplaying hero video, and skip Ken Burns zooms.
- Belt-and-braces in CSS: `@media (prefers-reduced-motion: reduce)` to zero out CSS transitions and View Transitions (`::view-transition-group(*) { animation: none }`).

---

## 2. Architecture-Firm Design Language

### What award-level studio sites (Awwwards/Godly-tier) do

- **Photography is the interface**: full-bleed hero (single strongest image or 3–5-image slow crossfade), edge-to-edge project imagery, minimal chrome. Serve WebP/AVIF (25–35% smaller than JPEG).
- **Generous whitespace**: oversized section padding (`py-24`–`py-40`), max-width prose (~65ch), asymmetric editorial grids — e.g., 12-col grid where images span 7–8 cols and captions sit offset in 3.
- **Restrained motion**: load reveals, image settles, hover zooms — nothing bouncy or springy-toy-like.
- **Typography as brand**: one expressive editorial display face at very large sizes (clamp 3rem–7rem heroes), a quiet grotesque for everything else, wide tracking on small uppercase labels (project meta: "RESIDENTIAL — DELHI NCR — 2024").
- **Common structures**: sticky minimal nav that inverts over imagery; index/list view of projects with hover image preview; footer as a full "contact" section.

### Font pairings (all on Google Fonts)

1. **Fraunces (display, use optical-size + light weights) + Inter** — modern-editorial with warmth; Fraunces' variable axes (wght, opsz, SOFT, WONK) let you tune from refined to characterful. Safest premium pick.
2. **Cormorant Garamond (display) + Hanken Grotesk (body/UI)** — the "quiet luxury" default; high-contrast serif at 40px+ only, Hanken for body/UI.
3. **Libre Caslon Text or Instrument Serif (display) + Space Grotesk (body/labels)** — more contemporary/architectural; Space Grotesk's drafting-adjacent character suits an architecture firm's labels and numerals.
- Avoid Playfair Display — widely flagged as over-used by 2026. Use a mono accent (e.g., **JetBrains Mono** or **Space Mono**) sparingly for project metadata/dimensions if you want a technical touch.

### Candidate color palettes (light + dark; hex)

**Palette A — "Warm Gallery" (recommended)**
- Light: bg `#FAF7F2`, surface `#F1EBE2`, text `#1C1917`, secondary `#78716C`, hairline `#E7E0D5`, accent (burnt terracotta) `#B45309` or `#9A5B3C`
- Dark: bg `#161412`, surface `#211E1B`, text `#F5F0EA`, secondary `#A8A29E`, accent (soft brass) `#D4A574`

**Palette B — "Ink & Limestone"**
- Light: bg `#F5F4F0`, surface `#EAE8E1`, text `#111110`, secondary `#6B6963`, accent (deep olive) `#4A4E3A`
- Dark: bg `#0F0F0E`, surface `#1A1A18`, text `#EDECE6`, secondary `#9C9A92`, accent `#A3A380`

**Palette C — "Charcoal & Clay" (higher contrast, more contemporary)**
- Light: bg `#FFFFFF`, surface `#F4F1ED`, text `#0A0A0A`, secondary `#5C5C5C`, accent (clay red) `#C2542B`
- Dark: bg `#121212`, surface `#1D1B19`, text `#FAFAF9`, secondary `#8F8B85`, accent `#E07A4F`

Implementation: define as CSS custom properties consumed by Tailwind v4 `@theme` tokens; system theme via `prefers-color-scheme` with a manual override class (`.dark`), stored in `localStorage`. Warm off-whites/warm charcoals (not pure `#FFF`/`#000`) are the current premium signal.

---

## 3. AI Interior-Preset UX

### How RoomGPT / ReimagineHome / Spacely structure it

- **RoomGPT**: upload photo → select **room type** → select **theme** (Modern, Minimalist, Professional, Tropical, Vintage, Industrial…) → generate. Single-screen, chip/card-based, near-zero text input.
- **ReimagineHome** (praised for cleanest UX): Space Type → Design Theme (large themed library: Modern, Minimalist, Coastal, Bohemian, Japandi, Modern Traditional…) → optional **color family** chips (emerald, ochre, cobalt) and **material** chips (velvet, bouclé, linen, oak) → optional free-text prompt. Iterative refinement ("change flooring only") builds on prior result.
- **Spacely AI** (pro-oriented): style library (Modern, Minimalist, Scandinavian, Industrial, Mid-century, Coastal, Farmhouse, Bohemian, Traditional, Japandi, Wabi-Sabi Wood…) + separate controls for render quality, lighting, and materials; masking/region edit for element-level control.
- Market norm: **60+ preset styles + optional custom text prompt**, thumbnail-first selection, before/after slider on results, generate 3–5 variations.

### Recommended preset taxonomy for your app

```
style (single-select, required)
  modern-minimal | contemporary-indian | scandinavian | japandi |
  industrial | mid-century-modern | traditional-indian | colonial |
  wabi-sabi | art-deco | bohemian | luxury-contemporary

lighting_mood (single-select)
  warm-ambient | bright-daylight | golden-hour | dramatic-accent |
  soft-diffused | cool-white

flooring (single-select)
  light-oak-wood | walnut-wood | polished-marble | matte-vitrified-tile |
  terrazzo | polished-concrete | kota-stone | patterned-cement-tile

wall_finish (single-select)
  matte-paint | lime-plaster / limewash | exposed-brick | wood-paneling |
  textured-plaster | wallpaper-accent | micro-cement

furniture_density (single-select, 3-point scale)
  minimal | balanced | fully-furnished

color_scheme (optional single-select)
  warm-neutrals | earthy-terracotta | monochrome | deep-greens | indigo-brass
```

(Contemporary Indian, Kota stone, and cement tile entries localize the taxonomy for an Indian firm — a differentiator none of the US tools have.)

### Recommended UI pattern

- **Horizontal-scrolling chip rows with thumbnail previews** — one row per dimension, each chip a small rounded card: 64–80px thumbnail + label; selected state = accent ring + check. This is the proven RoomGPT/ReimagineHome pattern.
- Style row first and largest (image-dominant cards); secondary dimensions (lighting, flooring, wall, density) as smaller chips, optionally in a collapsible "Fine-tune" accordion so casual users hit Generate after one choice — **progressive disclosure** is the key learning from these tools.
- Single-select per dimension (radio semantics); compose selections into one prompt string server-side.
- Motion touches: `layoutId` on the selection ring so it glides between chips; stagger-fade chips in per row; `AnimatePresence` crossfade + before/after slider on results; skeleton shimmer during generation (typically 15–60s — show progress state).
- Accessibility: chips as real `<input type="radio">`/`role="radiogroup"`, visible focus rings, labels not just images.

---

## Sources

- [Motion for React docs](https://motion.dev/docs/react) · [motion component](https://motion.dev/docs/react-motion-component) · [Motion changelog](https://motion.dev/changelog) · [Motion accessibility guide](https://motion.dev/docs/react-accessibility) · [useReducedMotion](https://motion.dev/docs/react-use-reduced-motion) · [MotionConfig](https://motion.dev/docs/react-motion-config)
- [Framer Motion Complete Guide 2026 (inhaq)](https://inhaq.com/blog/framer-motion-complete-guide-react-nextjs-developers) · [Scroll animation effects (ogblocks)](https://ogblocks.dev/blog/react-scroll-animation-in-framer-motion) · [SmoothUI Motion tutorial](https://smoothui.dev/blog/framer-motion-tutorial)
- [MDN View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) · [View Transitions in React/Next (rebeccamdeprey)](https://rebeccamdeprey.com/blog/view-transition-api) · [Cross-document VT 2026 guide](https://trade-assistance.com/blog/cross-document-view-transitions-mpa-2026/)
- [Awwwards architecture sites](https://www.awwwards.com/websites/architecture/) · [Webflow: top architecture websites 2025](https://webflow.com/blog/best-architecture-websites) · [Plug & Play: best architect websites 2025](https://www.plugandplaydesign.co.uk/best-architect-websites-2025/) · [Comrade: best architect websites](https://comradeweb.com/blog/best-architect-websites/)
- [Best Google Font pairings 2025 (Medley)](https://medley.ltd/blog/best-google-font-pairings-for-ui-design-in-2025/) · [StudioLimb font pairing guide](https://www.studiolimb.com/guides/font-pairing-guide.html) · [Luxury Google Fonts (Ace & Whim)](https://aceandwhim.com/13-free-google-fonts-for-your-luxury-brand-website/)
- [Dark mode palettes (Colorhero)](https://colorhero.io/blog/dark-mode-color-palettes-2025) · [Website color schemes 2025 (Enveos)](https://enveos.com/stunning-website-color-schemes-css-hex-codes-for-2025-trendy-palettes-for-modern-designs/)
- [RoomGPT](https://www.roomgpt.io/) · [ReimagineHome](https://www.reimaginehome.ai/) · [ReimagineHome step-by-step](https://www.reimaginehome.ai/blogs/step-by-step-turn-a-photo-into-a-redesigned-room-reimaginehomeai-makes-makeovers-instant) · [Spacely AI review (Morphed)](https://morphed.app/blog/spacely-ai-interior-design) · [Spacely Japandi](https://www.spacely.ai/rooms/ai-living-room-design/japandi-interior-design-style) · [13 AI interior tools tested (DressMyCrib)](https://dressmycrib.com/blog/ai-interior-design)

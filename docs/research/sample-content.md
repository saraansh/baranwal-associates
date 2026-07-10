# Baranwal Associates — Platform Seed Data (SEED/SAMPLE Content)

> Firm: **Baranwal Associates** — Architecture & Interior Design Studio, Varanasi, Uttar Pradesh, India
> Founded 2011 · Services: residential design, interiors, commercial fit-outs, heritage conservation
> All emails use `@example.com`. All records are marked `seed: true`.

---

## (a) Sample Blog Posts

| # | Title | Slug | Category | Summary | Cover-Image Theme |
|---|-------|------|----------|---------|-------------------|
| 1 | Vastu Meets Modern: Designing a Contemporary Home Without Compromising Tradition | `vastu-meets-modern-contemporary-home` | Residential Design | How we reconcile Vastu Shastra principles — entrance orientation, brahmasthan planning, kitchen placement — with open-plan modern living. Includes a walkthrough of a recent 4BHK bungalow in Varanasi where the client wanted both. | Warm-toned isometric floor plan overlaid on a compass rose, morning light through a jaali screen |
| 2 | What Does It Really Cost to Build a House in Varanasi in 2026? | `cost-to-build-house-varanasi-2026` | Guides & Costs | A transparent breakdown of construction costs in eastern UP — from ₹1,800/sq ft economy builds to ₹3,500+/sq ft premium finishes. Covers material escalation, labour rates, and where clients typically overspend. | Flat-lay of brick, cement bag, steel rebar and a calculator on blueprint paper |
| 3 | Restoring a 120-Year-Old Haveli Near Assi Ghat: A Conservation Diary | `haveli-restoration-assi-ghat-diary` | Heritage & Conservation | Field notes from our ongoing haveli restoration — lime plaster (surkhi) instead of cement, salvaging original teak brackets, and negotiating with the local heritage cell. Part one of a three-part series. | Weathered carved wooden doorway with scaffolding, golden-hour Ganga ghat backdrop |
| 4 | Italian Marble vs. Vitrified Tiles: An Honest Comparison for Indian Homes | `italian-marble-vs-vitrified-tiles` | Interiors & Materials | Statuario looks stunning at ₹450–1,200/sq ft, but is it right for your lifestyle? We compare cost, maintenance, staining, and resale perception — with photos from three of our completed projects. | Split-frame close-up: veined white marble slab vs. large-format tile, dramatic side lighting |
| 5 | Why Your Architect Wants a 3D Model Before You Approve Anything | `why-3d-models-before-approval` | Process & Technology | Clients who review SketchUp and glTF walkthroughs request 60% fewer changes during construction. Here's how our drawing-versioning workflow saves you money and how to read a 3D model like a pro. | Laptop showing a 3D building model, hand holding a stylus, blueprint texture background |
| 6 | Small Showroom, Big Impact: Retail Design Lessons from a Banarasi Silk Store | `retail-design-banarasi-silk-showroom` | Commercial | Lighting temperature sells silk — 3000K warm spots on display walls, 4000K at billing. Our design decisions for a 1,600 sq ft silk showroom in Godowlia, and the footfall data three months after opening. | Richly lit fabric display wall with draped Banarasi sarees, brass accents, moody retail interior |

---

## (b) Sample Users & Roles

### System Admin (Owner / Principal Architect)

| Field | Value |
|---|---|
| Name | Ar. Saraansh Baranwal |
| Email | `saraansh.baranwal@example.com` |
| Role | `system-admin` |
| Title | Principal Architect & Founder |
| Bio | COA-registered architect (CA/2011/xxxxx), 15 years' practice across residential, commercial and heritage work in eastern UP. |

**Can:** everything — manage users/roles, create/archive projects, publish blog posts, approve drawing versions, view full payments ledger, adjust client credits, configure Razorpay, delete records, invite collaborators.
**Cannot:** (no restrictions; sole superuser)

### Employees

| Field | Employee 1 | Employee 2 |
|---|---|---|
| Name | Priya Srivastava | Manoj Kumar Gupta |
| Email | `priya.srivastava@example.com` | `manoj.gupta@example.com` |
| Role | `employee` (designation: Junior Architect) | `employee` (designation: Accountant) |
| Bio | B.Arch (2023), handles working drawings, 3D models, and client design coordination. | 12 years in accounts; manages invoicing, cash receipts, GST filings. |

**Priya can:** upload/version drawings on assigned projects, update milestones & progress %, message clients on assigned projects, draft blog posts (needs admin approval to publish).
**Priya cannot:** see payments ledger, manage users, delete drawing versions, approve final drawings.

**Manoj can:** record CASH payments, reconcile Razorpay settlements, issue receipts, view/export the ledger, adjust client credits (with admin approval flag).
**Manoj cannot:** access drawing files, edit project designs/milestones, message clients on design threads, publish blogs.

### Invited Collaborator

| Field | Value |
|---|---|
| Name | Er. Alok Verma |
| Email | `alok.verma@example.com` |
| Role | `collaborator` (Structural Engineer, external — Verma Structural Consultants, Lucknow) |
| Invited to | PRJ-2025-014 (Bungalow), PRJ-2025-021 (Heritage Haveli) only |

**Can:** view/download drawings on invited projects, upload structural drawings (STR-prefixed), comment on drawing versions, participate in project threads.
**Cannot:** see budgets/payments, view other projects, invite users, edit architectural drawings, message clients directly (comments routed through firm).

### Clients

| Field | Client 1 | Client 2 | Client 3 |
|---|---|---|---|
| Name | Ramesh Agarwal | Neha Khanna | Sunil Jaiswal |
| Email | `ramesh.agarwal@example.com` | `neha.khanna@example.com` | `sunil.jaiswal@example.com` |
| Role | `client` | `client` | `client` |
| Profile | Wholesale trader, Chandauli; building a family bungalow | IT manager relocating from Bengaluru to Varanasi; 3BHK interior | Owner, Jaiswal Silks (Godowlia); showroom + ancestral haveli |
| Projects | PRJ-2025-014 | PRJ-2026-003 | PRJ-2025-018, PRJ-2025-021 |

**Clients can:** view own projects (milestones, progress, approved drawing versions), message the firm, use the AI interior-visualizer, pay via Razorpay, view own ledger & credit balance, download final deliverables.
**Clients cannot:** see internal/WIP drawing versions, other clients' data, internal costs/margins, edit anything, see firm-side ledger.

---

## (c) Sample Projects

### PRJ-2025-014 — Agarwal Residence (4BHK Bungalow), Sarnath Road, Varanasi
- **Client:** Ramesh Agarwal · **Team:** Saraansh (lead), Priya, Alok Verma (structural)
- **Status:** `under-construction` · **Progress: 58%**
- **Budget range:** ₹95,00,000 – ₹1,10,00,000 (design + construction, 2,400 sq ft plot, G+1, ~3,800 sq ft built-up)

**Milestones**

| Milestone | Date | Status |
|---|---|---|
| Site survey & soil test | 2025-03-10 | done |
| Concept design sign-off | 2025-04-22 | done |
| VDA (Varanasi Development Authority) sanction | 2025-07-05 | done |
| Structural drawings issued (GFC) | 2025-08-18 | done |
| Plinth complete | 2025-10-30 | done |
| First-floor slab cast | 2026-02-14 | done |
| Brickwork & electrical conduiting | 2026-08-15 | in-progress |
| Finishes & handover | 2027-01-31 | pending |

**Drawing files**

| File | Versions | Notes |
|---|---|---|
| `AGR-BNG_floor-plans.dwg` | v1 (2025-04-02) · v2 (2025-04-18) · v3 (2025-06-20) | v1: concept layout; v2: pooja room shifted NE per Vastu, kitchen enlarged; v3: VDA sanction set — setbacks corrected to 3.0 m front |
| `AGR-BNG_3d-massing.skp` | v1 (2025-04-05) · v2 (2025-04-19) | v1: flat-roof scheme; v2: added sloped mangalore-tile porch per client request |
| `AGR-BNG_STR-foundation.dwg` | v1 (2025-08-01) · v2 (2025-08-16) | v1: isolated footings; v2: footing depth revised to 1.8 m after soil report (uploaded by Er. Alok Verma) |
| `AGR-BNG_walkthrough.gltf` | v1 (2025-05-02) | Client-facing exterior walkthrough for concept approval |

### PRJ-2026-003 — Khanna Apartment Interiors (3BHK), Shivpur, Varanasi
- **Client:** Neha Khanna · **Team:** Priya (lead), Saraansh (review)
- **Status:** `design-development` · **Progress: 35%**
- **Budget range:** ₹18,00,000 – ₹24,00,000 (full interiors, 1,450 sq ft)

**Milestones**

| Milestone | Date | Status |
|---|---|---|
| Site measurement & brief | 2026-04-08 | done |
| Mood boards & style lock (modern-minimal) | 2026-05-02 | done |
| Furniture layout approval | 2026-06-12 | done |
| 3D views — living/dining | 2026-07-20 | in-progress |
| GFC + BOQ issue | 2026-08-25 | pending |
| Fit-out complete & handover | 2026-12-15 | pending |

**Drawing files**

| File | Versions | Notes |
|---|---|---|
| `KHN-INT_furniture-layout.dwg` | v1 (2026-05-20) · v2 (2026-06-04) · v3 (2026-06-11) | v1: initial layout; v2: L-shaped sofa swapped for 3+2, TV wall moved off window; v3: approved set — crockery unit added in dining |
| `KHN-INT_living-3d.skp` | v1 (2026-06-28) · v2 (2026-07-08) | v1: veneer TV panel; v2: fluted panel + Italian marble flooring per client feedback |
| `KHN-INT_living-preview.gltf` | v1 (2026-07-09) | Web preview exported for client portal review |

### PRJ-2025-018 — Jaiswal Silks Showroom, Godowlia, Varanasi
- **Client:** Sunil Jaiswal · **Team:** Saraansh (lead), Priya
- **Status:** `completed` · **Progress: 100%**
- **Budget range:** ₹62,00,000 – ₹70,00,000 (1,600 sq ft retail fit-out, final: ₹66,40,000)

**Milestones**

| Milestone | Date | Status |
|---|---|---|
| Brief & measured drawing | 2025-06-15 | done |
| Concept + lighting design | 2025-07-28 | done |
| GFC & BOQ | 2025-09-05 | done |
| Fit-out execution | 2025-12-20 | done |
| Snag list closure & handover | 2026-01-18 | done |

**Drawing files**

| File | Versions | Notes |
|---|---|---|
| `JSL-SHW_layout.dwg` | v1 (2025-07-10) · v2 (2025-07-25) · v3 (2025-08-30) | v1: central display island; v2: island removed for gaddi (floor seating) zone — traditional Banarasi retail format; v3: GFC with electrical layout |
| `JSL-SHW_facade.skp` | v1 (2025-07-15) · v2 (2025-08-02) | v1: ACP facade; v2: brass-finish jaali + backlit signage, approved |
| `JSL-SHW_interior.gltf` | v1 (2025-08-05) · v2 (2025-08-20) | v1: 4000K uniform lighting; v2: 3000K warm accent spots on saree display walls |

### PRJ-2025-021 — Jaiswal Haveli Restoration, near Assi Ghat, Varanasi
- **Client:** Sunil Jaiswal · **Team:** Saraansh (lead), Alok Verma (structural), Priya (documentation)
- **Status:** `on-hold` (awaiting heritage-cell NOC) · **Progress: 22%**
- **Budget range:** ₹1,25,00,000 – ₹1,55,00,000 (restoration + adaptive reuse as boutique homestay, ~5,200 sq ft)

**Milestones**

| Milestone | Date | Status |
|---|---|---|
| Condition mapping & photo documentation | 2025-11-10 | done |
| Measured drawings (as-built) | 2026-01-25 | done |
| Structural distress assessment | 2026-03-14 | done |
| Heritage cell NOC | 2026-08-30 (est.) | in-progress |
| Phase 1: structural stabilisation | 2026-11-01 | pending |
| Phase 2: lime plaster & woodwork restoration | 2027-04-15 | pending |

**Drawing files**

| File | Versions | Notes |
|---|---|---|
| `JSH-HRT_as-built.dwg` | v1 (2026-01-15) · v2 (2026-01-24) | v1: ground-floor measured drawing; v2: added first floor + courtyard sections, crack mapping layer |
| `JSH-HRT_STR-assessment.dwg` | v1 (2026-03-10) · v2 (2026-03-20) · v3 (2026-04-02) | v1: distress markup; v2: jack-arch roof repair detail; v3: revised per conservation norm — steel props replaced with timber shoring (Er. Alok Verma) |
| `JSH-HRT_courtyard-scan.gltf` | v1 (2025-11-20) | Photogrammetry scan of central courtyard for heritage-cell submission |

---

## (d) Sample Conversation Threads

### Thread 1 — Client ↔ Firm project messaging (PRJ-2025-014, Agarwal Residence)

> **Ramesh Agarwal** · 2026-02-10, 09:42
> Namaste Saraansh ji. Contractor is saying slab casting this Friday. Should we be present at site?

> **Ar. Saraansh Baranwal** · 2026-02-10, 10:15
> Namaste Ramesh ji. Yes, Friday 14th is confirmed. Priya will be on site from 7 AM for reinforcement checking before the pour. You're welcome to visit after 11 AM once casting starts.

> **Ramesh Agarwal** · 2026-02-10, 10:22
> Ok. Also my wife is asking — can we still change the kitchen platform height? Her mother will also use the kitchen and she is quite short.

> **Priya Srivastava** · 2026-02-10, 11:05
> Ramesh ji, yes — platform height is decided at finishing stage, so no problem at all. Standard is 850 mm; we can do 800 mm. I'll note it in the interior working drawings.

> **Ramesh Agarwal** · 2026-02-10, 11:09
> Very good. And one more thing — neighbour is saying our east wall is on his line. I have sent his photo on the thread. 📎 `site-east-wall.jpg`

> **Ar. Saraansh Baranwal** · 2026-02-10, 12:30
> Please don't worry. Our sanctioned plan (v3, approved by VDA) shows 1.5 m side setback and the plinth was set out by licensed surveyor. I'm attaching the setback sheet — you can show him. If he still objects, we'll arrange a joint measurement. 📎 `AGR-BNG_floor-plans_v3_setbacks.pdf`

> **Ramesh Agarwal** · 2026-02-11, 08:50
> Showed him, matter is settled. 🙏

> **Ramesh Agarwal** · 2026-02-14, 13:20
> At site now. Slab work looking very solid. Mixer running since morning.

> **Priya Srivastava** · 2026-02-14, 17:45
> Slab cast completed at 4:30 PM — 42 m³ M25 RMC, cube samples taken. Curing instructions given to contractor. Milestone marked complete, progress updated to 52%. ✅

> **Ramesh Agarwal** · 2026-02-14, 18:02
> Excellent work team. Mithai from our side next visit! 🍬

### Thread 2 — Employee ↔ Client drawing feedback (PRJ-2026-003, on `KHN-INT_living-3d.skp` **v1**)

> **Priya Srivastava** · 2026-06-28, 16:10
> Hi Neha, the living room 3D views are ready — please review version v1 on the portal. Key features: walnut veneer TV panel, off-white 3-seater, and grey vitrified tile flooring as per BOQ base spec.

> **Neha Khanna** · 2026-06-29, 21:34 · *(comment pinned on v1, camera view: living-cam-02)*
> Looks nice but the TV wall feels flat compared to the Pinterest boards I shared. Also honestly the grey tile is making the room feel like an office. Can we look at marble? Budget can stretch a little.

> **Priya Srivastava** · 2026-06-30, 10:05
> Totally fair! Two suggestions: (1) fluted wood panelling on the TV wall with a 100 mm stone ledge, (2) Italian marble — Statuario-look, ~₹580/sq ft, adds roughly ₹1.6 L for living+dining. I'll model both so you can compare before deciding.

> **Neha Khanna** · 2026-06-30, 10:41
> Yes please, let's see it. Fluted panel sounds exactly right.

> **Priya Srivastava** · 2026-07-08, 15:20
> Uploaded **v2** — fluted panel + Statuario flooring with warm 3000K cove lighting. Also exported a browser preview (`KHN-INT_living-preview.gltf`) so you can orbit around the room on your phone.

> **Neha Khanna** · 2026-07-08, 22:15 · *(comment on v2)*
> Wow, huge difference. Approving this direction. One tiny thing — can the cove light be slightly dimmer/warmer in the final spec? Otherwise ✅ from me.

> **Priya Srivastava** · 2026-07-09, 09:30
> Noted — spec updated to 2700K dimmable strip. Marking v2 as *client-approved* and moving to GFC drawings. 🎉

### Thread 3 — AI Interior Visualizer session (Neha Khanna, PRJ-2026-003)

> **Session:** `ai-viz-session-0042` · 2026-07-11, 20:05 · Credits at start: **10**

> **Neha Khanna:** *(uploads `IMG_20260711_195802.jpg` — current living room, tenant's flat)*
> This is my current living room. Can I see how my new flat's living room could look in the style we chose?

> **AI Assistant:** I can see your uploaded living-room photo — approx. 12×16 ft space, north-facing window on the left, existing beige walls. I'll re-imagine it using your selected presets. Please confirm:
> • **Style:** Modern Minimal
> • **Lighting:** Warm Evening
> • **Flooring:** Italian Marble (Statuario)
> Generate? (1 credit per generation)

> **Neha Khanna:** Yes, generate.

> **AI Assistant:** ✨ **Generation 1 complete** → `ai-gen-0042-01.png`
> Applied: fluted oak TV wall, low-profile off-white sofa, Statuario marble flooring with subtle veining, 2700K cove + floor-lamp warm evening lighting, decluttered open shelving. *Credits remaining: 9.*

> **Neha Khanna:** I love the floor! But the curtains look too dark and can you add some plants near the window?

> **AI Assistant:** Understood — regenerating with sheer ivory linen curtains and a cluster of indoor plants (areca palm + fiddle-leaf fig) by the north window. Same presets retained. (1 credit)

> **Neha Khanna:** Go ahead.

> **AI Assistant:** ✨ **Generation 2 complete** → `ai-gen-0042-02.png`
> Updated: sheer ivory curtains, planters near window, slightly brighter warm ambience to balance foliage. *Credits remaining: 8.*

> **Neha Khanna:** Perfect, this is the one. Saving to project.

> **AI Assistant:** Saved `ai-gen-0042-02.png` to PRJ-2026-003 → *Client References*. Your designer Priya has been notified. 🪴

---

## (e) Sample Payments Ledger

**Method:** `RAZORPAY` = online (auto-reconciled) · `CASH` = manual entry by accountant (Manoj Kumar Gupta), receipt no. issued

| Txn ID | Date | Client | Project | Description | Method | Ref / Receipt | Amount (INR) | Recorded By | Status |
|---|---|---|---|---|---|---|---|---|---|
| TXN-0091 | 2025-04-25 | Ramesh Agarwal | PRJ-2025-014 | Design fee — 1st instalment (concept sign-off) | RAZORPAY | `pay_QaX8kR2mNv91Lc` | ₹2,50,000 | system | captured |
| TXN-0102 | 2025-07-08 | Ramesh Agarwal | PRJ-2025-014 | Design fee — 2nd instalment (sanction) | CASH | RCPT-2025-041 | ₹2,00,000 | Manoj Gupta | recorded |
| TXN-0110 | 2025-08-01 | Sunil Jaiswal | PRJ-2025-018 | Showroom — design fee advance | RAZORPAY | `pay_QhT3wPz6XbK2Mn` | ₹3,00,000 | system | captured |
| TXN-0118 | 2025-09-10 | Sunil Jaiswal | PRJ-2025-018 | Showroom — GFC milestone | CASH | RCPT-2025-057 | ₹1,50,000 | Manoj Gupta | recorded |
| TXN-0131 | 2025-12-02 | Sunil Jaiswal | PRJ-2025-021 | Haveli — documentation retainer | RAZORPAY | `pay_RcV5nJq8LwF4Ds` | ₹1,75,000 | system | captured |
| TXN-0139 | 2026-01-20 | Sunil Jaiswal | PRJ-2025-018 | Showroom — final settlement on handover | RAZORPAY | `pay_RfM2xKt9QpG7Hb` | ₹2,10,000 | system | captured |
| TXN-0142 | 2026-02-16 | Ramesh Agarwal | PRJ-2025-014 | 3rd instalment (first-floor slab milestone) | CASH | RCPT-2026-008 | ₹1,50,000 | Manoj Gupta | recorded |
| TXN-0151 | 2026-04-10 | Neha Khanna | PRJ-2026-003 | Interior design fee — booking advance | RAZORPAY | `pay_SdN7yLw3TzJ5Kp` | ₹1,20,000 | system | captured |
| TXN-0158 | 2026-06-14 | Neha Khanna | PRJ-2026-003 | 2nd instalment (layout approval) | RAZORPAY | `pay_SgP4qMv8WxR2Fn` | ₹90,000 | system | captured |
| TXN-0160 | 2026-06-25 | Neha Khanna | — | AI visualizer credit pack (10 credits) | RAZORPAY | `pay_ShQ9rNw2YzT6Gm` | ₹2,499 | system | captured |
| TXN-0163 | 2026-07-02 | Ramesh Agarwal | PRJ-2025-014 | Site-visit charges reimbursement (Q2) | CASH | RCPT-2026-019 | ₹18,000 | Manoj Gupta | recorded |
| TXN-0165 | 2026-07-09 | Neha Khanna | PRJ-2026-003 | Ad-hoc: additional 3D view set (v2 revision) | RAZORPAY | `pay_SjR6tPx4ZaV8Hq` | ₹15,000 | system | captured |

### Credits Balance per Client (AI visualizer / portal credits)

| Client | Credits Purchased | Credits Used | Balance | Last Activity |
|---|---|---|---|---|
| Neha Khanna | 10 (TXN-0160) | 2 (session `ai-viz-session-0042`) | **8** | 2026-07-11 |
| Ramesh Agarwal | 5 (complimentary, onboarding) | 1 (facade preview trial) | **4** | 2025-05-04 |
| Sunil Jaiswal | 5 (complimentary, onboarding) | 0 | **5** | — |

---

### Internal Consistency Map (for seeders)
- 3 clients → 4 projects (Sunil Jaiswal owns 2: PRJ-2025-018, PRJ-2025-021).
- Er. Alok Verma appears only on PRJ-2025-014 and PRJ-2025-021 (matches his invite scope) and authored the `STR-` prefixed drawing versions.
- Thread 1 milestone ("First-floor slab cast", 2026-02-14) matches PRJ-2025-014 milestones and triggers CASH payment TXN-0142 two days later.
- Thread 2 approval of `KHN-INT_living-3d.skp` v2 (2026-07-08/09) matches the file's version dates and ad-hoc payment TXN-0165.
- Thread 3 presets (modern-minimal / warm evening / Italian marble) mirror Neha's approved v2 design; 2 generations deduct 10 → 8 credits, matching the credits table and credit-pack purchase TXN-0160.
- Blog posts 1, 3, 4, 5, 6 reference the bungalow, haveli, marble decision, versioning workflow, and silk showroom respectively.

/**
 * Public-site content. Firm facts come from docs/research/firm.md and the
 * existing-site audit; portfolio/blog entries are graceful fallbacks used
 * whenever the database is unreachable (they mirror supabase/seed.sql).
 */

export const firm = {
  name: "Baranwal Associates",
  tagline: "Designing Dreams, Building Legacy",
  since: 1987,
  principal: "Er. Anand Prakash Baranwal",
  region: "Eastern Uttar Pradesh",
  address: "25 Hari Om Nagar, Civil Lines, Gorakhpur, Uttar Pradesh 273009",
  city: "Gorakhpur",
  phones: ["+91 70071 03393", "+91 94152 45083"],
  email: "apbaranwal@gmail.com",
  whatsapp: "917007103393",
  hours: "Mon–Sat, 10:30 AM – 7:00 PM",
  social: {
    facebook: "https://www.facebook.com/baranwalnassociates/",
    houzz:
      "https://www.houzz.in/professionals/architects-and-building-designers/baranwal-associates-pfvwin-pf~344725857",
    justdial:
      "https://www.justdial.com/Gorakhpur/Baranwal-Associates-Civil-Lines-University/9999PMULDELSTD47223_BZDET",
  },
} as const;

export const stats = [
  { value: "38+", label: "Years of practice" },
  { value: "3000+", label: "Projects delivered" },
  { value: "5.0", label: "Justdial rating" },
  { value: "3000+", label: "Happy clients" },
] as const;

export const services = [
  {
    slug: "architectural-design",
    title: "Architectural Design",
    features: [
      "Concept development",
      "3D visualization",
      "Construction drawings",
      "Site supervision",
    ],
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=75",
  },
  {
    slug: "structural-engineering",
    title: "Structural Engineering",
    features: [
      "Load analysis",
      "Foundation design",
      "Steel & concrete design",
      "Seismic analysis",
    ],
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=75",
  },
  {
    slug: "interior-design",
    title: "Interior Design",
    features: [
      "Space planning",
      "Material selection",
      "Furniture design",
      "Lighting design",
    ],
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=75",
  },
  {
    slug: "landscape-design",
    title: "Landscape Design",
    features: [
      "Garden design",
      "Hardscape planning",
      "Plant selection",
      "Irrigation systems",
    ],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=75",
  },
  {
    slug: "township-planning",
    title: "Township Planning",
    features: [
      "Master planning",
      "Infrastructure design",
      "Zoning compliance",
      "Sustainability planning",
    ],
    image:
      "https://images.unsplash.com/photo-1672669092491-ac5a210747bc?auto=format&fit=crop&w=800&q=75",
  },
  {
    slug: "retrofitting",
    title: "Retrofitting",
    features: [
      "Energy efficiency",
      "Structural upgrades",
      "Code compliance",
      "Aesthetic improvements",
    ],
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=75",
  },
  {
    slug: "waterproofing",
    title: "Waterproofing",
    features: [
      "Basement waterproofing",
      "Roof protection",
      "Moisture control",
      "Sealant application",
    ],
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=75",
  },
] as const;

export const faqs = [
  {
    q: "How do I start a project with Baranwal Associates?",
    a: "Reach us through the contact form, a phone call, or WhatsApp. We begin with a free consultation to understand your plot, budget and requirements, followed by a site visit and a written fee proposal.",
  },
  {
    q: "What does it cost to build a house in Gorakhpur in 2026?",
    a: "Construction in Eastern U.P. typically ranges from ₹1,800/sq ft for economy builds to ₹3,500+/sq ft for premium finishes, excluding land. Design fees are quoted separately after the first consultation.",
  },
  {
    q: "Do you handle development-authority approvals?",
    a: "Yes — we prepare sanction drawings and handle submissions to GDA/VDA and other local development authorities, including compliance corrections until approval.",
  },
  {
    q: "Can you design as per Vastu?",
    a: "Absolutely. We routinely reconcile Vastu Shastra principles — entrance orientation, brahmasthan planning, kitchen placement — with contemporary open-plan living.",
  },
  {
    q: "Do you take up only-interiors projects?",
    a: "Yes. Full-home interiors, kitchens, offices, showrooms and retail fit-outs are a core practice area alongside architecture.",
  },
  {
    q: "Will I see a 3D model before construction?",
    a: "Every project gets 3D visualization before you approve drawings — and our client portal lets you orbit around interactive 3D models from your phone.",
  },
  {
    q: "Do you supervise construction?",
    a: "We offer scheduled site supervision with milestone tracking. Progress, photos and drawings are shared with you through the client portal.",
  },
  {
    q: "Which areas do you serve?",
    a: "We are based in Civil Lines, Gorakhpur and work across Eastern Uttar Pradesh — including Varanasi, Deoria, Basti, Kushinagar and surrounding districts.",
  },
] as const;

export const testimonial = {
  quote:
    "Innovative and rich design concepts — you made my house feel like something to be proud of.",
  author: "Verified client review",
  source: "Sulekha",
} as const;

/** Fallback portfolio (mirrors is_public seed projects). */
export const fallbackProjects = [
  {
    slug: "agarwal-residence",
    name: "Agarwal Residence",
    location: "Sarnath Road, Varanasi",
    category: "Residential",
    year: "2026",
    description:
      "4BHK family bungalow, G+1, ~3,800 sq ft built-up. Vastu-aligned plan with a sloped mangalore-tile porch.",
    cover_image_url:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "khanna-apartment-interiors",
    name: "Khanna Apartment Interiors",
    location: "Shivpur, Varanasi",
    category: "Interiors",
    year: "2026",
    description:
      "Full interiors for a 1,450 sq ft 3BHK — modern-minimal, fluted panelling, Statuario marble.",
    cover_image_url:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "jaiswal-silks-showroom",
    name: "Jaiswal Silks Showroom",
    location: "Godowlia, Varanasi",
    category: "Commercial",
    year: "2026",
    description:
      "1,600 sq ft Banarasi silk retail fit-out — gaddi seating zone, brass jaali facade, 3000K accent lighting.",
    cover_image_url:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
  },
] as const;

/** Fallback blog posts (mirror seed.sql). */
export const fallbackPosts = [
  {
    slug: "vastu-meets-modern-contemporary-home",
    title:
      "Vastu Meets Modern: Designing a Contemporary Home Without Compromising Tradition",
    category: "Residential Design",
    summary:
      "How we reconcile Vastu Shastra principles — entrance orientation, brahmasthan planning, kitchen placement — with open-plan modern living.",
    cover_image_url:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
    published_at: "2026-05-15",
  },
  {
    slug: "cost-to-build-house-2026",
    title: "What Does It Really Cost to Build a House in Eastern U.P. in 2026?",
    category: "Guides & Costs",
    summary:
      "A transparent breakdown of construction costs — from ₹1,800/sq ft economy builds to ₹3,500+/sq ft premium finishes.",
    cover_image_url:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80",
    published_at: "2026-06-01",
  },
  {
    slug: "haveli-restoration-diary",
    title: "Restoring a 120-Year-Old Haveli: A Conservation Diary",
    category: "Heritage & Conservation",
    summary:
      "Field notes from our ongoing haveli restoration — lime plaster instead of cement, salvaging original teak brackets.",
    cover_image_url:
      "https://images.unsplash.com/photo-1721244654394-36a7bc2da288?auto=format&fit=crop&w=1600&q=80",
    published_at: "2026-06-10",
  },
  {
    slug: "italian-marble-vs-vitrified-tiles",
    title:
      "Italian Marble vs. Vitrified Tiles: An Honest Comparison for Indian Homes",
    category: "Interiors & Materials",
    summary:
      "Statuario looks stunning, but is it right for your lifestyle? Cost, maintenance, staining, and resale perception compared.",
    cover_image_url:
      "https://images.pexels.com/photos/14583331/pexels-photo-14583331.jpeg?auto=compress&cs=tinysrgb&w=1200",
    published_at: "2026-06-20",
  },
  {
    slug: "why-3d-models-before-approval",
    title: "Why Your Architect Wants a 3D Model Before You Approve Anything",
    category: "Process & Technology",
    summary:
      "Clients who review 3D walkthroughs request far fewer changes during construction. How our drawing-versioning workflow saves you money.",
    cover_image_url:
      "https://images.unsplash.com/photo-1624066969616-69b0b0301d4d?auto=format&fit=crop&w=1600&q=80",
    published_at: "2026-07-01",
  },
  {
    slug: "retail-design-banarasi-silk-showroom",
    title:
      "Small Showroom, Big Impact: Retail Design Lessons from a Banarasi Silk Store",
    category: "Commercial",
    summary:
      "Lighting temperature sells silk — 3000K warm spots on display walls, 4000K at billing. Our design decisions for a 1,600 sq ft showroom.",
    cover_image_url:
      "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1600",
    published_at: "2026-07-05",
  },
] as const;

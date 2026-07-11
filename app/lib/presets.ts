/**
 * Interior visualizer preset taxonomy — Indian-localized per the design
 * research (docs/research/design-animation.md). Thumbnails come from the
 * verified free-image catalog.
 */

export interface PresetOption {
  value: string;
  label: string;
  thumb?: string;
}

export interface PresetDimension {
  key: string;
  label: string;
  options: PresetOption[];
}

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=200&q=70`;

export const PRESET_DIMENSIONS: PresetDimension[] = [
  {
    key: "style",
    label: "Style",
    options: [
      { value: "modern-minimal", label: "Modern Minimal", thumb: u("photo-1600607687939-ce8a6c25118c") },
      { value: "contemporary-indian", label: "Contemporary Indian", thumb: u("photo-1618221195710-dd6b41faaea6") },
      { value: "scandinavian", label: "Scandinavian", thumb: u("photo-1522708323590-d24dbb6b0267") },
      { value: "japandi", label: "Japandi", thumb: u("photo-1556911220-bff31c812dba") },
      { value: "industrial", label: "Industrial", thumb: u("photo-1497366811353-6870744d04b2") },
      { value: "traditional-indian", label: "Traditional Indian", thumb: u("photo-1541320779116-ec4a3d4692bc") },
      { value: "luxury-contemporary", label: "Luxury Contemporary", thumb: u("photo-1600489000022-c2086d79f9d4") },
      { value: "wabi-sabi", label: "Wabi-Sabi", thumb: u("photo-1615971677499-5467cbab01c0") },
    ],
  },
  {
    key: "lighting_mood",
    label: "Lighting",
    options: [
      { value: "warm-ambient", label: "Warm Ambient" },
      { value: "bright-daylight", label: "Bright Daylight" },
      { value: "golden-hour", label: "Golden Hour" },
      { value: "dramatic-accent", label: "Dramatic Accent" },
      { value: "soft-diffused", label: "Soft Diffused" },
    ],
  },
  {
    key: "flooring",
    label: "Flooring",
    options: [
      { value: "polished-marble", label: "Italian Marble" },
      { value: "light-oak-wood", label: "Light Oak" },
      { value: "walnut-wood", label: "Walnut" },
      { value: "matte-vitrified-tile", label: "Vitrified Tile" },
      { value: "terrazzo", label: "Terrazzo" },
      { value: "kota-stone", label: "Kota Stone" },
      { value: "patterned-cement-tile", label: "Cement Tile" },
    ],
  },
  {
    key: "wall_finish",
    label: "Walls",
    options: [
      { value: "matte-paint", label: "Matte Paint" },
      { value: "limewash", label: "Limewash" },
      { value: "exposed-brick", label: "Exposed Brick" },
      { value: "wood-paneling", label: "Wood Panelling" },
      { value: "textured-plaster", label: "Textured Plaster" },
    ],
  },
  {
    key: "furniture_density",
    label: "Furnishing",
    options: [
      { value: "minimal", label: "Minimal" },
      { value: "balanced", label: "Balanced" },
      { value: "fully-furnished", label: "Fully Furnished" },
    ],
  },
  {
    key: "color_scheme",
    label: "Colours",
    options: [
      { value: "warm-neutrals", label: "Warm Neutrals" },
      { value: "earthy-terracotta", label: "Earthy Terracotta" },
      { value: "monochrome", label: "Monochrome" },
      { value: "deep-greens", label: "Deep Greens" },
      { value: "indigo-brass", label: "Indigo & Brass" },
    ],
  },
];

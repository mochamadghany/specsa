export type PriceTier = {
  /** Batas atas luas (m²) untuk tier ini. null = tak terbatas (tier teratas). */
  maxArea: number | null;
  /** Harga per satuan (Rp) untuk tier ini. */
  pricePerUnit: number;
};

export type SupportingBrand = {
  name: string;
  origin: string;
};

export type Product = {
  id: string;
  img: string;
  alt: string;
  badge: string;
  name: string;
  brand: string;
  desc: string;
  priceMin: number;
  priceMax: number;
  unit: string;
  coverage: number;
  wasteFactor: number;
  calcLabel: string;
  cnc: boolean;
  categorySlug?: string;
  categoryName?: string;
  /** Pricing bertingkat berdasarkan luas (dipakai produk membrane/atap). */
  priceTiers?: PriceTier[];
  /** Catatan harga, mis. "harga final tergantung design yang disepakati". */
  priceNote?: string;
  /** Merek membrane pendukung yang ditampilkan di halaman produk. */
  supportingBrands?: SupportingBrand[];
};

/** Tier pricing standar membrane/atap: ≤200 m² → 1,2 jt; >200 m² → 1,3 jt per m². */
export const atapPriceTiers: PriceTier[] = [
  { maxArea: 200, pricePerUnit: 1200000 },
  { maxArea: null, pricePerUnit: 1300000 },
];

export const membraneSupportingBrands: SupportingBrand[] = [
  { name: "AGtex", origin: "ex Ateja — Bandung, Indonesia" },
  { name: "Sioen", origin: "Belgia" },
  { name: "Serge Ferrari", origin: "Prancis" },
];

export const staticProducts: Product[] = [
  {
    id: "tensile-architecture",
    img: "/images/product-tensile.png",
    alt: "Tensile Architecture — atap membrane bentang besar",
    badge: "Atap · Bentang Besar",
    name: "Tensile Architecture",
    brand: "Membrane premium (AGtex / Sioen / Serge Ferrari)",
    desc: "Atap membrane bentang besar untuk skala stadion, lapangan olahraga, dan area publik. Struktur tarik berkekuatan tinggi dengan perhitungan baja & software membrane.",
    priceMin: 1200000,
    priceMax: 1500000,
    unit: "m2",
    coverage: 1,
    wasteFactor: 0.08,
    calcLabel: "m2 area atap membrane",
    cnc: false,
    categorySlug: "atap",
    categoryName: "Atap",
    priceTiers: atapPriceTiers,
    priceNote:
      "Harga ditentukan berdasarkan design yang disepakati. Estimasi kalkulator memakai Rp 1,2 jt/m² (≤200 m²) dan Rp 1,3 jt/m² (>200 m²).",
    supportingBrands: membraneSupportingBrands,
  },
  {
    id: "modular-structure",
    img: "/images/product-tensile.png",
    alt: "Modular Structure — atap membrane bentang kecil",
    badge: "Atap · Bentang Kecil",
    name: "Modular Structure",
    brand: "Membrane premium (AGtex / Sioen / Serge Ferrari)",
    desc: "Atap membrane bentang kecil skala rumahan — kanopi, carport, dan area outdoor. Desain modular dengan material membrane berkualitas dan aplikasi bergaransi.",
    priceMin: 1200000,
    priceMax: 1500000,
    unit: "m2",
    coverage: 1,
    wasteFactor: 0.08,
    calcLabel: "m2 area atap membrane",
    cnc: false,
    categorySlug: "atap",
    categoryName: "Atap",
    priceTiers: atapPriceTiers,
    priceNote:
      "Harga ditentukan berdasarkan design yang disepakati. Estimasi kalkulator memakai Rp 1,2 jt/m² (≤200 m²) dan Rp 1,3 jt/m² (>200 m²).",
    supportingBrands: membraneSupportingBrands,
  },
  {
    id: "grc-board",
    img: "/images/product-grc.png",
    alt: "GRC Board Cat Specsa Vibercoat",
    badge: "Fasad · Dekoratif",
    name: "GRC Board (Cat Specsa / Vibercoat)",
    brand: "Cat Specsa / Vibercoat",
    desc: "Panel semen fiber untuk fasad, partisi, dan dekorasi, dilengkapi finishing Cat Specsa / Vibercoat.",
    priceMin: 45000,
    priceMax: 95000,
    unit: "lembar",
    coverage: 2.88,
    wasteFactor: 0.1,
    calcLabel: "m2 area dinding / fasad",
    cnc: false,
    categorySlug: "fasad",
    categoryName: "Fasad",
  },
  {
    id: "conwood",
    img: "/images/product-conwood.png",
    alt: "Conwood Dekoratif",
    badge: "Fasad · Dekoratif",
    name: "Conwood",
    brand: "Conwood",
    desc: "Alternatif kayu berbahan semen fiber, tahan cuaca & rayap. Cocok untuk fasad dekoratif dan CNC custom.",
    priceMin: 180000,
    priceMax: 350000,
    unit: "lembar",
    coverage: 0.6,
    wasteFactor: 0.12,
    calcLabel: "m2 area fasad / dinding",
    cnc: true,
    categorySlug: "fasad",
    categoryName: "Fasad",
  },
];

// Backward-compatible static export (used as fallback when DB is unavailable).
export const products: Product[] = staticProducts;

export type ProductCategoryGroup = {
  slug: string;
  name: string;
  products: Product[];
};

export function groupByCategory(items: Product[]): ProductCategoryGroup[] {
  const groups: ProductCategoryGroup[] = [];
  const index = new Map<string, ProductCategoryGroup>();

  for (const item of items) {
    const slug = item.categorySlug || "lainnya";
    const name = item.categoryName || "Produk Lainnya";
    let group = index.get(slug);
    if (!group) {
      group = { slug, name, products: [] };
      index.set(slug, group);
      groups.push(group);
    }
    group.products.push(item);
  }

  return groups;
}

/**
 * Resolusi harga per satuan berdasarkan luas untuk produk ber-tier (atap/membrane).
 * Mengembalikan null bila produk tidak memakai pricing bertingkat.
 */
export function resolveTierPrice(product: Product, area: number): number | null {
  const tiers = product.priceTiers;
  if (!tiers || tiers.length === 0) return null;
  for (const tier of tiers) {
    if (tier.maxArea === null || area <= tier.maxArea) return tier.pricePerUnit;
  }
  return tiers[tiers.length - 1].pricePerUnit;
}

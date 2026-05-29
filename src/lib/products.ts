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
};

export const staticProducts: Product[] = [
  {
    id: "seion",
    img: "/images/product-tensile.png",
    alt: "SEION Membrane Tensile",
    badge: "Membrane Tensile",
    name: "SEION Membrane",
    brand: "SEION",
    desc: "Membran tensile untuk kanopi & atap tarik dengan ketahanan cuaca tinggi.",
    priceMin: 350000,
    priceMax: 650000,
    unit: "m2",
    coverage: 1,
    wasteFactor: 0.08,
    calcLabel: "m2 area kanopi / atap membrane",
    cnc: false,
    categorySlug: "membrane-tensile",
    categoryName: "Membrane Tensile (Roofing)",
  },
  {
    id: "cg-ferrari",
    img: "/images/product-tensile.png",
    alt: "CG Ferrari Membrane Tensile",
    badge: "Membrane Tensile",
    name: "CG Ferrari Membrane",
    brand: "CG Ferrari",
    desc: "Membran premium asal Prancis untuk struktur tensile berkelas dan tahan lama.",
    priceMin: 600000,
    priceMax: 1200000,
    unit: "m2",
    coverage: 1,
    wasteFactor: 0.08,
    calcLabel: "m2 area kanopi / atap membrane",
    cnc: false,
    categorySlug: "membrane-tensile",
    categoryName: "Membrane Tensile (Roofing)",
  },
  {
    id: "agatex",
    img: "/images/product-tensile.png",
    alt: "Agatex Membrane Tensile",
    badge: "Membrane Tensile",
    name: "Agatex Membrane",
    brand: "Agatex",
    desc: "Membran tensile ekonomis dengan performa baik untuk berbagai aplikasi outdoor.",
    priceMin: 300000,
    priceMax: 550000,
    unit: "m2",
    coverage: 1,
    wasteFactor: 0.08,
    calcLabel: "m2 area kanopi / atap membrane",
    cnc: false,
    categorySlug: "membrane-tensile",
    categoryName: "Membrane Tensile (Roofing)",
  },
  {
    id: "conwood",
    img: "/images/product-conwood.png",
    alt: "Conwood Dekoratif",
    badge: "Viber Semen & Dekoratif",
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
    categorySlug: "viber-semen-decorative",
    categoryName: "Viber Semen Panel & Decorative",
  },
  {
    id: "grc-board",
    img: "/images/product-grc.png",
    alt: "GRC Board Cat Specsa Vibercoat",
    badge: "Viber Semen & Dekoratif",
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
    categorySlug: "viber-semen-decorative",
    categoryName: "Viber Semen Panel & Decorative",
  },
  {
    id: "waterproofing-system",
    img: "/images/product-bitmix.png",
    alt: "Waterproofing System",
    badge: "Waterproofing",
    name: "Waterproofing System",
    brand: "Specsa System",
    desc: "Sistem pelapis anti bocor untuk atap datar, basement, kamar mandi, dan area lembab.",
    priceMin: 85000,
    priceMax: 250000,
    unit: "m2",
    coverage: 1,
    wasteFactor: 0.15,
    calcLabel: "m2 area waterproofing",
    cnc: false,
    categorySlug: "waterproofing-system",
    categoryName: "Waterproofing System",
  },
  {
    id: "protection-solution",
    img: "/images/product-wallspan.png",
    alt: "Protection & Solution",
    badge: "Protection",
    name: "Protection & Solution",
    brand: "Specsa Solution",
    desc: "Solusi proteksi & perlindungan permukaan bangunan untuk daya tahan jangka panjang.",
    priceMin: 100000,
    priceMax: 300000,
    unit: "m2",
    coverage: 1,
    wasteFactor: 0.1,
    calcLabel: "m2 area aplikasi",
    cnc: false,
    categorySlug: "protection-solution",
    categoryName: "Protection & Solution",
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

import { RowDataPacket } from "mysql2/promise";
import { getDbPool } from "./db";
import { staticProducts, type Product } from "./products";

type ProductRow = RowDataPacket & {
  slug: string;
  name: string;
  badge: string | null;
  brand: string | null;
  short_description: string | null;
  file_url: string | null;
  alt_text: string | null;
  unit: string;
  coverage: string;
  price_min: string;
  price_max: string;
  waste_factor: string;
  calc_label: string | null;
  has_cnc_option: number;
};

export async function getProducts(): Promise<Product[]> {
  try {
    const db = getDbPool();
    const [rows] = await db.query<ProductRow[]>(
      `SELECT p.slug, p.name, p.badge, p.brand, p.short_description,
        m.file_url, m.alt_text, p.unit, p.coverage, p.price_min, p.price_max,
        p.waste_factor, p.calc_label, p.has_cnc_option
       FROM products p
       LEFT JOIN media_assets m ON m.id = p.main_media_id
       WHERE p.is_published = 1
       ORDER BY p.sort_order, p.id`
    );

    if (!rows.length) return staticProducts;

    return rows.map((row) => ({
      id: row.slug,
      img: row.file_url || "/images/product-grc.png",
      alt: row.alt_text || row.name,
      badge: row.badge || "",
      name: row.name,
      brand: row.brand || "",
      desc: row.short_description || "",
      priceMin: Number(row.price_min || 0),
      priceMax: Number(row.price_max || 0),
      unit: row.unit || "unit",
      coverage: Number(row.coverage || 1) || 1,
      wasteFactor: Number(row.waste_factor || 0),
      calcLabel: row.calc_label || "m2 area proyek",
      cnc: Boolean(row.has_cnc_option),
    }));
  } catch {
    return staticProducts;
  }
}

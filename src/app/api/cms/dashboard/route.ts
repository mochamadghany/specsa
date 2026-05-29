import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { isCmsRequestAuthorized } from "@/lib/cms-auth";
import { getDbPool } from "@/lib/db";

export const dynamic = "force-dynamic";

type SettingRow = RowDataPacket & {
  setting_key: string;
  setting_value: string | null;
};

type PageRow = RowDataPacket & {
  id: number;
  slug: string;
  nav_label: string;
  eyebrow: string | null;
  title: string;
  lead_text: string | null;
  hero_media_id: number | null;
  cta_label: string | null;
  cta_href: string | null;
  template: string;
  sort_order: number;
  is_nav_visible: number;
  is_published: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_path: string | null;
  og_media_id: number | null;
};

type SectionRow = RowDataPacket & {
  id: number;
  page_id: number;
  section_key: string | null;
  eyebrow: string | null;
  title: string;
  body: string | null;
  media_id: number | null;
  layout: string;
  sort_order: number;
  is_published: number;
};

type ItemRow = RowDataPacket & {
  id: number;
  section_id: number;
  title: string | null;
  body: string | null;
  icon: string | null;
  media_id: number | null;
  href: string | null;
  sort_order: number;
  is_published: number;
};

type MediaRow = RowDataPacket & {
  id: number;
  title: string;
  alt_text: string | null;
  file_url: string;
  usage_type: string;
  sort_order: number;
  is_active: number;
};

type ProductRow = RowDataPacket & {
  id: number;
  category_id: number | null;
  slug: string;
  name: string;
  badge: string | null;
  brand: string | null;
  short_description: string | null;
  main_media_id: number | null;
  unit: string;
  coverage: string;
  price_min: string;
  price_max: string;
  waste_factor: string;
  calc_label: string | null;
  has_cnc_option: number;
  sort_order: number;
  is_featured: number;
  is_published: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
};

type ProjectRow = RowDataPacket & {
  id: number;
  slug: string;
  title: string;
  tag: string | null;
  client_name: string | null;
  location: string | null;
  year: string | null;
  description: string | null;
  main_media_id: number | null;
  sort_order: number;
  is_featured: number;
  is_published: number;
};

type ContactSubmissionRow = RowDataPacket & {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  product_interest: string | null;
  message: string | null;
  source_page: string | null;
  status: "new" | "contacted" | "quoted" | "closed" | "spam";
  created_at: string;
  updated_at: string;
};

type DashboardPayload = {
  settings: Record<string, string>;
  media: MediaRow[];
  pages: Array<PageRow & { sections: Array<SectionRow & { items: ItemRow[] }> }>;
  products: ProductRow[];
  projects: ProjectRow[];
  contactSubmissions: ContactSubmissionRow[];
};

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

type DeleteEntity = "page" | "product" | "project" | "media";

function isDeleteEntity(value: unknown): value is DeleteEntity {
  return value === "page" || value === "product" || value === "project" || value === "media";
}

export async function GET(request: NextRequest) {
  if (!isCmsRequestAuthorized(request)) return unauthorized();

  try {
    const db = getDbPool();
    const [settingsRows] = await db.query<SettingRow[]>(
      "SELECT setting_key, setting_value FROM site_settings ORDER BY group_name, setting_key"
    );
    const [media] = await db.query<MediaRow[]>(
      "SELECT id, title, alt_text, file_url, usage_type, sort_order, is_active FROM media_assets ORDER BY usage_type, sort_order, id"
    );
    const [pages] = await db.query<PageRow[]>(
      `SELECT p.id, p.slug, p.nav_label, p.eyebrow, p.title, p.lead_text, p.hero_media_id,
        p.cta_label, p.cta_href, p.template, p.sort_order, p.is_nav_visible, p.is_published,
        s.meta_title, s.meta_description, s.meta_keywords, s.canonical_path, s.og_media_id
       FROM pages p
       LEFT JOIN seo_metadata s ON s.entity_type = 'page' AND s.entity_id = p.id
       ORDER BY p.sort_order, p.id`
    );
    const [sections] = await db.query<SectionRow[]>(
      "SELECT id, page_id, section_key, eyebrow, title, body, media_id, layout, sort_order, is_published FROM page_sections ORDER BY page_id, sort_order, id"
    );
    const [items] = await db.query<ItemRow[]>(
      "SELECT id, section_id, title, body, icon, media_id, href, sort_order, is_published FROM section_items ORDER BY section_id, sort_order, id"
    );
    const [products] = await db.query<ProductRow[]>(
      `SELECT p.id, p.category_id, p.slug, p.name, p.badge, p.brand, p.short_description,
        p.main_media_id, p.unit, p.coverage, p.price_min, p.price_max, p.waste_factor,
        p.calc_label, p.has_cnc_option, p.sort_order, p.is_featured, p.is_published,
        s.meta_title, s.meta_description, s.meta_keywords
       FROM products p
       LEFT JOIN seo_metadata s ON s.entity_type = 'product' AND s.entity_id = p.id
       ORDER BY p.sort_order, p.id`
    );
    const [projects] = await db.query<ProjectRow[]>(
      `SELECT id, slug, title, tag, client_name, location, year, description,
        main_media_id, sort_order, is_featured, is_published
       FROM projects
       ORDER BY sort_order, id`
    );
    const [contactSubmissions] = await db.query<ContactSubmissionRow[]>(
      `SELECT id, name, phone, email, product_interest, message, source_page, status,
        DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.000Z') AS created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.000Z') AS updated_at
       FROM contact_submissions
       ORDER BY created_at DESC, id DESC
       LIMIT 100`
    );

    const itemMap = new Map<number, ItemRow[]>();
    items.forEach((item) => {
      const list = itemMap.get(item.section_id) || [];
      list.push(item);
      itemMap.set(item.section_id, list);
    });

    const sectionMap = new Map<number, Array<SectionRow & { items: ItemRow[] }>>();
    sections.forEach((section) => {
      const list = sectionMap.get(section.page_id) || [];
      list.push({ ...section, items: itemMap.get(section.id) || [] });
      sectionMap.set(section.page_id, list);
    });

    const settings = Object.fromEntries(
      settingsRows.map((row) => [row.setting_key, row.setting_value || ""])
    );

    return NextResponse.json({
      settings,
      media,
      pages: pages.map((page) => ({ ...page, sections: sectionMap.get(page.id) || [] })),
      products,
      projects,
      contactSubmissions,
    } satisfies DashboardPayload);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Database error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isCmsRequestAuthorized(request)) return unauthorized();

  const body = (await request.json().catch(() => null)) as DashboardPayload | null;
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const db = getDbPool();
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    for (const [key, value] of Object.entries(body.settings || {})) {
      await conn.execute(
        `INSERT INTO site_settings (setting_key, setting_value, value_type, group_name)
         VALUES (?, ?, 'text', 'general')
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, value]
      );
    }

    for (const media of body.media || []) {
      await conn.execute(
        `UPDATE media_assets
         SET title = ?, alt_text = ?, file_url = ?, usage_type = ?, sort_order = ?, is_active = ?
         WHERE id = ?`,
        [
          media.title,
          media.alt_text,
          media.file_url,
          media.usage_type,
          Number(media.sort_order || 0),
          media.is_active ? 1 : 0,
          media.id,
        ]
      );
    }

    for (const page of body.pages || []) {
      await conn.execute(
        `UPDATE pages
         SET slug = ?, nav_label = ?, eyebrow = ?, title = ?, lead_text = ?, hero_media_id = ?,
             cta_label = ?, cta_href = ?, template = ?, sort_order = ?, is_nav_visible = ?, is_published = ?
         WHERE id = ?`,
        [
          page.slug,
          page.nav_label,
          page.eyebrow,
          page.title,
          page.lead_text,
          page.hero_media_id || null,
          page.cta_label,
          page.cta_href,
          page.template,
          Number(page.sort_order || 0),
          page.is_nav_visible ? 1 : 0,
          page.is_published ? 1 : 0,
          page.id,
        ]
      );

      await conn.execute(
        `INSERT INTO seo_metadata (entity_type, entity_id, canonical_path, meta_title, meta_description, meta_keywords, og_media_id)
         VALUES ('page', ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE canonical_path = VALUES(canonical_path),
           meta_title = VALUES(meta_title), meta_description = VALUES(meta_description),
           meta_keywords = VALUES(meta_keywords), og_media_id = VALUES(og_media_id)`,
        [
          page.id,
          page.canonical_path || `/${page.slug}`,
          page.meta_title || page.title,
          page.meta_description || page.lead_text,
          page.meta_keywords || "",
          page.og_media_id || page.hero_media_id || null,
        ]
      );

      for (const section of page.sections || []) {
        let sectionId = section.id;
        if (sectionId) {
          await conn.execute(
            `UPDATE page_sections
             SET section_key = ?, eyebrow = ?, title = ?, body = ?, media_id = ?, layout = ?,
                 sort_order = ?, is_published = ?
             WHERE id = ? AND page_id = ?`,
            [
              section.section_key,
              section.eyebrow,
              section.title,
              section.body,
              section.media_id || null,
              section.layout,
              Number(section.sort_order || 0),
              section.is_published ? 1 : 0,
              sectionId,
              page.id,
            ]
          );
        } else {
          const [result] = await conn.execute<ResultSetHeader>(
            `INSERT INTO page_sections
             (page_id, section_key, eyebrow, title, body, media_id, layout, sort_order, is_published)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              page.id,
              section.section_key,
              section.eyebrow,
              section.title,
              section.body,
              section.media_id || null,
              section.layout || "text",
              Number(section.sort_order || 0),
              section.is_published ? 1 : 0,
            ]
          );
          sectionId = result.insertId;
        }

        await conn.execute("DELETE FROM section_items WHERE section_id = ?", [sectionId]);
        const sectionItems = section.items || [];
        for (let index = 0; index < sectionItems.length; index += 1) {
          const item = sectionItems[index];
          await conn.execute(
            `INSERT INTO section_items
             (section_id, title, body, icon, media_id, href, sort_order, is_published)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              sectionId,
              item.title,
              item.body,
              item.icon,
              item.media_id || null,
              item.href,
              Number(item.sort_order ?? index),
              item.is_published ? 1 : 0,
            ]
          );
        }
      }
    }

    for (const product of body.products || []) {
      const existingId = Number(product.id);
      const isExisting = Number.isFinite(existingId) && existingId > 0;
      let productId = existingId;

      if (isExisting) {
        await conn.execute(
          `UPDATE products
           SET category_id = ?, slug = ?, name = ?, badge = ?, brand = ?, short_description = ?,
               main_media_id = ?, unit = ?, coverage = ?, price_min = ?, price_max = ?,
               waste_factor = ?, calc_label = ?, has_cnc_option = ?, sort_order = ?,
               is_featured = ?, is_published = ?
           WHERE id = ?`,
          [
            product.category_id || null,
            product.slug,
            product.name,
            product.badge,
            product.brand,
            product.short_description,
            product.main_media_id || null,
            product.unit,
            Number(product.coverage || 1),
            Number(product.price_min || 0),
            Number(product.price_max || 0),
            Number(product.waste_factor || 0),
            product.calc_label,
            product.has_cnc_option ? 1 : 0,
            Number(product.sort_order || 0),
            product.is_featured ? 1 : 0,
            product.is_published ? 1 : 0,
            existingId,
          ]
        );
      } else {
        const [result] = await conn.execute<ResultSetHeader>(
          `INSERT INTO products
           (category_id, slug, name, badge, brand, short_description, main_media_id, unit,
            coverage, price_min, price_max, waste_factor, calc_label, has_cnc_option,
            sort_order, is_featured, is_published)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            product.category_id || null,
            product.slug,
            product.name,
            product.badge,
            product.brand,
            product.short_description,
            product.main_media_id || null,
            product.unit,
            Number(product.coverage || 1),
            Number(product.price_min || 0),
            Number(product.price_max || 0),
            Number(product.waste_factor || 0),
            product.calc_label,
            product.has_cnc_option ? 1 : 0,
            Number(product.sort_order || 0),
            product.is_featured ? 1 : 0,
            product.is_published ? 1 : 0,
          ]
        );
        productId = result.insertId;
      }

      await conn.execute(
        `INSERT INTO seo_metadata (entity_type, entity_id, canonical_path, meta_title, meta_description, meta_keywords, og_media_id)
         VALUES ('product', ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE canonical_path = VALUES(canonical_path),
           meta_title = VALUES(meta_title), meta_description = VALUES(meta_description),
           meta_keywords = VALUES(meta_keywords), og_media_id = VALUES(og_media_id)`,
        [
          productId,
          `/produk#product-${product.slug}`,
          product.meta_title || product.name,
          product.meta_description || product.short_description,
          product.meta_keywords || "",
          product.main_media_id || null,
        ]
      );
    }

    for (const project of body.projects || []) {
      if (project.id) {
        await conn.execute(
          `UPDATE projects
           SET slug = ?, title = ?, tag = ?, client_name = ?, location = ?, year = ?,
               description = ?, main_media_id = ?, sort_order = ?, is_featured = ?, is_published = ?
           WHERE id = ?`,
          [
            project.slug,
            project.title,
            project.tag,
            project.client_name,
            project.location,
            project.year,
            project.description,
            project.main_media_id || null,
            Number(project.sort_order || 0),
            project.is_featured ? 1 : 0,
            project.is_published ? 1 : 0,
            project.id,
          ]
        );
      } else {
        await conn.execute(
          `INSERT INTO projects
           (slug, title, tag, client_name, location, year, description, main_media_id, sort_order, is_featured, is_published)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            project.slug,
            project.title,
            project.tag,
            project.client_name,
            project.location,
            project.year,
            project.description,
            project.main_media_id || null,
            Number(project.sort_order || 0),
            project.is_featured ? 1 : 0,
            project.is_published ? 1 : 0,
          ]
        );
      }
    }

    for (const submission of body.contactSubmissions || []) {
      await conn.execute(
        "UPDATE contact_submissions SET status = ? WHERE id = ?",
        [submission.status, submission.id]
      );
    }

    await conn.commit();
    return NextResponse.json({ ok: true });
  } catch (error) {
    await conn.rollback();
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Save failed" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}

export async function DELETE(request: NextRequest) {
  if (!isCmsRequestAuthorized(request)) return unauthorized();

  const body = (await request.json().catch(() => null)) as
    | { entity?: unknown; id?: unknown }
    | null;
  const id = Number(body?.id);

  if (!isDeleteEntity(body?.entity) || !Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid delete request" }, { status: 400 });
  }

  const db = getDbPool();
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    if (body.entity === "page") {
      await conn.execute("DELETE FROM seo_metadata WHERE entity_type = 'page' AND entity_id = ?", [id]);
      await conn.execute("DELETE FROM pages WHERE id = ?", [id]);
    }

    if (body.entity === "product") {
      await conn.execute("DELETE FROM seo_metadata WHERE entity_type = 'product' AND entity_id = ?", [id]);
      await conn.execute("DELETE FROM products WHERE id = ?", [id]);
    }

    if (body.entity === "project") {
      await conn.execute("DELETE FROM seo_metadata WHERE entity_type = 'project' AND entity_id = ?", [id]);
      await conn.execute("DELETE FROM projects WHERE id = ?", [id]);
    }

    if (body.entity === "media") {
      await conn.execute("DELETE FROM media_assets WHERE id = ?", [id]);
    }

    await conn.commit();
    return NextResponse.json({ ok: true });
  } catch (error) {
    await conn.rollback();
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}

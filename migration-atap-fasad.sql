-- Specsa migration: restrukturisasi produk -> kategori Atap & Fasad
-- Target: MySQL 8+ / MariaDB 10.5+
-- Jalankan SETELAH schema.sql dan migration-products-social.sql.
-- Import dari hPanel/phpMyAdmin. Aman dijalankan ulang (idempotent).
--
-- Ringkasan perubahan:
--   * Kategori baru: Atap (id 1) & Fasad (id 2). Kategori lama dinonaktifkan.
--   * Produk Atap: Tensile Architecture (bentang besar) & Modular Structure
--     (bentang kecil). Harga indikatif 1,2-1,5 jt/m2 (final tergantung design).
--   * Fasad: GRC Board & Conwood (dekoratif).
--   * Produk lama (membrane brand, waterproofing, protection) disembunyikan
--     (is_published = 0) — data tetap ada, tidak tampil di publik.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ---------------------------------------------------------------------------
-- 1. Kategori: reuse id 1 -> Atap, id 2 -> Fasad. Nonaktifkan id 3,4,5.
-- ---------------------------------------------------------------------------
INSERT INTO product_categories (id, slug, name, description, sort_order, is_active) VALUES
(1, 'atap', 'Atap', 'Solusi atap membrane: tensile architecture (bentang besar) & modular structure (bentang kecil).', 1, 1),
(2, 'fasad', 'Fasad', 'Material fasad & dekoratif: GRC Board dan Conwood.', 2, 1)
ON DUPLICATE KEY UPDATE
  slug = VALUES(slug),
  name = VALUES(name),
  description = VALUES(description),
  sort_order = VALUES(sort_order),
  is_active = VALUES(is_active);

UPDATE product_categories SET is_active = 0 WHERE id IN (3, 4, 5);

-- ---------------------------------------------------------------------------
-- 2. Sembunyikan produk lama (data tetap tersimpan).
--    seion, cg-ferrari, agatex, waterproofing-system, protection-solution.
-- ---------------------------------------------------------------------------
UPDATE products
SET is_published = 0, is_featured = 0
WHERE slug IN ('seion', 'cg-ferrari', 'agatex', 'waterproofing-system', 'protection-solution');

-- ---------------------------------------------------------------------------
-- 3. Recategorize produk Fasad yang sudah ada.
--    Conwood (id 4) & GRC Board (id 5) -> kategori Fasad (id 2).
-- ---------------------------------------------------------------------------
UPDATE products
SET category_id = 2, badge = 'Fasad · Dekoratif', sort_order = 3, is_featured = 1, is_published = 1
WHERE slug = 'conwood';

UPDATE products
SET category_id = 2, badge = 'Fasad · Dekoratif', sort_order = 4, is_featured = 1, is_published = 1
WHERE slug = 'grc-board';

-- ---------------------------------------------------------------------------
-- 4. Produk Atap baru (ids 8 & 9). main_media_id 14 = gambar tensile.
--    Harga indikatif 1,2-1,5 jt/m2; tier pricing dihitung di aplikasi.
-- ---------------------------------------------------------------------------
INSERT INTO products
(id, category_id, slug, name, badge, brand, short_description, main_media_id, unit, coverage, price_min, price_max, waste_factor, calc_label, has_cnc_option, sort_order, is_featured, is_published)
VALUES
(8, 1, 'tensile-architecture', 'Tensile Architecture', 'Atap · Bentang Besar', 'Membrane premium (AGtex / Sioen / Serge Ferrari)', 'Atap membrane bentang besar untuk skala stadion, lapangan olahraga, dan area publik. Struktur tarik berkekuatan tinggi dengan perhitungan baja & software membrane.', 14, 'm2', 1.0000, 1200000, 1500000, 0.0800, 'm2 area atap membrane', 0, 1, 1, 1),
(9, 1, 'modular-structure', 'Modular Structure', 'Atap · Bentang Kecil', 'Membrane premium (AGtex / Sioen / Serge Ferrari)', 'Atap membrane bentang kecil skala rumahan — kanopi, carport, dan area outdoor. Desain modular dengan material membrane berkualitas dan aplikasi bergaransi.', 14, 'm2', 1.0000, 1200000, 1500000, 0.0800, 'm2 area atap membrane', 0, 2, 1, 1)
ON DUPLICATE KEY UPDATE
  category_id = VALUES(category_id),
  slug = VALUES(slug),
  name = VALUES(name),
  badge = VALUES(badge),
  brand = VALUES(brand),
  short_description = VALUES(short_description),
  main_media_id = VALUES(main_media_id),
  unit = VALUES(unit),
  coverage = VALUES(coverage),
  price_min = VALUES(price_min),
  price_max = VALUES(price_max),
  waste_factor = VALUES(waste_factor),
  calc_label = VALUES(calc_label),
  has_cnc_option = VALUES(has_cnc_option),
  sort_order = VALUES(sort_order),
  is_featured = VALUES(is_featured),
  is_published = VALUES(is_published);

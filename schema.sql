-- Specsa Website CMS schema
-- Target: MySQL 8+ / MariaDB 10.5+
-- Import this file from hPanel/phpMyAdmin, then point the app CMS to these tables
-- when database-backed content is implemented.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS cms_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') NOT NULL DEFAULT 'admin',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cms_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  setting_key VARCHAR(120) NOT NULL,
  setting_value TEXT NULL,
  value_type ENUM('text', 'number', 'boolean', 'json', 'url', 'email', 'phone') NOT NULL DEFAULT 'text',
  group_name VARCHAR(80) NOT NULL DEFAULT 'general',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_site_settings_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media_assets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(190) NOT NULL,
  alt_text VARCHAR(255) NULL,
  file_url VARCHAR(500) NOT NULL,
  file_path VARCHAR(500) NULL,
  mime_type VARCHAR(120) NULL,
  file_size BIGINT UNSIGNED NULL,
  width INT UNSIGNED NULL,
  height INT UNSIGNED NULL,
  usage_type ENUM('hero', 'product', 'project', 'team', 'seo', 'general') NOT NULL DEFAULT 'general',
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_media_usage_active (usage_type, is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(120) NOT NULL,
  nav_label VARCHAR(120) NOT NULL,
  eyebrow VARCHAR(160) NULL,
  title VARCHAR(255) NOT NULL,
  lead_text TEXT NULL,
  hero_media_id BIGINT UNSIGNED NULL,
  cta_label VARCHAR(160) NULL,
  cta_href VARCHAR(500) NULL,
  template ENUM('default', 'products', 'projects', 'contact') NOT NULL DEFAULT 'default',
  sort_order INT NOT NULL DEFAULT 0,
  is_nav_visible TINYINT(1) NOT NULL DEFAULT 1,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pages_slug (slug),
  KEY idx_pages_nav (is_nav_visible, sort_order),
  CONSTRAINT fk_pages_hero_media
    FOREIGN KEY (hero_media_id) REFERENCES media_assets(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS seo_metadata (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  entity_type ENUM('site', 'page', 'product', 'project', 'service') NOT NULL,
  entity_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
  canonical_path VARCHAR(500) NULL,
  meta_title VARCHAR(255) NOT NULL,
  meta_description TEXT NULL,
  meta_keywords TEXT NULL,
  og_title VARCHAR(255) NULL,
  og_description TEXT NULL,
  og_media_id BIGINT UNSIGNED NULL,
  robots VARCHAR(120) NOT NULL DEFAULT 'index,follow',
  schema_json JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_seo_entity (entity_type, entity_id),
  KEY idx_seo_entity_type (entity_type),
  CONSTRAINT fk_seo_og_media
    FOREIGN KEY (og_media_id) REFERENCES media_assets(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS page_sections (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  page_id BIGINT UNSIGNED NOT NULL,
  section_key VARCHAR(120) NULL,
  eyebrow VARCHAR(160) NULL,
  title VARCHAR(255) NOT NULL,
  body LONGTEXT NULL,
  media_id BIGINT UNSIGNED NULL,
  layout ENUM('text', 'text_media', 'cards', 'list', 'gallery', 'contact_form') NOT NULL DEFAULT 'text',
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sections_page_order (page_id, sort_order),
  CONSTRAINT fk_sections_page
    FOREIGN KEY (page_id) REFERENCES pages(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_sections_media
    FOREIGN KEY (media_id) REFERENCES media_assets(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS section_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  section_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NULL,
  body TEXT NULL,
  icon VARCHAR(120) NULL,
  media_id BIGINT UNSIGNED NULL,
  href VARCHAR(500) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_section_items_order (section_id, sort_order),
  CONSTRAINT fk_items_section
    FOREIGN KEY (section_id) REFERENCES page_sections(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_items_media
    FOREIGN KEY (media_id) REFERENCES media_assets(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(120) NOT NULL,
  name VARCHAR(190) NOT NULL,
  description TEXT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_product_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NULL,
  slug VARCHAR(120) NOT NULL,
  name VARCHAR(190) NOT NULL,
  badge VARCHAR(120) NULL,
  brand VARCHAR(190) NULL,
  short_description TEXT NULL,
  description LONGTEXT NULL,
  main_media_id BIGINT UNSIGNED NULL,
  unit VARCHAR(80) NOT NULL DEFAULT 'm2',
  coverage DECIMAL(12,4) NOT NULL DEFAULT 1.0000,
  price_min DECIMAL(16,2) NOT NULL DEFAULT 0.00,
  price_max DECIMAL(16,2) NOT NULL DEFAULT 0.00,
  waste_factor DECIMAL(6,4) NOT NULL DEFAULT 0.1000,
  calc_label VARCHAR(190) NULL,
  has_cnc_option TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  KEY idx_products_category (category_id, sort_order),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES product_categories(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_products_main_media
    FOREIGN KEY (main_media_id) REFERENCES media_assets(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_media (
  product_id BIGINT UNSIGNED NOT NULL,
  media_id BIGINT UNSIGNED NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, media_id),
  CONSTRAINT fk_product_media_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_product_media_media
    FOREIGN KEY (media_id) REFERENCES media_assets(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_specs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  label VARCHAR(190) NOT NULL,
  value_text TEXT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_product_specs_order (product_id, sort_order),
  CONSTRAINT fk_product_specs_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_applications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(190) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_product_applications_order (product_id, sort_order),
  CONSTRAINT fk_product_applications_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS services (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(120) NOT NULL,
  title VARCHAR(190) NOT NULL,
  description TEXT NULL,
  media_id BIGINT UNSIGNED NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_services_slug (slug),
  KEY idx_services_order (sort_order),
  CONSTRAINT fk_services_media
    FOREIGN KEY (media_id) REFERENCES media_assets(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(120) NOT NULL,
  title VARCHAR(190) NOT NULL,
  tag VARCHAR(120) NULL,
  client_name VARCHAR(190) NULL,
  location VARCHAR(190) NULL,
  year VARCHAR(20) NULL,
  description TEXT NULL,
  main_media_id BIGINT UNSIGNED NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_projects_slug (slug),
  KEY idx_projects_order (sort_order),
  CONSTRAINT fk_projects_main_media
    FOREIGN KEY (main_media_id) REFERENCES media_assets(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hero_slides (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  media_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(190) NULL,
  subtitle TEXT NULL,
  href VARCHAR(500) NULL,
  usage_scope ENUM('home', 'detail_random', 'all') NOT NULL DEFAULT 'home',
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_hero_media_scope (media_id, usage_scope),
  KEY idx_hero_scope_active (usage_scope, is_active, sort_order),
  CONSTRAINT fk_hero_slides_media
    FOREIGN KEY (media_id) REFERENCES media_assets(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(190) NOT NULL,
  phone VARCHAR(80) NULL,
  email VARCHAR(190) NULL,
  product_interest VARCHAR(190) NULL,
  message TEXT NULL,
  source_page VARCHAR(190) NULL,
  status ENUM('new', 'contacted', 'quoted', 'closed', 'spam') NOT NULL DEFAULT 'new',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed: site settings
INSERT INTO site_settings (setting_key, setting_value, value_type, group_name) VALUES
('site_name', 'PT. Specsa Solusi Pratama', 'text', 'general'),
('site_url', 'https://specsa.id', 'url', 'general'),
('phone', '0812 105 1526', 'phone', 'contact'),
('whatsapp', '6281210511526', 'phone', 'contact'),
('email', 'info@specsa.id', 'email', 'contact'),
('address', 'Ruko Bintaro Terrace 2 No.7, Jl. Sumatera, Ciputat, Tangerang Selatan 15414', 'text', 'contact')
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  value_type = VALUES(value_type),
  group_name = VALUES(group_name);

-- Seed: media assets
INSERT INTO media_assets (id, title, alt_text, file_url, usage_type, sort_order) VALUES
(1, 'Hero 1', 'Specsa project hero 1', '/images/hero (1).png', 'hero', 1),
(2, 'Hero 2', 'Specsa project hero 2', '/images/hero (2).png', 'hero', 2),
(3, 'Hero 3', 'Specsa project hero 3', '/images/hero (3).png', 'hero', 3),
(4, 'Hero 4', 'Specsa project hero 4', '/images/hero (4).png', 'hero', 4),
(5, 'Hero 5', 'Specsa project hero 5', '/images/hero (5).png', 'hero', 5),
(6, 'Hero 6', 'Specsa project hero 6', '/images/hero (6).png', 'hero', 6),
(7, 'Hero 7', 'Specsa project hero 7', '/images/hero (7).png', 'hero', 7),
(8, 'Hero 8', 'Specsa project hero 8', '/images/hero (8).png', 'hero', 8),
(9, 'Hero Original', 'Specsa project hero', '/images/hero.png', 'hero', 9),
(10, 'About', 'Tim Specsa', '/images/about.png', 'general', 10),
(11, 'GRC Board', 'GRC Board', '/images/product-grc.png', 'product', 11),
(12, 'Conwood', 'Conwood Dekoratif', '/images/product-conwood.png', 'product', 12),
(13, 'Waterproofing Bitmix', 'Bitmix Waterproofing', '/images/product-bitmix.png', 'product', 13),
(14, 'Tensile Membrane', 'Tensile Membrane', '/images/product-tensile.png', 'product', 14),
(15, 'Fasad Metal Wallspan', 'Wallspan GKD Fasad Metal', '/images/product-wallspan.png', 'product', 15),
(16, 'Tegola + Gerfloor', 'Genteng Bitumen Tegola', '/images/product-tegola.png', 'product', 16),
(17, 'Fly Over Agung Sedayu', 'Fly Over Agung Sedayu', '/images/project-flyover.png', 'project', 17),
(18, 'International Finance Center', 'International Finance Center', '/images/project-ifc.png', 'project', 18),
(19, 'Universitas Negeri Jakarta', 'Universitas Negeri Jakarta', '/images/project-unj.png', 'project', 19),
(20, 'Bina Karsa Office Kuningan', 'Bina Karsa Office Kuningan', '/images/project-bkk.png', 'project', 20)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  alt_text = VALUES(alt_text),
  file_url = VALUES(file_url),
  usage_type = VALUES(usage_type),
  sort_order = VALUES(sort_order);

-- Seed: hero slides
INSERT INTO hero_slides (media_id, usage_scope, sort_order, is_active)
SELECT id, 'all', sort_order, 1
FROM media_assets
WHERE usage_type = 'hero'
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);

-- Seed: pages
INSERT INTO pages (id, slug, nav_label, eyebrow, title, lead_text, hero_media_id, cta_label, cta_href, template, sort_order) VALUES
(1, 'tentang', 'Tentang', 'Tentang Specsa', 'Mitra pengadaan material untuk proyek yang butuh kepastian.', 'Specsa membantu kontraktor, developer, instansi, dan industri mendapatkan material bangunan berkualitas dengan proses yang responsif, transparan, dan tepat waktu.', 10, 'Konsultasi kebutuhan proyek', '/kontak', 'default', 1),
(2, 'produk', 'Produk', 'Katalog Produk', 'Material proyek dari brand terpercaya, siap dikirim ke lokasi.', 'Temukan GRC Board, Conwood, Waterproofing Bitmix, Tensile Membrane, Fasad Metal Wallspan, Tegola, dan Gerfloor untuk kebutuhan proyek Anda.', 11, 'Minta rekomendasi produk', '/kontak', 'products', 2),
(3, 'layanan', 'Layanan', 'Layanan Pengadaan', 'Pengadaan material yang mudah dikendalikan dari awal sampai kirim.', 'Kami mendampingi proses pemilihan produk, penawaran, dokumentasi, sampai pengiriman material ke lokasi proyek.', 20, 'Mulai proses penawaran', '/kontak', 'default', 3),
(4, 'proyek', 'Proyek', 'Portfolio Proyek', 'Material Specsa telah mendukung proyek fasad dan infrastruktur.', 'Dari gedung komersial hingga fasilitas publik, kami membantu menyediakan material yang sesuai spesifikasi dan jadwal proyek.', 17, 'Diskusikan proyek Anda', '/kontak', 'projects', 4),
(5, 'kontak', 'Kontak', 'Hubungi Specsa', 'Mulai kebutuhan material proyek Anda bersama tim Specsa.', 'Kirim kebutuhan produk, volume, lokasi, dan target jadwal. Tim kami akan membantu menyiapkan rekomendasi dan penawaran.', 9, 'Chat via WhatsApp', 'https://wa.me/6281210511526', 'contact', 5)
ON DUPLICATE KEY UPDATE
  nav_label = VALUES(nav_label),
  eyebrow = VALUES(eyebrow),
  title = VALUES(title),
  lead_text = VALUES(lead_text),
  hero_media_id = VALUES(hero_media_id),
  cta_label = VALUES(cta_label),
  cta_href = VALUES(cta_href),
  template = VALUES(template),
  sort_order = VALUES(sort_order);

-- Seed: SEO
INSERT INTO seo_metadata (entity_type, entity_id, canonical_path, meta_title, meta_description, meta_keywords, og_title, og_description) VALUES
('site', NULL, '/', 'PT. Specsa Solusi Pratama - Supplier Material Bangunan Tangerang Selatan', 'Supplier material bangunan untuk kontraktor, developer, industri, dan retail di Jabodetabek.', 'supplier material bangunan, GRC board, conwood, bitmix, tensile membrane, wallspan, tegola, gerfloor', 'PT. Specsa Solusi Pratama - Trusted Building Material Partner', 'Material berkualitas untuk proyek konstruksi, developer, dan industri.'),
('page', 1, '/tentang', 'Tentang Specsa - Supplier Material Bangunan Tangerang Selatan', 'Kenali PT. Specsa Solusi Pratama, supplier material bangunan untuk kontraktor, developer, instansi, dan industri di Jabodetabek.', 'tentang specsa, supplier material bangunan tangerang selatan, pengadaan material proyek', NULL, NULL),
('page', 2, '/produk', 'Produk Material Bangunan - GRC, Conwood, Bitmix, Tensile', 'Katalog produk Specsa: GRC Board, Conwood, Waterproofing Bitmix, Tensile Membrane, Wallspan, Tegola, dan Gerfloor.', 'GRC board, Conwood, Bitmix, Tensile Membrane, Wallspan GKD, Tegola, Gerfloor', NULL, NULL),
('page', 3, '/layanan', 'Layanan Pengadaan Material Proyek - Specsa', 'Layanan pengadaan material proyek, konsultasi produk, penawaran, dan pengiriman untuk kontraktor, developer, dan instansi.', 'layanan pengadaan material, supplier proyek, konsultasi material bangunan, pengiriman material jabodetabek', NULL, NULL),
('page', 4, '/proyek', 'Portfolio Proyek - Specsa Solusi Pratama', 'Lihat proyek fasad, infrastruktur, dan komersial yang didukung oleh material dari PT. Specsa Solusi Pratama.', 'portfolio specsa, proyek fasad metal, GKD metal mesh, tensile membrane, supplier proyek', NULL, NULL),
('page', 5, '/kontak', 'Kontak Specsa - Minta Penawaran Material Bangunan', 'Hubungi Specsa untuk konsultasi produk, harga material bangunan, dan pengiriman proyek di Jabodetabek.', 'kontak specsa, minta penawaran material, supplier bangunan tangerang selatan', NULL, NULL)
ON DUPLICATE KEY UPDATE
  canonical_path = VALUES(canonical_path),
  meta_title = VALUES(meta_title),
  meta_description = VALUES(meta_description),
  meta_keywords = VALUES(meta_keywords),
  og_title = VALUES(og_title),
  og_description = VALUES(og_description);

-- Seed: product categories and products
INSERT INTO product_categories (id, slug, name, sort_order) VALUES
(1, 'fiber-cement', 'Fiber Cement', 1),
(2, 'waterproofing', 'Waterproofing', 2),
(3, 'membrane-structure', 'Membrane Structure', 3),
(4, 'facade-metal', 'Facade Metal', 4),
(5, 'roofing-flooring', 'Roofing & Flooring', 5)
ON DUPLICATE KEY UPDATE name = VALUES(name), sort_order = VALUES(sort_order);

INSERT INTO products
(id, category_id, slug, name, badge, brand, short_description, main_media_id, unit, coverage, price_min, price_max, waste_factor, calc_label, has_cnc_option, sort_order, is_featured)
VALUES
(1, 1, 'grc', 'GRC Board', 'Fiber Cement', 'Glass Reinforced Cement', 'Panel semen berkualitas tinggi untuk fasad, partisi, dan dekorasi bangunan modern.', 11, 'lembar', 2.8800, 45000, 85000, 0.1000, 'm2 area dinding / fasad', 0, 1, 1),
(2, 1, 'conwood', 'Conwood', 'Wood Alternative', 'Dekoratif & CNC Custom', 'Alternatif kayu tahan cuaca dan anti-rayap. Cocok untuk fasad dekoratif dan CNC custom.', 12, 'lembar', 0.6000, 180000, 350000, 0.1200, 'm2 area fasad / dinding', 1, 2, 1),
(3, 2, 'bitmix', 'Waterproofing Bitmix', 'Waterproofing', 'Membrane Bitumen', 'Membran bitumen anti bocor untuk atap datar, basement, dan area lembab.', 13, 'roll (10m2)', 10.0000, 120000, 220000, 0.1500, 'm2 area waterproofing', 0, 3, 1),
(4, 3, 'tensile', 'Tensile Membrane', 'Structure', 'Agtex, Sioen, Serge Ferrari, Heytex', 'Struktur kanopi membran untuk area publik, plaza, parkir, dan fasilitas outdoor.', 14, 'm2', 1.0000, 450000, 900000, 0.0800, 'm2 area kanopi', 0, 4, 1),
(5, 4, 'wallspan', 'Fasad Metal Wallspan', 'Fasad Metal', 'Perforated Fasad, GKD', 'Panel fasad metal berlubang untuk eksterior gedung modern. Estetis dan fungsional.', 15, 'm2', 1.0000, 350000, 750000, 0.1000, 'm2 area fasad metal', 1, 5, 1),
(6, 5, 'tegola', 'Tegola + Gerfloor', 'Roofing & Flooring', 'Genteng Bitumen & Vinyl Floor', 'Genteng aspal Tegola untuk tampilan premium. Vinyl floor Gerfloor untuk interior.', 16, 'm2', 1.0000, 95000, 280000, 0.1000, 'm2 area atap / lantai', 0, 6, 1)
ON DUPLICATE KEY UPDATE
  category_id = VALUES(category_id),
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
  is_featured = VALUES(is_featured);

-- Seed: services
INSERT INTO services (slug, title, description, sort_order) VALUES
('penyediaan-material-proyek', 'Penyediaan Material Proyek', 'Supply material untuk proyek kontraktor dan developer sesuai spesifikasi, jadwal, dan budget.', 1),
('pengadaan-perusahaan-instansi', 'Pengadaan Perusahaan & Instansi', 'Pengadaan B2B untuk korporasi, instansi pemerintah, dan project owner lengkap dengan dokumentasi.', 2),
('konsultasi-produk', 'Konsultasi Produk', 'Rekomendasi material dari tim teknis sesuai aplikasi, beban, dan kondisi lapangan.', 3),
('pengiriman-ke-lokasi', 'Pengiriman ke Lokasi', 'Distribusi terjadwal ke seluruh Jabodetabek, dari gudang proyek hingga lokasi kerja.', 4),
('dukungan-skala-kecil-besar', 'Dukungan Skala Kecil - Besar', 'Mulai dari renovasi toko hingga proyek high-rise dan infrastruktur.', 5)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  description = VALUES(description),
  sort_order = VALUES(sort_order);

-- Seed: projects
INSERT INTO projects (slug, title, tag, description, main_media_id, sort_order, is_featured) VALUES
('fly-over-agung-sedayu', 'Fly Over Agung Sedayu', 'Fasad Metal', 'Wallspan GKD metal panel system untuk fasad fly over.', 17, 1, 1),
('international-finance-center', 'International Finance Center', 'GKD Metal Mesh', 'Premium metal mesh facade Jakarta CBD.', 18, 2, 1),
('universitas-negeri-jakarta', 'Universitas Negeri Jakarta', 'Perforated Fasad', 'Perforated metal facade untuk gedung kampus.', 19, 3, 1),
('bina-karsa-office-kuningan', 'Bina Karsa Office Kuningan', 'Fasad Membrane', 'Tensile membrane facade system Kuningan, Jakarta.', 20, 4, 1)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  tag = VALUES(tag),
  description = VALUES(description),
  main_media_id = VALUES(main_media_id),
  sort_order = VALUES(sort_order),
  is_featured = VALUES(is_featured);

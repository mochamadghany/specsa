-- Specsa migration: new product structure + social media / feed settings
-- Target: MySQL 8+ / MariaDB 10.5+
-- Run AFTER schema.sql has already been imported.
-- Import from hPanel/phpMyAdmin. Safe to re-run (idempotent via ON DUPLICATE KEY UPDATE).

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ---------------------------------------------------------------------------
-- 1. Product categories (4 new categories)
--    Reuses ids 1-4; deactivates the old id 5.
-- ---------------------------------------------------------------------------
INSERT INTO product_categories (id, slug, name, description, sort_order, is_active) VALUES
(1, 'membrane-tensile', 'Membrane Tensile (Roofing)', 'Struktur atap membran tarik untuk kanopi, plaza, dan area publik.', 1, 1),
(2, 'viber-semen-decorative', 'Viber Semen Panel & Decorative', 'Panel semen fiber & material dekoratif untuk fasad dan interior.', 2, 1),
(3, 'waterproofing-system', 'Waterproofing System', 'Sistem pelapis anti bocor untuk atap, basement, dan area lembab.', 3, 1),
(4, 'protection-solution', 'Protection & Solution', 'Solusi proteksi & perlindungan permukaan bangunan.', 4, 1)
ON DUPLICATE KEY UPDATE
  slug = VALUES(slug),
  name = VALUES(name),
  description = VALUES(description),
  sort_order = VALUES(sort_order),
  is_active = VALUES(is_active);

UPDATE product_categories SET is_active = 0 WHERE id = 5;

-- ---------------------------------------------------------------------------
-- 2. Products (brands become individual products, calculator-ready)
--    Reuses ids 1-6, adds id 7. Slugs map to the Product.id used on the site.
-- ---------------------------------------------------------------------------
INSERT INTO products
(id, category_id, slug, name, badge, brand, short_description, main_media_id, unit, coverage, price_min, price_max, waste_factor, calc_label, has_cnc_option, sort_order, is_featured, is_published)
VALUES
(1, 1, 'seion', 'SEION Membrane', 'Membrane Tensile', 'SEION', 'Membran tensile untuk kanopi & atap tarik dengan ketahanan cuaca tinggi.', 14, 'm2', 1.0000, 350000, 650000, 0.0800, 'm2 area kanopi / atap membrane', 0, 1, 1, 1),
(2, 1, 'cg-ferrari', 'CG Ferrari Membrane', 'Membrane Tensile', 'CG Ferrari', 'Membran premium asal Prancis untuk struktur tensile berkelas dan tahan lama.', 14, 'm2', 1.0000, 600000, 1200000, 0.0800, 'm2 area kanopi / atap membrane', 0, 2, 1, 1),
(3, 1, 'agatex', 'Agatex Membrane', 'Membrane Tensile', 'Agatex', 'Membran tensile ekonomis dengan performa baik untuk berbagai aplikasi outdoor.', 14, 'm2', 1.0000, 300000, 550000, 0.0800, 'm2 area kanopi / atap membrane', 0, 3, 1, 1),
(4, 2, 'conwood', 'Conwood', 'Viber Semen & Dekoratif', 'Conwood', 'Alternatif kayu berbahan semen fiber, tahan cuaca & rayap. Cocok untuk fasad dekoratif dan CNC custom.', 12, 'lembar', 0.6000, 180000, 350000, 0.1200, 'm2 area fasad / dinding', 1, 4, 1, 1),
(5, 2, 'grc-board', 'GRC Board (Cat Specsa / Vibercoat)', 'Viber Semen & Dekoratif', 'Cat Specsa / Vibercoat', 'Panel semen fiber untuk fasad, partisi, dan dekorasi, dilengkapi finishing Cat Specsa / Vibercoat.', 11, 'lembar', 2.8800, 45000, 95000, 0.1000, 'm2 area dinding / fasad', 0, 5, 1, 1),
(6, 3, 'waterproofing-system', 'Waterproofing System', 'Waterproofing', 'Specsa System', 'Sistem pelapis anti bocor untuk atap datar, basement, kamar mandi, dan area lembab.', 13, 'm2', 1.0000, 85000, 250000, 0.1500, 'm2 area waterproofing', 0, 6, 1, 1),
(7, 4, 'protection-solution', 'Protection & Solution', 'Protection', 'Specsa Solution', 'Solusi proteksi & perlindungan permukaan bangunan untuk daya tahan jangka panjang.', 16, 'm2', 1.0000, 100000, 300000, 0.1000, 'm2 area aplikasi', 0, 7, 1, 1)
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

-- ---------------------------------------------------------------------------
-- 3. Site settings: social media links + Instagram/Facebook feed config
--    Credentials are left blank; fill them in from the CMS Settings tab.
-- ---------------------------------------------------------------------------
INSERT INTO site_settings (setting_key, setting_value, value_type, group_name) VALUES
('social_instagram_url', 'https://www.instagram.com/specsa.id', 'url', 'social'),
('social_instagram_handle', '@specsa.id', 'text', 'social'),
('social_facebook_url', 'https://www.facebook.com/specsa.id', 'url', 'social'),
('social_facebook_handle', 'Specsa', 'text', 'social'),
('social_tiktok_url', '', 'url', 'social'),
('social_tiktok_handle', '', 'text', 'social'),
('social_youtube_url', '', 'url', 'social'),
('social_youtube_handle', '', 'text', 'social'),
('social_linkedin_url', '', 'url', 'social'),
('social_linkedin_handle', '', 'text', 'social'),
('instagram_user_id', '', 'text', 'feed'),
('instagram_access_token', '', 'text', 'feed'),
('instagram_feed_enabled', '1', 'boolean', 'feed'),
('facebook_page_url', 'https://www.facebook.com/specsa.id', 'url', 'feed'),
('facebook_feed_enabled', '1', 'boolean', 'feed')
ON DUPLICATE KEY UPDATE
  value_type = VALUES(value_type),
  group_name = VALUES(group_name);

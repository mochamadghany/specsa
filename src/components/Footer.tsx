import Image from "next/image";
import SocialIcons from "@/components/SocialIcons";
import { getSiteSettings, getSocialLinks } from "@/lib/settings";
import { getProducts } from "@/lib/products-db";

export default async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getSiteSettings();
  const socialLinks = getSocialLinks(settings);
  const products = await getProducts();
  const telHref = `tel:+${settings.whatsapp.replace(/[^0-9]/g, "")}`;
  const siteHost = settings.site_url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <footer
      className="py-16"
      style={{
        background: "var(--bg-dark)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Image
              src="/images/logo-specsa-white.png"
              alt={settings.site_name}
              width={991}
              height={363}
              className="h-12 w-auto mb-5"
            />
            <p className="text-[13px] text-white/50 leading-relaxed">
              Mitra terpercaya pengadaan material bangunan untuk kontraktor,
              developer, instansi, dan retail di Jabodetabek.
            </p>
            <SocialIcons
              links={socialLinks}
              className="mt-5"
              itemClassName="w-9 h-9 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:text-gold hover:border-gold"
            />
          </div>

          {/* Navigasi */}
          <div>
            <h5
              className="text-[11px] uppercase tracking-[0.14em] text-white/40 mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Navigasi
            </h5>
            <ul className="space-y-2.5">
              {[
                ["#tentang", "Tentang Kami"],
                ["#layanan", "Layanan"],
                ["#proyek", "Proyek"],
                ["#nilai", "Mengapa Specsa"],
                ["#kontak", "Kontak"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-[13px] text-white/55 hover:text-gold transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Produk */}
          <div>
            <h5
              className="text-[11px] uppercase tracking-[0.14em] text-white/40 mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Produk
            </h5>
            <ul className="space-y-2.5">
              {products.map((p) => (
                <li key={p.id}>
                  <a
                    href={`/produk#product-${p.id}`}
                    className="text-[13px] text-white/55 hover:text-gold transition-colors"
                  >
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h5
              className="text-[11px] uppercase tracking-[0.14em] text-white/40 mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Kontak
            </h5>
            <ul className="space-y-3 text-[13px] text-white/55">
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-gold transition-colors"
                >
                  {settings.email}
                </a>
              </li>
              <li>
                <a href={telHref} className="hover:text-gold transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="leading-relaxed">{settings.address}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-wrap justify-between items-center gap-4 text-[12px] text-white/30"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span>© {year} {settings.site_name}. All rights reserved.</span>
          <span style={{ fontFamily: "var(--font-mono)" }}>{siteHost}</span>
        </div>
      </div>
    </footer>
  );
}

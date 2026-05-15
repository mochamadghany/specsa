export default function Footer() {
  const year = new Date().getFullYear();

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
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-[38px] h-[38px] rounded-lg flex items-center justify-center text-white font-bold text-[14px] tracking-wider"
                style={{
                  background:
                    "linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)",
                }}
              >
                SP
              </div>
              <div className="font-semibold text-[15px] text-white">
                Specsa Solusi Pratama
                <small
                  className="block text-[9px] font-normal text-white/40 tracking-[0.12em] uppercase mt-0.5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Building Material Supplier
                </small>
              </div>
            </div>
            <p className="text-[13px] text-white/50 leading-relaxed">
              Mitra terpercaya pengadaan material bangunan untuk kontraktor,
              developer, instansi, dan retail di Jabodetabek.
            </p>
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
              {[
                "GRC Board",
                "Conwood",
                "Waterproofing Bitmix",
                "Tensile Membrane",
                "Wallspan GKD",
                "Tegola Bitumen",
                "Vinyl Floor Gerfloor",
              ].map((p) => (
                <li key={p}>
                  <a
                    href="#produk"
                    className="text-[13px] text-white/55 hover:text-gold transition-colors"
                  >
                    {p}
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
                  href="mailto:info@specsa.id"
                  className="hover:text-gold transition-colors"
                >
                  info@specsa.id
                </a>
              </li>
              <li>
                <a
                  href="tel:+6281210511526"
                  className="hover:text-gold transition-colors"
                >
                  0812 105 1526
                </a>
              </li>
              <li className="leading-relaxed">
                Ruko Bintaro Terrace 2 No.7,
                <br />
                Jl. Sumatera, Ciputat,
                <br />
                Tangerang Selatan 15414
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-wrap justify-between items-center gap-4 text-[12px] text-white/30"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span>© {year} PT. Specsa Solusi Pratama. All rights reserved.</span>
          <span style={{ fontFamily: "var(--font-mono)" }}>specsa.id</span>
        </div>
      </div>
    </footer>
  );
}

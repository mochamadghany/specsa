import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCalculator from "@/components/ProductCalculator";
import { getProducts } from "@/lib/products-db";
import { getSiteSettings } from "@/lib/settings";
import type { Product } from "@/lib/products";

type PageProps = {
  params: {
    productId: string;
  };
};

const applicationsByCategory: Record<string, string[]> = {
  "membrane-tensile": [
    "Kanopi & carport",
    "Atap area publik / plaza",
    "Parkir & fasilitas outdoor",
    "Stadion, tribun & panggung",
  ],
  "viber-semen-decorative": [
    "Fasad & dinding eksterior",
    "Partisi & plafon",
    "Dekorasi interior & eksterior",
    "Lisplang & elemen dekoratif",
  ],
  "waterproofing-system": [
    "Atap dak beton",
    "Basement & ground tank",
    "Kamar mandi & area basah",
    "Talang & roof garden",
  ],
  "protection-solution": [
    "Proteksi permukaan beton",
    "Perlindungan struktur baja",
    "Area dengan beban & gesekan tinggi",
    "Finishing tahan lama",
  ],
};

const defaultApplications = [
  "Proyek komersial",
  "Hunian & residensial",
  "Bangunan industri",
  "Fasilitas publik",
];

const benefits: { title: string; body: string }[] = [
  {
    title: "Kualitas Terjamin",
    body: "Material original dari brand terpercaya, sesuai spesifikasi teknis proyek Anda.",
  },
  {
    title: "Harga Kompetitif",
    body: "Penawaran terbaik untuk volume proyek besar maupun kebutuhan retail.",
  },
  {
    title: "Stok & Pengiriman",
    body: "Siap kirim ke seluruh Jabodetabek sesuai jadwal pekerjaan di lapangan.",
  },
  {
    title: "Konsultasi Teknis Gratis",
    body: "Tim teknis membantu memilih material dan menghitung kebutuhan proyek.",
  },
];

function getApplications(product: Product) {
  return applicationsByCategory[product.categorySlug || ""] || defaultApplications;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const products = await getProducts();
  const product = products.find((item) => item.id === params.productId);
  if (!product) return {};

  return {
    title: `${product.name} - Harga & Spesifikasi`,
    description: product.desc,
    keywords: `${product.name}, ${product.brand}, ${product.badge}, harga ${product.name}, supplier material bangunan`,
    openGraph: {
      title: `${product.name} - Specsa`,
      description: product.desc,
      images: [{ url: product.img, alt: product.alt }],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const [products, settings] = await Promise.all([getProducts(), getSiteSettings()]);
  const product = products.find((item) => item.id === params.productId);
  if (!product) notFound();

  const sameCategory = products.filter(
    (item) => item.id !== product.id && item.categorySlug === product.categorySlug
  );
  const others = products.filter(
    (item) => item.id !== product.id && item.categorySlug !== product.categorySlug
  );
  const related = [...sameCategory, ...others].slice(0, 3);
  const applications = getApplications(product);

  const wa = settings.whatsapp || "6281210511526";
  const waMessage = encodeURIComponent(
    `Halo Specsa, saya tertarik dengan ${product.name}${product.brand ? ` (${product.brand})` : ""}. Mohon info harga & ketersediaannya.`
  );
  const waLink = `https://wa.me/${wa}?text=${waMessage}`;
  const phoneLink = `tel:${(settings.phone || "").replace(/\s+/g, "")}`;

  const fmt = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

  const specs: [string, string][] = [
    ["Brand", product.brand || "-"],
    ["Coverage", `${product.coverage} m² / ${product.unit}`],
    ["Satuan jual", product.unit],
    ["Waste standar", `${Math.round(product.wasteFactor * 100)}%`],
  ];

  return (
    <>
      <Topbar />
      <Navbar products={products} />
      <main className="pb-24 lg:pb-0">
        {/* ── Split hero: positioning + price on the text half, product + calculator on the proof half ── */}
        <section className="bg-bg-dark text-white">
          <div className="max-w-container mx-auto px-8 pt-10 pb-16 lg:pt-14 lg:pb-24">
            <nav
              className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-white/45"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <Link href="/produk" className="hover:text-gold-light">
                Produk
              </Link>
              <span aria-hidden="true">/</span>
              {product.categoryName ? (
                <>
                  <Link
                    href={`/produk#kategori-${product.categorySlug}`}
                    className="hover:text-gold-light"
                  >
                    {product.categoryName}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              ) : null}
              <span className="text-white/75">{product.name}</span>
            </nav>

            <div className="mt-10 grid lg:grid-cols-2 gap-x-16 gap-y-12 items-start">
              {/* text half */}
              <div className="lg:pt-6">
                <span
                  className="text-[11px] uppercase tracking-[0.16em] text-gold-light"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {product.badge}
                </span>
                <h1 className="mt-4 text-[44px] lg:text-[72px] font-bold leading-[1.0] tracking-[-0.03em]">
                  {product.name}
                </h1>
                {product.brand ? (
                  <p className="mt-3 text-[15px] italic text-white/55">{product.brand}</p>
                ) : null}
                <p className="mt-7 max-w-[460px] text-[16px] leading-[1.75] text-white/72">
                  {product.desc}
                </p>

                <div className="mt-9 border-t border-white/12 pt-6">
                  <span
                    className="text-[10px] uppercase tracking-[0.18em] text-white/45"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Estimasi Harga
                  </span>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-[32px] lg:text-[38px] font-bold text-gold-light leading-none tracking-[-0.02em]">
                      {fmt(product.priceMin)}
                    </span>
                    <span className="text-white/40 pb-1">—</span>
                    <span className="text-[32px] lg:text-[38px] font-bold text-gold-light leading-none tracking-[-0.02em]">
                      {fmt(product.priceMax)}
                    </span>
                    <span className="pb-1 text-[13px] font-normal text-white/55">
                      / {product.unit}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] text-white/40">
                    *Harga indikatif, final menyesuaikan volume & spesifikasi.
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold"
                  >
                    Tanya & Pesan via WhatsApp <span className="arrow">→</span>
                  </a>
                  <a href={phoneLink} className="btn btn-outline">
                    Telepon Sales
                  </a>
                </div>

                <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/65">
                  {[
                    "Konsultasi teknis gratis",
                    "Pengiriman Jabodetabek",
                    "Material original & bergaransi",
                  ].map((chip) => (
                    <li key={chip} className="flex items-center gap-2">
                      <span className="text-gold-light">✓</span>
                      {chip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* proof half */}
              <div className="flex flex-col gap-6">
                <div className="relative aspect-[5/4] overflow-hidden rounded-[12px]">
                  <Image
                    src={product.img}
                    alt={product.alt}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,rgba(14,12,9,0.6),transparent)]" />
                  <span
                    className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-white/85 backdrop-blur"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {product.categoryName || "Produk"}
                  </span>
                </div>
                <ProductCalculator product={product} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Diptych 1 · Spesifikasi (text ‖ stat-proof) ── */}
        <section className="py-20 lg:py-24 bg-bg-base">
          <div className="max-w-container mx-auto px-8 grid lg:grid-cols-2 gap-x-16 gap-y-12 items-center">
            <div>
              <span className="label">Spesifikasi</span>
              <h2 className="h-display mt-4">Detail teknis material.</h2>
              <p className="mt-4 max-w-[460px] text-text-muted leading-relaxed">
                Angka coverage & waste di bawah ini yang kami pakai untuk menghitung
                estimasi kebutuhan proyek Anda secara akurat.
              </p>
              <dl className="mt-8">
                {specs.map(([label, value], i) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-6 py-4"
                    style={{
                      borderTop: "1px solid var(--border)",
                      borderBottom:
                        i === specs.length - 1 ? "1px solid var(--border)" : undefined,
                    }}
                  >
                    <dt
                      className="text-[11px] uppercase tracking-[0.14em] text-text-muted"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {label}
                    </dt>
                    <dd className="text-[18px] font-bold tracking-[-0.01em] text-right">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-[14px] bg-bg-dark text-white p-8 lg:p-10">
              <span
                className="text-[10px] uppercase tracking-[0.18em] text-white/45"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Coverage per {product.unit}
              </span>
              <p className="mt-3 text-[52px] lg:text-[64px] font-bold leading-none tracking-[-0.03em] text-gold-light">
                {product.coverage}
                <span className="ml-2 text-[20px] font-normal text-white/55">m²</span>
              </p>
              <p className="mt-4 text-[14px] leading-relaxed text-white/65">
                Satu {product.unit} {product.name} menutup sekitar {product.coverage} m²
                permukaan. Hitung kebutuhan persisnya pakai kalkulator di atas, atau biar
                tim kami yang bantu.
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold mt-7"
              >
                Minta Hitungan Akurat <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── Diptych 2 · Cocok untuk (image ‖ text, reversed) ── */}
        <section className="py-20 lg:py-24 bg-bg-soft">
          <div className="max-w-container mx-auto px-8 grid lg:grid-cols-2 gap-x-16 gap-y-12 items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] lg:order-1 order-2">
              <Image
                src={product.img}
                alt={product.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="lg:order-2 order-1">
              <span className="label">Cocok Untuk</span>
              <h2 className="h-display mt-4">Aplikasi {product.name}.</h2>
              <p className="mt-4 max-w-[460px] text-text-muted leading-relaxed">
                Material ini paling sering dipakai kontraktor untuk pekerjaan berikut:
              </p>
              <ul className="mt-7 grid sm:grid-cols-2 gap-x-8">
                {applications.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-4 py-4"
                    style={{ borderTop: "1px solid var(--border)" }}
                  >
                    <span
                      className="text-[12px] text-gold tabular-nums"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      0{i + 1}
                    </span>
                    <span className="text-[15px] text-text-dark">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Diptych 3 · Kenapa Specsa (text ‖ CTA proof) ── */}
        <section className="py-20 lg:py-24 bg-bg-base">
          <div className="max-w-container mx-auto px-8 grid lg:grid-cols-2 gap-x-16 gap-y-12 items-start">
            <div>
              <span className="label">Kenapa Specsa</span>
              <h2 className="h-display mt-4">Alasan kontraktor memilih kami.</h2>
              <div className="mt-8 grid gap-px" style={{ background: "var(--border)" }}>
                {benefits.map((item) => (
                  <article key={item.title} className="bg-bg-base py-5">
                    <h3 className="text-[17px] font-bold tracking-[-0.01em]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="rounded-[14px] bg-bg-dark text-white p-8 lg:p-10 lg:sticky lg:top-28">
              <span
                className="text-[10px] uppercase tracking-[0.18em] text-gold-light"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Siap pesan?
              </span>
              <h3 className="mt-3 text-[26px] font-bold leading-tight tracking-[-0.02em]">
                Tanya stok & harga {product.name} sekarang.
              </h3>
              <p className="mt-4 text-[14px] leading-relaxed text-white/65">
                Balasan cepat di jam kerja. Sebutkan volume atau luas area proyek Anda,
                tim kami bantu hitung & siapkan penawaran.
              </p>
              <div className="mt-7 flex flex-col gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold justify-center"
                >
                  Chat WhatsApp <span className="arrow">→</span>
                </a>
                <a href={phoneLink} className="btn btn-outline justify-center">
                  Telepon Sales
                </a>
              </div>
            </aside>
          </div>
        </section>

        {/* ── Related · editorial index list ── */}
        <section className="py-20 lg:py-24 bg-bg-soft">
          <div className="max-w-container mx-auto px-8">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
              <div>
                <span className="label">Produk Lainnya</span>
                <h2 className="h-display mt-4">Masih ada pilihan material lain.</h2>
              </div>
              <Link href="/produk" className="btn btn-gold">
                Lihat Semua Produk <span className="arrow">→</span>
              </Link>
            </div>
            <ul style={{ borderTop: "1px solid var(--border)" }}>
              {related.map((item) => (
                <li key={item.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <Link
                    href={`/produk/${item.id}`}
                    className="group flex items-center gap-5 py-5"
                  >
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-[8px] bg-bg-base">
                      <Image
                        src={item.img}
                        alt={item.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-[10px] uppercase tracking-[0.12em] text-gold"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {item.badge}
                      </div>
                      <h3 className="mt-1 text-[18px] font-bold tracking-[-0.01em] truncate">
                        {item.name}
                      </h3>
                      <p className="mt-0.5 text-[13px] text-text-muted line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold text-gold opacity-0 transition-opacity group-hover:opacity-100">
                      Lihat <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Sticky mobile CTA */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex gap-2 border-t bg-white/95 px-4 py-3 backdrop-blur"
        style={{ borderColor: "var(--border)" }}
      >
        <a
          href={phoneLink}
          className="btn flex-1 justify-center border border-gold text-gold"
        >
          Telepon
        </a>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-gold flex-[1.6] justify-center"
        >
          Tanya & Pesan →
        </a>
      </div>

      <Footer />
    </>
  );
}

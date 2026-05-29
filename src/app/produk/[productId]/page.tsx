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
    title: `${product.name} - Harga & Spesifikasi | Specsa Solusi Pratama`,
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

  return (
    <>
      <Topbar />
      <Navbar products={products} />
      <main className="pb-20 lg:pb-0">
        {/* Hero */}
        <section className="relative overflow-hidden bg-bg-dark text-white">
          <div className="absolute inset-0">
            <Image
              src={product.img}
              alt={product.alt}
              fill
              priority
              className="object-cover opacity-42"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,12,9,0.9),rgba(14,12,9,0.68)_48%,rgba(14,12,9,0.28))]" />
          </div>
          <div className="relative max-w-container mx-auto px-8 py-16 lg:py-24">
            <nav
              className="flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.1em] text-white/55"
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
              <span className="text-white/80">{product.name}</span>
            </nav>

            <div className="mt-8 grid lg:grid-cols-[minmax(0,1fr)_420px] gap-10 items-start">
              <div className="max-w-[720px]">
                <span className="inline-flex rounded-full bg-gold/20 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gold-light">
                  {product.badge}
                </span>
                <h1 className="mt-5 text-[40px] lg:text-[68px] font-bold leading-[1.03] tracking-[-0.025em]">
                  {product.name}
                </h1>
                {product.brand ? (
                  <p className="mt-3 italic text-white/68">{product.brand}</p>
                ) : null}
                <p className="mt-6 max-w-[620px] text-[17px] leading-[1.7] text-white/78">
                  {product.desc}
                </p>

                <div className="mt-7 inline-flex flex-col gap-1 rounded-[12px] border border-gold/25 bg-black/25 px-5 py-4">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-white/55">
                    Estimasi Harga
                  </span>
                  <span className="text-[26px] font-bold text-gold-light leading-none">
                    {fmt(product.priceMin)} – {fmt(product.priceMax)}
                    <span className="ml-1 text-[14px] font-normal text-white/60">
                      / {product.unit}
                    </span>
                  </span>
                  <span className="mt-1 text-[12px] text-white/50">
                    *Harga indikatif, final menyesuaikan volume & spesifikasi.
                  </span>
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
                  <a
                    href={phoneLink}
                    className="btn border border-white/25 text-white hover:border-gold-light"
                  >
                    Telepon Sales
                  </a>
                </div>

                <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/70">
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

              <ProductCalculator product={product} />
            </div>
          </div>
        </section>

        {/* Spec strip */}
        <section className="py-14 bg-bg-base">
          <div className="max-w-container mx-auto px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                ["Brand", product.brand || "-"],
                ["Coverage", `${product.coverage} m2 / ${product.unit}`],
                ["Satuan", product.unit],
                ["Waste Standar", `${Math.round(product.wasteFactor * 100)}%`],
              ].map(([label, value]) => (
                <article
                  key={label}
                  className="rounded-[10px] border bg-card-bg p-6 shadow-sm"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="text-[11px] uppercase tracking-[0.12em] text-text-muted">
                    {label}
                  </div>
                  <div className="mt-2 text-[20px] font-bold leading-snug">{value}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits + Applications */}
        <section className="py-16 bg-bg-soft">
          <div className="max-w-container mx-auto px-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
            <div>
              <span className="label">Kenapa Specsa</span>
              <h2 className="h-display mt-4">Alasan kontraktor memilih kami.</h2>
              <div className="mt-8 grid sm:grid-cols-2 gap-5">
                {benefits.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[10px] border bg-card-bg p-6 shadow-sm"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <h3 className="text-[17px] font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <aside
              className="rounded-[12px] border bg-card-bg p-7 shadow-sm lg:sticky lg:top-28"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="label">Cocok Untuk</span>
              <h3 className="mt-3 text-[22px] font-bold tracking-[-0.01em]">
                Aplikasi {product.name}
              </h3>
              <ul className="mt-5 grid gap-3">
                {applications.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-text-dark">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-7 w-full justify-center">
                Konsultasi Kebutuhan <span className="arrow">→</span>
              </a>
            </aside>
          </div>
        </section>

        {/* Related */}
        <section className="py-16 bg-bg-base">
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
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/produk/${item.id}`}
                  className="rounded-[10px] overflow-hidden bg-card-bg border shadow-sm transition-transform hover:-translate-y-1"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="relative aspect-[4/3]">
                    <Image src={item.img} alt={item.alt} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <div className="text-[10px] uppercase tracking-[0.1em] text-gold">
                      {item.badge}
                    </div>
                    <h3 className="mt-2 font-bold text-[18px]">{item.name}</h3>
                    <p className="mt-2 text-sm text-text-muted line-clamp-2">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
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

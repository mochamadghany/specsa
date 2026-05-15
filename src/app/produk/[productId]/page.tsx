import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCalculator from "@/components/ProductCalculator";
import { products } from "@/lib/products";

type PageProps = {
  params: {
    productId: string;
  };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const product = products.find((item) => item.id === params.productId);
  if (!product) return {};

  return {
    title: `${product.name} - Specsa Solusi Pratama`,
    description: product.desc,
    keywords: `${product.name}, ${product.badge}, supplier material bangunan`,
    openGraph: {
      title: `${product.name} - Specsa`,
      description: product.desc,
      images: [{ url: product.img, alt: product.alt }],
    },
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = products.find((item) => item.id === params.productId);
  if (!product) notFound();

  const related = products.filter((item) => item.id !== product.id).slice(0, 3);

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
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
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,12,9,0.88),rgba(14,12,9,0.66)_48%,rgba(14,12,9,0.24))]" />
          </div>
          <div className="relative max-w-container mx-auto px-8 py-20 lg:py-28">
            <Link
              href="/produk"
              className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-white/64 hover:text-gold-light"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span aria-hidden="true">←</span> Kembali ke Produk
            </Link>
            <div className="mt-10 grid lg:grid-cols-[minmax(0,1fr)_420px] gap-10 items-center">
              <div className="max-w-[720px]">
                <span className="inline-flex rounded-full bg-gold/20 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-gold-light">
                  {product.badge}
                </span>
                <h1 className="mt-5 text-[44px] lg:text-[76px] font-bold leading-[1.02] tracking-[-0.025em]">
                  {product.name}
                </h1>
                <p className="mt-3 italic text-white/68">{product.brand}</p>
                <p className="mt-6 max-w-[620px] text-[17px] leading-[1.7] text-white/76">
                  {product.desc}
                </p>
              </div>
              <ProductCalculator product={product} />
            </div>
          </div>
        </section>

        <section className="py-20 bg-bg-base">
          <div className="max-w-container mx-auto px-8">
            <div className="grid lg:grid-cols-3 gap-5">
              {[
                ["Coverage", `${product.coverage} m2 / ${product.unit}`],
                ["Estimasi Harga", `Rp ${product.priceMin.toLocaleString("id-ID")} - Rp ${product.priceMax.toLocaleString("id-ID")}`],
                ["Waste Default", `${Math.round(product.wasteFactor * 100)}%`],
              ].map(([label, value]) => (
                <article
                  key={label}
                  className="rounded-[10px] border bg-card-bg p-6 shadow-sm"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="text-[11px] uppercase tracking-[0.12em] text-text-muted">
                    {label}
                  </div>
                  <div className="mt-2 text-[22px] font-bold">{value}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-bg-soft">
          <div className="max-w-container mx-auto px-8">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
              <div>
                <span className="label">Produk Lainnya</span>
                <h2 className="h-display mt-4">Masih ada pilihan material lain.</h2>
              </div>
              <Link href="/kontak" className="btn btn-gold">
                Konsultasi Produk <span className="arrow">→</span>
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
                    <p className="mt-2 text-sm text-text-muted">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

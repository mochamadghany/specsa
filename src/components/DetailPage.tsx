import Image from "next/image";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/products-db";
import { getRandomHeroImage } from "@/lib/hero-images";
import type { DetailPageContent } from "@/lib/site-content";

type DetailPageProps = {
  page: DetailPageContent;
};

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default async function DetailPage({ page }: DetailPageProps) {
  const isExternal = page.ctaHref.startsWith("http");
  const CtaTag = isExternal ? "a" : Link;
  const heroImage = getRandomHeroImage();
  const products = await getProducts();

  return (
    <>
      <Topbar />
      <Navbar products={products} />
      <main>
        <section className="relative overflow-hidden bg-bg-dark text-white">
          <div className="absolute inset-0">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              className="object-cover opacity-45"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,12,9,0.94),rgba(14,12,9,0.72)_48%,rgba(14,12,9,0.35))]" />
          </div>
          <div className="relative max-w-container mx-auto px-8 py-24 lg:py-32">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-white/64 hover:text-gold-light"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span aria-hidden="true">←</span> Kembali ke beranda
            </Link>
            <div className="mt-12 max-w-[760px]">
              <span className="label text-gold-light">{page.eyebrow}</span>
              <h1 className="mt-5 text-[42px] lg:text-[68px] font-bold leading-[1.03] tracking-[-0.025em] text-balance">
                {page.title}
              </h1>
              <p className="mt-6 max-w-[660px] text-[17px] leading-[1.7] text-white/75">
                {page.lead}
              </p>
              <CtaTag
                href={page.ctaHref}
                className="btn btn-gold mt-8"
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {page.ctaLabel} <span className="arrow">→</span>
              </CtaTag>
            </div>
          </div>
        </section>

        <section className="py-20 bg-bg-base">
          <div className="max-w-container mx-auto px-8">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
              <aside className="lg:sticky lg:top-28">
                <span className="label">Ringkasan</span>
                <h2 className="h-display mt-4">Informasi {page.navLabel}</h2>
                <p className="mt-5 text-text-muted leading-relaxed">
                  Konten halaman ini dapat diperbarui dari dashboard CMS, termasuk
                  headline, section, CTA, dan SEO.
                </p>
              </aside>

              <div className="grid gap-5">
                {page.sections.map((section, index) => (
                  <article
                    key={section.title}
                    className="rounded-[10px] border bg-card-bg p-6 lg:p-8 shadow-sm"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div
                      className="text-[12px] text-gold uppercase tracking-[0.12em] mb-3"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      0{index + 1}
                    </div>
                    <h3 className="text-[24px] font-bold tracking-[-0.01em]">
                      {section.title}
                    </h3>
                    <p className="mt-3 text-text-muted leading-relaxed">
                      {section.body}
                    </p>
                    <ul className="mt-6 grid gap-3">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-3 text-sm text-text-dark">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {page.slug === "produk" ? (
          <section className="py-20 bg-bg-soft">
            <div className="max-w-container mx-auto px-8">
              <div className="flex flex-wrap items-end justify-between gap-8 mb-10">
                <div>
                  <span className="label">Produk Detail</span>
                  <h2 className="h-display mt-4">Daftar Produk yang Dijual.</h2>
                </div>
                <Link href="/kontak" className="btn btn-gold">
                  Minta Penawaran <ArrowIcon />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-[10px] overflow-hidden bg-card-bg border shadow-sm"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="relative aspect-[4/3] bg-bg-soft">
                      <Image
                        src={product.img}
                        alt={product.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-6">
                      <span
                        className="text-[10px] uppercase tracking-[0.1em] text-gold"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {product.badge}
                      </span>
                      <h3 className="mt-2 text-[20px] font-bold">{product.name}</h3>
                      <p className="mt-2 text-[13px] italic text-text-muted">
                        {product.brand}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-text-muted">
                        {product.desc}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}


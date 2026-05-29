"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { staticProducts, type Product } from "@/lib/products";

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function Products({ products = staticProducts }: { products?: Product[] }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    el.querySelectorAll(".reveal").forEach((r) => obs.observe(r));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className="py-24"
      id="produk"
      ref={ref}
      style={{ background: "var(--bg-soft)" }}
    >
      <div className="max-w-container mx-auto px-8">
        <div className="flex justify-between items-end gap-12 mb-12 flex-wrap">
          <div className="reveal">
            <span className="label">02 - Katalog Produk</span>
            <h2 className="h-display mt-4 flex-1 max-w-[560px]">
              Produk Unggulan Kami.
            </h2>
          </div>
          <p className="max-w-[280px] text-text-muted text-sm leading-relaxed reveal delay-1">
            Fokus pada solusi Atap (tensile architecture & modular structure) dan
            Fasad — didukung engineering, fabrikasi, dan aplikasi bergaransi.
          </p>
        </div>

        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0">
          {products.map((p, i) => (
            <article
              id={`product-${p.id}`}
              key={p.name}
              role="link"
              tabIndex={0}
              onClick={() => {
                window.location.href = `/produk/${p.id}`;
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") window.location.href = `/produk/${p.id}`;
              }}
              className="reveal bg-card-bg rounded-[10px] overflow-hidden border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-md flex flex-col shadow-sm group scroll-mt-28 snap-start min-w-[82%] sm:min-w-[46%] md:min-w-0"
              style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
            >
              <div
                className="aspect-[4/3] overflow-hidden relative"
                style={{ background: "var(--bg-soft)" }}
              >
                <Image
                  src={p.img}
                  alt={p.alt}
                  fill
                  className="object-cover transition-transform duration-[600ms] ease-[var(--ease)] group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-[22px] flex flex-col gap-2 flex-1">
                <span
                  className="self-start text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full mb-1.5"
                  style={{
                    background: "rgba(155,117,53,0.1)",
                    color: "var(--gold)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {p.badge}
                </span>
                <h3 className="text-[20px] font-bold tracking-[-0.015em]">
                  {p.name}
                </h3>
                <span className="italic text-text-muted text-[13px]">
                  {p.brand}
                </span>
                <p className="text-[13px] text-text-muted leading-[1.5] flex-1">
                  {p.desc}
                </p>
                <a
                  href="#kontak"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gold mt-2 hover:text-gold-light transition-colors"
                >
                  Minta Penawaran <ArrowIcon />
                </a>
              </div>
            </article>
          ))}
        </div>

        <p
          className="text-center mt-12 text-[13px] text-text-muted reveal"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}
        >
          ATAP MEMBRANE &nbsp;·&nbsp; GRC BOARD & FASAD DEKORATIF
          &nbsp;·&nbsp;{" "}
          <a href="#kontak" className="text-gold hover:text-gold-light">
            konsultasi kebutuhan proyek →
          </a>
        </p>
      </div>
    </section>
  );
}

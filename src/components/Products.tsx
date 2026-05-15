"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const products = [
  {
    img: "/images/product-grc.png",
    alt: "GRC Board",
    badge: "Fasad & Plafon",
    name: "GRC Board",
    brand: "Premium glass-fiber reinforced cement",
    desc: "Panel ringan, kuat, dan tahan cuaca — ideal untuk fasad, plafon dan partisi.",
  },
  {
    img: "/images/product-conwood.png",
    alt: "Conwood Dekoratif",
    badge: "Dekoratif & CNC",
    name: "Conwood",
    brand: "Fiber cement with natural wood texture",
    desc: "Pilihan motif kayu dekoratif dan opsi cutting CNC custom untuk eksterior.",
  },
  {
    img: "/images/product-bitmix.png",
    alt: "Bitmix Waterproofing",
    badge: "Waterproofing",
    name: "Waterproofing Bitmix",
    brand: "Bitumen membrane system",
    desc: "Sistem membrane waterproofing untuk atap, basement, dan area basah.",
  },
  {
    img: "/images/product-tensile.png",
    alt: "Tensile Membrane",
    badge: "Tensile Membrane",
    name: "Tensile Membrane",
    brand: "Agtex · Sioen · Serge Ferrari · Heytex",
    desc: "Membrane premium untuk kanopi, atap lengkung, hingga struktur arsitektural.",
  },
  {
    img: "/images/product-wallspan.png",
    alt: "Wallspan GKD Fasad Metal",
    badge: "Fasad Metal",
    name: "Wallspan GKD",
    brand: "Metal mesh & perforated facade systems",
    desc: "Sistem fasad metal mesh dan perforated untuk gedung high-rise & komersial.",
  },
  {
    img: "/images/product-tegola.png",
    alt: "Genteng Bitumen Tegola",
    badge: "Genteng Bitumen",
    name: "Tegola Canadese",
    brand: "Italian bitumen shingles",
    desc: "Genteng bitumen ringan dengan beragam pilihan warna & profil.",
  },
];

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

export default function Products() {
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
        {/* Header row */}
        <div className="flex justify-between items-end gap-12 mb-12 flex-wrap">
          <div className="reveal">
            <span className="label">02 — Katalog Produk</span>
            <h2 className="h-display mt-4 flex-1 max-w-[560px]">
              Produk Unggulan Kami.
            </h2>
          </div>
          <p className="max-w-[280px] text-text-muted text-sm leading-relaxed reveal delay-1">
            Material dari brand ternama — siap stok dan siap kirim ke lokasi
            proyek Anda di Jabodetabek.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <article
              key={p.name}
              className="reveal bg-card-bg rounded-[10px] overflow-hidden border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-md flex flex-col shadow-sm group"
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
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gold mt-2 hover:text-gold-light transition-colors"
                >
                  Lihat Detail <ArrowIcon />
                </a>
              </div>
            </article>
          ))}
        </div>

        <p
          className="text-center mt-12 text-[13px] text-text-muted reveal"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}
        >
          + VINYL FLOOR GERFLOOR &nbsp;·&nbsp; AKSESORIS & SISTEM TERKAIT
          &nbsp;·&nbsp;{" "}
          <a href="#kontak" className="text-gold hover:text-gold-light">
            tanyakan stok lainnya →
          </a>
        </p>
      </div>
    </section>
  );
}

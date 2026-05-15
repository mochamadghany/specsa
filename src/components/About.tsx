"use client";

import { useEffect, useRef } from "react";
const stats = [
  {
    num: "7+",
    mono: "Kategori Material",
    desc: "GRC, Conwood, Bitmix, Tensile Membrane, Wallspan, Tegola, Gerfloor.",
  },
  {
    num: "B2B",
    mono: "Focused Supply",
    desc: "Spesialis pengadaan proyek skala kecil hingga besar.",
  },
  {
    num: "100%",
    mono: "On-Time Delivery",
    desc: "Komitmen jadwal — dari PO hingga material tiba di lokasi.",
  },
  {
    num: "JBDTBK",
    mono: "Coverage",
    desc: "Pengiriman ke Jakarta, Bogor, Depok, Tangerang, Bekasi.",
  },
];

const brands = ["GRC", "Conwood", "Bitmix", "Wallspan", "Tegola", "Gerfloor", "Tensile"];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    el.querySelectorAll(".reveal").forEach((r) => obs.observe(r));
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function About() {
  const sectionRef = useReveal();

  return (
    <section className="py-24" id="tentang" ref={sectionRef}>
      <div className="max-w-container mx-auto px-8">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-20 items-start">
          {/* Left */}
          <div className="reveal">
            <span className="label">01 — Tentang Kami</span>
            <h2 className="h-display mt-4 mb-6">
              Mitra Terpercaya dalam Setiap Tahap Proyek Anda.
            </h2>
            <p className="text-text-muted text-base leading-relaxed max-w-[60ch] mb-3.5">
              PT. Specsa Solusi Pratama adalah supplier material bangunan yang
              berfokus pada kebutuhan kontraktor, developer, instansi, dan
              industri di wilayah Jabodetabek. Kami menyediakan rangkaian
              material dari produsen ternama dengan jaminan kualitas, harga
              kompetitif, dan ketersediaan stok yang siap dikirim.
            </p>
            <p className="text-text-muted text-base leading-relaxed max-w-[60ch]">
              Didorong oleh prinsip{" "}
              <strong className="text-text-dark font-semibold">
                S.P.E.C.S.A — Service, Professional, Efficiency, Commitment,
                Safety, Accountability
              </strong>{" "}
              — setiap pengadaan kami tangani dengan responsif, konsultatif, dan
              tepat waktu.
            </p>
            <a
              href="#nilai"
              className="mt-7 inline-flex items-center gap-2 font-semibold text-gold text-sm border-b pb-2.5 hover:text-gold-light transition-colors"
              style={{ borderColor: "var(--border)" }}
            >
              Pelajari Nilai Kami <span>→</span>
            </a>
          </div>

          {/* Stats 2×2 */}
          <div className="grid grid-cols-2 gap-3.5 reveal delay-2">
            {stats.map((s) => (
              <div
                key={s.num}
                className="bg-card-bg border rounded-[10px] p-7 transition-all duration-300 hover:-translate-y-[3px] hover:border-gold hover:shadow-md"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="font-bold text-gold leading-none mb-3.5"
                  style={{ fontSize: "clamp(36px,3.4vw,48px)" }}
                >
                  {s.num}
                </div>
                <span
                  className="block text-[11px] text-text-muted uppercase tracking-[0.1em] mb-1.5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {s.mono}
                </span>
                <p className="text-[13px] text-text-muted leading-[1.45]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Logo strip */}
        <div
          className="mt-20 py-7 flex flex-wrap justify-between items-center gap-6 reveal delay-3"
          style={{
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {brands.map((b) => (
            <span
              key={b}
              className="flex-1 text-center text-[12px] text-text-muted uppercase tracking-[0.18em]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

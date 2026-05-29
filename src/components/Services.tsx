"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const services = [
  {
    num: "01",
    title: "Konsultasi Gratis",
    desc: "Diskusi kebutuhan, design, dan rekomendasi solusi atap & fasad bersama tim teknis — tanpa biaya.",
  },
  {
    num: "02",
    title: "Material Original & Bergaransi",
    desc: "Jaminan material membrane original dari produsen terpercaya, lengkap dengan garansi.",
  },
  {
    num: "03",
    title: "Aplikasi Bergaransi",
    desc: "Pemasangan bergaransi, didukung perhitungan serta software membrane dan software perhitungan baja.",
  },
  {
    num: "04",
    title: "Shop Drawing Gratis",
    desc: "Dukungan gambar kerja (shop drawing) untuk memastikan fabrikasi & pemasangan presisi.",
  },
  {
    num: "05",
    title: "Laporan Perhitungan Struktur",
    desc: "Dukungan layanan perhitungan dan laporan struktur untuk keamanan dan kepatuhan proyek.",
  },
  {
    num: "06",
    title: "Workshop & Alat Bantu Membrane",
    desc: "Dukungan alat bantu pekerjaan membrane di workshop untuk hasil fabrikasi yang konsisten.",
  },
  {
    num: "07",
    title: "Melayani Seluruh Indonesia",
    desc: "Project atap membrane & fasad ditangani di seluruh wilayah Indonesia.",
  },
];

function ArrowSvg() {
  return (
    <svg
      className="shrink-0 opacity-30"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function Services() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (e) => e.forEach((en) => en.isIntersecting && en.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    el.querySelectorAll(".reveal").forEach((r) => obs.observe(r));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24" id="layanan" ref={ref}>
      <div className="max-w-container mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <div>
            <div className="reveal">
              <span className="label">03 — Layanan Teknis</span>
              <h2 className="h-display mt-4 mb-6">
                Didampingi dari Konsultasi sampai Aplikasi.
              </h2>
              <p className="text-text-muted text-base leading-relaxed max-w-[60ch]">
                Bukan sekadar supply material — kami dampingi engineering, shop
                drawing, fabrikasi workshop, hingga pemasangan bergaransi untuk
                proyek atap membrane & fasad di seluruh Indonesia.
              </p>
            </div>

            <div
              className="mt-8 rounded-[10px] overflow-hidden aspect-[4/3] relative reveal delay-2"
              style={{ background: "var(--bg-soft)" }}
            >
              <Image
                src="/images/about.png"
                alt="Tim Specsa"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Services list */}
          <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
            {services.map((s, i) => (
              <li
                key={s.num}
                className="flex items-start gap-5 py-6 reveal group cursor-default"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <span
                  className="text-[13px] text-gold mt-0.5 w-6 shrink-0"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {s.num}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-[16px] mb-1.5">{s.title}</h4>
                  <p className="text-[14px] text-text-muted leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <ArrowSvg />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

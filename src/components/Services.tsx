"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const services = [
  {
    num: "01",
    title: "Penyediaan Material Proyek",
    desc: "Supply material untuk proyek kontraktor & developer — sesuai spek, sesuai jadwal, sesuai budget.",
  },
  {
    num: "02",
    title: "Pengadaan Perusahaan & Instansi",
    desc: "Pengadaan B2B untuk korporasi, instansi pemerintah, dan project owner — lengkap dengan dokumentasi.",
  },
  {
    num: "03",
    title: "Konsultasi Produk",
    desc: "Rekomendasi material yang tepat dari tim teknis — sesuai aplikasi, beban, dan kondisi lapangan.",
  },
  {
    num: "04",
    title: "Pengiriman ke Lokasi",
    desc: "Distribusi terjadwal ke seluruh Jabodetabek — dari toko, gudang proyek, hingga lokasi kerja.",
  },
  {
    num: "05",
    title: "Dukungan Skala Kecil – Besar",
    desc: "Mulai dari renovasi toko, kanopi rumah, hingga proyek high-rise & infrastruktur — semua kami tangani.",
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
              <span className="label">03 — Cara Kami Bekerja</span>
              <h2 className="h-display mt-4 mb-6">
                Pengadaan yang Mudah, Cepat, dan Transparan.
              </h2>
              <p className="text-text-muted text-base leading-relaxed max-w-[60ch]">
                Dari konsultasi produk hingga material tiba di lokasi — kami
                dampingi setiap langkahnya. Cocok untuk kontraktor, developer,
                hingga toko ritel.
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

"use client";

import { useEffect, useRef } from "react";

const cards = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    title: "Produk Berkualitas",
    desc: "Material dari brand ternama Indonesia & Eropa — bergaransi dan teruji.",
    delay: "",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Respon Cepat",
    desc: "Penawaran dan respons dalam hitungan jam, tidak lebih dari 2 jam pada jam kerja.",
    delay: "delay-1",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Harga Kompetitif",
    desc: "Pricing langsung principal — efisiensi rantai pasok untuk margin proyek Anda.",
    delay: "delay-2",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: "On-Schedule",
    desc: "Komitmen jadwal sejak PO — material tiba sebelum tahapan pekerjaan dimulai.",
    delay: "delay-1",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    ),
    title: "Skala Fleksibel",
    desc: "Dari pembelian 1 lembar hingga ratusan ton — kami layani semua skala.",
    delay: "delay-2",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Jaringan Luas",
    desc: "Direct partnership dengan brand global & nasional — stok terjamin, lead-time pendek.",
    delay: "delay-3",
  },
];

export default function Why() {
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
    <section className="py-24" id="nilai" ref={ref}>
      <div className="max-w-container mx-auto px-8">
        <div className="text-center mb-12 reveal">
          <span className="label justify-center">05 — Why Specsa</span>
          <h2 className="h-display center mt-4">Mengapa Memilih Specsa?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c) => (
            <article
              key={c.title}
              className={`reveal ${c.delay} p-8 rounded-[10px] border transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-md bg-card-bg`}
              style={{ borderColor: "var(--border)" }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                style={{ background: "rgba(155,117,53,0.1)" }}
              >
                <span className="w-5 h-5 text-gold [&>svg]:w-full [&>svg]:h-full [&>svg]:stroke-[1.6]" style={{ color: "var(--gold)" }}>
                  {c.icon}
                </span>
              </div>
              <h4 className="font-semibold text-[16px] mb-2">{c.title}</h4>
              <p className="text-[14px] text-text-muted leading-relaxed">{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

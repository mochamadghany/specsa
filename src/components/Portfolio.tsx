"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const projects = [
  {
    img: "/images/project-flyover.png",
    alt: "Fly Over Agung Sedayu",
    tag: "Fasad Metal",
    title: "Fly Over Agung Sedayu",
    desc: "Wallspan GKD metal panel system untuk fasad fly over.",
    delay: "0.05s",
  },
  {
    img: "/images/project-ifc.png",
    alt: "International Finance Center",
    tag: "GKD Metal Mesh",
    title: "International Finance Center",
    desc: "Premium metal mesh facade — Jakarta CBD.",
    delay: "0.15s",
  },
  {
    img: "/images/project-unj.png",
    alt: "Universitas Negeri Jakarta",
    tag: "Perforated Fasad",
    title: "Universitas Negeri Jakarta",
    desc: "Perforated metal facade untuk gedung kampus.",
    delay: "0.25s",
  },
  {
    img: "/images/project-bkk.png",
    alt: "Bina Karsa Office Kuningan",
    tag: "Fasad Membrane",
    title: "Bina Karsa Office Kuningan",
    desc: "Tensile membrane facade system — Kuningan, Jakarta.",
    delay: "0.35s",
  },
];

export default function Portfolio() {
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
    <section
      className="py-24"
      id="proyek"
      ref={ref}
      style={{ background: "var(--bg-soft)" }}
    >
      <div className="max-w-container mx-auto px-8">
        <div className="flex justify-between items-end gap-12 mb-12 flex-wrap">
          <div className="reveal">
            <span className="label">04 — Portfolio</span>
            <h2 className="h-display mt-4">Proyek yang Kami Dukung.</h2>
          </div>
          <p className="max-w-[340px] text-text-muted text-sm leading-relaxed reveal delay-1">
            Material kami telah digunakan dalam proyek fasad, infrastruktur, dan
            komersial skala besar di Indonesia.
          </p>
        </div>

        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0">
          {projects.map((p) => (
            <article
              key={p.title}
              className="reveal relative rounded-[10px] overflow-hidden group cursor-default snap-start min-w-[78%] sm:min-w-0"
              style={{
                background: "var(--bg-dark)",
                transitionDelay: p.delay,
                aspectRatio: "3/4",
              }}
            >
              {/* Image sits directly inside the relative article — required by Next.js fill */}
              <Image
                src={p.img}
                alt={p.alt}
                fill
                loading="lazy"
                className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Gradient overlay + text */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-5"
                style={{
                  background:
                    "linear-gradient(to top, rgba(14,12,9,0.92) 0%, rgba(14,12,9,0.3) 60%, transparent 100%)",
                }}
              >
                <span
                  className="inline-block self-start text-[10px] uppercase tracking-[0.1em] px-2 py-1 rounded-full mb-2 text-white/80"
                  style={{
                    background: "rgba(155,117,53,0.3)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {p.tag}
                </span>
                <h4 className="font-semibold text-white text-[15px] leading-tight mb-1">
                  {p.title}
                </h4>
                <p className="text-[12px] text-white/65 leading-relaxed">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

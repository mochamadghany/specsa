"use client";

import { useEffect, useRef } from "react";

export default function Eco() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (e) => e.forEach((en) => en.isIntersecting && en.target.classList.add("visible")),
      { threshold: 0.2 }
    );
    el.querySelectorAll(".reveal").forEach((r) => obs.observe(r));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-16"
      style={{
        background: "var(--bg-dark)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-container mx-auto px-8">
        <blockquote
          className="text-center max-w-3xl mx-auto text-white/75 text-xl leading-relaxed italic mb-10 reveal"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          &ldquo;Kami juga peduli bahwa setiap material yang kami suplai dipilih dengan
          mempertimbangkan dampak lingkungan.&rdquo;
        </blockquote>

        <div className="flex justify-center gap-16 reveal delay-2">
          {[
            { n: "30%", l: "Less CO₂ Emission" },
            { n: "100%", l: "Recyclable GRC" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-[42px] font-bold text-gold leading-none">
                {s.n}
              </div>
              <div
                className="mt-2 text-[11px] text-white/50 uppercase tracking-[0.14em]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

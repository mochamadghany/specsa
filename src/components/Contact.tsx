"use client";

import { useEffect, useRef, FormEvent, useState } from "react";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nama = (form.elements.namedItem("nama") as HTMLInputElement).value;
    const wa = (form.elements.namedItem("wa") as HTMLInputElement).value;
    const produk = (form.elements.namedItem("produk") as HTMLSelectElement).value;
    const ket = (form.elements.namedItem("ket") as HTMLTextAreaElement).value;

    const msg = encodeURIComponent(
      `Halo Specsa,\n\nNama: ${nama}\nWA: ${wa}\nProduk: ${produk}\nKeterangan: ${ket}`
    );
    window.open(`https://wa.me/6281210511526?text=${msg}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    form.reset();
  };

  const infoRows = [
    { lbl: "PIC", val: "M. Sigit Kusbandono" },
    { lbl: "Telepon", val: "0812 105 1526" },
    { lbl: "Email", val: "info@specsa.id" },
    {
      lbl: "Alamat",
      val: "Ruko Bintaro Terrace 2 No.7, Jl. Sumatera, Ciputat, Tangerang Selatan 15414",
    },
    { lbl: "Jam", val: "Senin – Jumat · 08.00 – 17.00 WIB" },
  ];

  return (
    <section className="py-24" id="kontak" ref={ref}>
      <div className="max-w-container mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="reveal">
            <span className="label">06 — Hubungi Kami</span>
            <h2 className="h-display mt-4 mb-3">Mulai Proyek Bersama Kami.</h2>
            <div
              className="inline-flex items-center gap-2 text-[12px] text-text-muted mb-8 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(155,117,53,0.08)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.08em",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--gold)" }}
              />
              Respon dalam 2 jam pada jam kerja
            </div>

            <div className="flex flex-col gap-4 mb-8">
              {infoRows.map((r) => (
                <div
                  key={r.lbl}
                  className="flex gap-4 py-3 border-b text-sm"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="w-20 shrink-0 text-text-muted uppercase tracking-[0.08em] text-[11px] pt-0.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {r.lbl}
                  </span>
                  <span className="text-text-dark leading-relaxed">{r.val}</span>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/6281210511526"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-3.5 rounded-[8px] font-semibold text-[15px] text-white transition-all hover:-translate-y-0.5"
              style={{
                background: "#25D366",
                boxShadow: "0 6px 20px rgba(37,211,102,0.28)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488" />
              </svg>
              Chat via WhatsApp
            </a>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="reveal delay-2 bg-card-bg rounded-[10px] p-8 shadow-sm border"
            style={{ borderColor: "var(--border)" }}
          >
            <h3 className="font-bold text-[22px] mb-1">Minta Penawaran</h3>
            <p className="text-text-muted text-sm mb-6">
              Isi form di bawah, kami balas via WhatsApp.
            </p>

            {[
              { id: "nama", label: "Nama Lengkap", type: "text", placeholder: "Nama Anda" },
              { id: "wa", label: "Nomor WhatsApp", type: "tel", placeholder: "08xx xxxx xxxx" },
            ].map((f) => (
              <div key={f.id} className="mb-4">
                <label
                  htmlFor={f.id}
                  className="block text-[13px] font-medium mb-1.5 text-text-dark"
                >
                  {f.label}
                </label>
                <input
                  type={f.type}
                  id={f.id}
                  name={f.id}
                  placeholder={f.placeholder}
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-[6px] border outline-none transition-all focus:border-gold"
                  style={{ borderColor: "var(--border)", background: "var(--bg-base)" }}
                />
              </div>
            ))}

            <div className="mb-4">
              <label
                htmlFor="produk"
                className="block text-[13px] font-medium mb-1.5 text-text-dark"
              >
                Produk yang Diminati
              </label>
              <select
                id="produk"
                name="produk"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-[6px] border outline-none transition-all focus:border-gold"
                style={{ borderColor: "var(--border)", background: "var(--bg-base)" }}
              >
                <option value="">— Pilih produk —</option>
                {[
                  "GRC Board",
                  "Conwood (Dekoratif & CNC)",
                  "Waterproofing Bitmix",
                  "Tensile Membrane",
                  "Wallspan GKD (Fasad Metal)",
                  "Tegola Canadese (Genteng Bitumen)",
                  "Vinyl Floor Gerfloor",
                  "Konsultasi / Lainnya",
                ].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label
                htmlFor="ket"
                className="block text-[13px] font-medium mb-1.5 text-text-dark"
              >
                Keterangan Proyek
              </label>
              <textarea
                id="ket"
                name="ket"
                rows={4}
                placeholder="Volume / lokasi / target tanggal kirim..."
                className="w-full px-3.5 py-2.5 text-sm rounded-[6px] border outline-none transition-all focus:border-gold resize-none"
                style={{ borderColor: "var(--border)", background: "var(--bg-base)" }}
              />
            </div>

            <button
              type="submit"
              className="w-full btn btn-gold justify-center text-[15px]"
            >
              {sent ? "Terkirim ✓" : <>Kirim via WhatsApp <span className="arrow">→</span></>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

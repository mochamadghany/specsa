"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/products";

const links = [
  { href: "#tentang", label: "Tentang" },
  { href: "#produk", label: "Produk", hasProducts: true },
  { href: "#layanan", label: "Layanan" },
  { href: "#proyek", label: "Proyek" },
  { href: "#kontak", label: "Kontak" },
];

function ChevronDown() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      setHidden(y > lastY.current && y > 80);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setMobileOpen(false);

  return (
    <>
      <nav
        className={[
          "sticky top-0 z-50 bg-white/96 border-b backdrop-saturate-180 backdrop-blur-[10px] transition-all duration-300",
          scrolled ? "shadow-[0_6px_24px_rgba(26,24,20,0.08)]" : "",
          hidden ? "-translate-y-full" : "translate-y-0",
        ].join(" ")}
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-container mx-auto px-8 flex items-center justify-between h-[76px]">
          <a href="#" className="flex items-center gap-3">
            <div
              className="w-[38px] h-[38px] rounded-lg flex items-center justify-center text-white font-bold text-[14px] tracking-wider shadow-[0_4px_12px_rgba(155,117,53,0.3)]"
              style={{
                background:
                  "linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)",
              }}
            >
              SP
            </div>
            <div className="font-semibold text-[15px] tracking-[-0.005em] text-text-dark">
              Specsa Solusi Pratama
              <small
                className="block text-[9px] font-normal text-text-muted tracking-[0.12em] uppercase mt-0.5"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Building Material Supplier
              </small>
            </div>
          </a>

          <ul className="hidden lg:flex gap-7 items-center">
            {links.map((l) => (
              <li key={l.href} className={l.hasProducts ? "relative group" : ""}>
                <a
                  href={l.href}
                  className="text-sm text-text-dark relative py-1.5 transition-colors duration-200 hover:text-gold group/nav inline-flex items-center gap-1.5"
                >
                  {l.label}
                  {l.hasProducts ? <ChevronDown /> : null}
                  <span className="absolute left-0 bottom-0 w-0 h-px bg-gold transition-all duration-[250ms] group-hover/nav:w-full" />
                </a>
                {l.hasProducts ? (
                  <div className="invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 focus-within:visible focus-within:opacity-100 focus-within:translate-y-0 absolute left-1/2 top-full w-[280px] -translate-x-1/2 pt-4 transition-all duration-200">
                    <div className="rounded-[8px] border bg-white p-2 shadow-lg" style={{ borderColor: "var(--border)" }}>
                      <a
                        href="#produk"
                        className="block rounded-md px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-gold hover:bg-bg-soft"
                      >
                        Semua Produk
                      </a>
                      {products.map((product) => (
                        <a
                          key={product.id}
                          href={`#product-${product.id}`}
                          className="block rounded-md px-3 py-2.5 transition-colors hover:bg-bg-soft"
                        >
                          <span className="block text-[13px] font-semibold text-text-dark">
                            {product.name}
                          </span>
                          <span className="block text-[11px] text-text-muted">
                            {product.badge}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#kontak"
              className="hidden lg:inline-flex btn btn-gold btn-pill"
            >
              Minta Penawaran <span className="arrow">→</span>
            </a>
            <button
              className="lg:hidden w-[38px] h-[38px] rounded-lg border flex items-center justify-center"
              style={{ borderColor: "var(--border)" }}
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-[18px] h-[18px]"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.aside
              className="fixed right-0 top-0 bottom-0 z-50 w-[300px] bg-white p-8 flex flex-col gap-1 shadow-lg overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <button
                className="self-end mb-6 w-9 h-9 rounded-lg border flex items-center justify-center"
                style={{ borderColor: "var(--border)" }}
                onClick={close}
                aria-label="Tutup"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              {links.map((l) => (
                <div key={l.href}>
                  <a
                    href={l.href}
                    onClick={close}
                    className="py-3 text-[15px] font-medium text-text-dark border-b transition-colors hover:text-gold flex items-center justify-between"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {l.label}
                    {l.hasProducts ? <ChevronDown /> : null}
                  </a>
                  {l.hasProducts ? (
                    <div className="py-2 pl-3">
                      {products.map((product) => (
                        <a
                          key={product.id}
                          href={`#product-${product.id}`}
                          onClick={close}
                          className="block py-2 text-[13px] text-text-muted hover:text-gold"
                        >
                          {product.name}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              <a
                href="#kontak"
                onClick={close}
                className="btn btn-gold mt-4 justify-center"
              >
                Minta Penawaran →
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import Image from "next/image";
import { products } from "@/lib/products";
import { heroSliderImages } from "@/lib/hero-images";

const formatRp = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

type Condition = "standard" | "renovasi" | "cnc";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [slide, setSlide] = useState(0);
  const [productId, setProductId] = useState(products[0].id);
  const [area, setArea] = useState("50");
  const [waste, setWaste] = useState(Math.round(products[0].wasteFactor * 100));
  const [condition, setCondition] = useState<Condition>("standard");

  const selectedProduct =
    products.find((product) => product.id === productId) ?? products[0];

  useEffect(() => {
    const product = products.find((item) => item.id === productId) ?? products[0];
    setWaste(Math.round(product.wasteFactor * 100));
    setCondition("standard");
  }, [productId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % heroSliderImages.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 1) {
      positions[i] = (Math.random() - 0.5) * 14;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.045,
      color: new THREE.Color("#9B7535"),
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let frame = 0;
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      frame += 0.003;
      points.rotation.y = frame * 0.18;
      points.rotation.x = Math.sin(frame * 0.4) * 0.06;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    };
  }, []);

  const calc = useMemo(() => {
    const parsedArea = Number.parseFloat(area);
    const cleanArea = Number.isFinite(parsedArea) && parsedArea > 0 ? parsedArea : 0;
    const conditionMultiplier = {
      standard: 1,
      renovasi: 1.1,
      cnc: 1.2,
    }[condition];
    const netUnits = cleanArea / selectedProduct.coverage;
    const qty = cleanArea
      ? Math.ceil(netUnits * (1 + waste / 100) * conditionMultiplier)
      : 0;

    return {
      cleanArea,
      netUnits,
      qty,
      min: qty * selectedProduct.priceMin,
      max: qty * selectedProduct.priceMax,
    };
  }, [area, condition, selectedProduct, waste]);

  const quoteText = encodeURIComponent(
    `Halo Specsa, saya butuh ${calc.qty} ${selectedProduct.unit} ${selectedProduct.name} untuk area ${calc.cleanArea}m2. Mohon info harga terbaiknya.`
  );

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  const stats = [
    { num: "7+", lbl: "Kategori Produk" },
    { num: "B2B", lbl: "Focused Supply" },
    { num: "100%", lbl: "On-Schedule" },
    { num: "Jabodetabek", lbl: "Coverage Area" },
  ];

  return (
    <header className="relative min-h-screen flex flex-col justify-end text-white overflow-hidden bg-[#0e0c09]">
      <div className="absolute inset-0 z-0">
        {heroSliderImages.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            className={[
              "object-cover saturate-95 brightness-[0.85] transition-opacity duration-1000",
              slide === index ? "opacity-100" : "opacity-0",
            ].join(" ")}
            sizes="100vw"
          />
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] w-full h-full pointer-events-none"
      />

      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(90deg, rgba(14,12,9,0.92) 0%, rgba(14,12,9,0.78) 38%, rgba(14,12,9,0.42) 72%, rgba(14,12,9,0.22) 100%), linear-gradient(180deg, rgba(14,12,9,0.08) 30%, rgba(14,12,9,0.68) 100%)",
        }}
      />

      <div className="relative z-[3] max-w-container mx-auto px-8 flex flex-col flex-1 pt-[120px] pb-9 w-full">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_420px] gap-10 lg:gap-14 items-end mt-auto mb-10 lg:mb-16">
          <div className="max-w-[690px]">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full text-white backdrop-blur-[6px] mb-6"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "var(--gold-light)",
                  boxShadow: "0 0 0 4px rgba(184,147,63,0.2)",
                }}
              />
              Building Material Supplier - Tangerang Selatan
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="font-bold leading-[1.02] tracking-[-0.025em] text-balance mb-[22px]"
              style={{ fontSize: "clamp(42px, 5.8vw, 82px)" }}
            >
              Supplier Material Bangunan{" "}
              <em className="not-italic" style={{ color: "var(--gold-light)" }}>
                Terpercaya
              </em>{" "}
              untuk Proyek Anda.
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-[17px] text-white/78 max-w-[560px] leading-[1.55]"
            >
              Material berkualitas untuk proyek konstruksi, developer, dan industri.
              Kompetitif, responsif, on-schedule dari skala toko ritel hingga proyek
              skala besar.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex gap-3.5 mt-8 flex-wrap"
            >
              <a href="#produk" className="btn btn-gold">
                Lihat Produk <span className="arrow">→</span>
              </a>
              <a href="#kontak" className="btn btn-outline">
                Konsultasi Gratis
              </a>
            </motion.div>
          </div>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="rounded-[10px] border border-white/15 bg-[#17130f]/82 p-5 sm:p-6 shadow-lg backdrop-blur-[18px]"
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <span
                  className="text-[10px] uppercase text-gold-light"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}
                >
                  Kalkulator Harga
                </span>
                <h2 className="text-[23px] font-bold tracking-[-0.01em] mt-1">
                  Estimasi kebutuhan proyek
                </h2>
              </div>
              <div className="text-right text-[11px] text-white/55">
                Live estimate
              </div>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-[12px] font-semibold text-white/75">
                  Produk
                </span>
                <select
                  value={productId}
                  onChange={(event) => setProductId(event.target.value)}
                  className="h-11 rounded-md border border-white/15 bg-white/10 px-3 text-sm text-white outline-none focus:border-gold-light"
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id} className="text-text-dark">
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="flex items-center justify-between gap-3 text-[12px] font-semibold text-white/75">
                  Luas Area Proyek
                  <span className="font-normal text-white/45">{selectedProduct.calcLabel}</span>
                </span>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="99999"
                    step="0.1"
                    value={area}
                    onChange={(event) => setArea(event.target.value)}
                    className="h-12 w-full rounded-md border border-white/15 bg-white/10 px-3 pr-12 text-[15px] text-white outline-none focus:border-gold-light"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-white/55">
                    m2
                  </span>
                </div>
              </label>

              <label className="grid gap-2">
                <span className="flex items-center justify-between text-[12px] font-semibold text-white/75">
                  Waste & Cutting
                  <span className="text-gold-light">{waste}%</span>
                </span>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={waste}
                  onChange={(event) => setWaste(Number(event.target.value))}
                  className="accent-gold-light"
                />
              </label>

              <div className="grid gap-2">
                <span className="text-[12px] font-semibold text-white/75">
                  Kondisi Proyek
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["standard", "Standar"],
                    ["renovasi", "Renovasi +10%"],
                    ...(selectedProduct.cnc ? [["cnc", "Custom CNC +20%"]] : []),
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      className={[
                        "rounded-md border px-3 py-2 text-[12px] transition-colors",
                        condition === value
                          ? "border-gold-light bg-gold-light/18 text-white"
                          : "border-white/15 bg-white/5 text-white/70",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        value={value}
                        checked={condition === value}
                        onChange={() => setCondition(value as Condition)}
                        className="sr-only"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[8px] border border-gold/25 bg-black/24 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] uppercase text-white/48">Kebutuhan</div>
                  <div className="mt-1 text-[30px] font-bold leading-none text-white">
                    {calc.qty.toLocaleString("id-ID")}
                  </div>
                  <div className="mt-1 text-[12px] text-white/58">
                    {selectedProduct.unit}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-white/48">Estimasi Harga</div>
                  <div className="mt-1 text-[16px] font-bold text-gold-light">
                    {formatRp(calc.min)}
                  </div>
                  <div className="text-[12px] text-white/58">s.d. {formatRp(calc.max)}</div>
                </div>
              </div>
              <div className="mt-4 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-white/55">
                Kebutuhan bersih {calc.netUnits.toFixed(2)} {selectedProduct.unit},
                termasuk {waste}% waste & cutting. Harga aktual menyesuaikan
                spesifikasi, volume, dan stok.
              </div>
            </div>

            <a
              href={`https://wa.me/6281210511526?text=${quoteText}`}
              target="_blank"
              rel="noopener"
              className="btn btn-gold mt-5 w-full justify-center"
            >
              Minta Penawaran untuk Jumlah Ini <span className="arrow">→</span>
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-[3] backdrop-blur-[12px]"
        style={{
          background: "rgba(26,24,20,0.55)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 max-w-container mx-auto px-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="py-7 px-6 flex flex-col gap-1"
              style={{
                borderRight:
                  i < stats.length - 1
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
              }}
            >
              <div className="font-bold text-[28px] text-white tracking-[-0.02em]">
                {s.num}
              </div>
              <div
                className="text-[10px] text-white/60 uppercase tracking-[0.12em]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </header>
  );
}

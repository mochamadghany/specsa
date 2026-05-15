"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import Image from "next/image";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 5;

    // Floating particles
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
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

    let w = canvas.clientWidth;
    let h = canvas.clientHeight;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
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
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt="Proyek konstruksi"
          fill
          priority
          className="object-cover saturate-95 brightness-[0.85]"
        />
      </div>

      {/* Three.js particles overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] w-full h-full pointer-events-none"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(90deg, rgba(14,12,9,0.92) 0%, rgba(14,12,9,0.7) 35%, rgba(14,12,9,0.3) 70%, rgba(14,12,9,0.15) 100%), linear-gradient(180deg, rgba(14,12,9,0) 30%, rgba(14,12,9,0.55) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-[3] max-w-container mx-auto px-8 flex flex-col flex-1 pt-[120px] pb-9">
        <div className="max-w-[680px] mt-auto mb-16">
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
            Building Material Supplier · Tangerang Selatan
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="font-bold leading-[1.02] tracking-[-0.025em] text-balance mb-[22px]"
            style={{ fontSize: "clamp(44px, 6.2vw, 88px)" }}
          >
            Supplier Material Bangunan{" "}
            <em
              className="not-italic"
              style={{ color: "var(--gold-light)" }}
            >
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
            Kompetitif, responsif, on-schedule — dari skala toko ritel hingga proyek
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
      </div>

      {/* Stats bar */}
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

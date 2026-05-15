"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";

const formatRp = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

type Condition = "standard" | "renovasi" | "cnc";

export default function ProductCalculator({ product }: { product: Product }) {
  const [area, setArea] = useState("50");
  const [waste, setWaste] = useState(Math.round(product.wasteFactor * 100));
  const [condition, setCondition] = useState<Condition>("standard");

  const calc = useMemo(() => {
    const parsedArea = Number.parseFloat(area);
    const cleanArea = Number.isFinite(parsedArea) && parsedArea > 0 ? parsedArea : 0;
    const multiplier = { standard: 1, renovasi: 1.1, cnc: 1.2 }[condition];
    const netUnits = cleanArea / product.coverage;
    const qty = cleanArea ? Math.ceil(netUnits * (1 + waste / 100) * multiplier) : 0;

    return {
      cleanArea,
      netUnits,
      qty,
      min: qty * product.priceMin,
      max: qty * product.priceMax,
    };
  }, [area, condition, product, waste]);

  const quoteText = encodeURIComponent(
    `Halo Specsa, saya butuh ${calc.qty} ${product.unit} ${product.name} untuk area ${calc.cleanArea}m2. Mohon info harga terbaiknya.`
  );

  return (
    <div className="rounded-[10px] border border-gold/20 bg-[#17130f] p-5 sm:p-6 shadow-lg text-white">
      <div className="mb-5">
        <span
          className="text-[10px] uppercase text-gold-light"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}
        >
          Kalkulator Harga
        </span>
        <h2 className="text-[23px] font-bold tracking-[-0.01em] mt-1">
          Estimasi kebutuhan {product.name}
        </h2>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2">
          <span className="flex items-center justify-between gap-3 text-[12px] font-semibold text-white/75">
            Luas Area Proyek
            <span className="font-normal text-white/45">{product.calcLabel}</span>
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
          <span className="text-[12px] font-semibold text-white/75">Kondisi Proyek</span>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["standard", "Standar"],
              ["renovasi", "Renovasi +10%"],
              ...(product.cnc ? [["cnc", "Custom CNC +20%"]] : []),
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
            <div className="mt-1 text-[30px] font-bold leading-none">
              {calc.qty.toLocaleString("id-ID")}
            </div>
            <div className="mt-1 text-[12px] text-white/58">{product.unit}</div>
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
          Kebutuhan bersih {calc.netUnits.toFixed(2)} {product.unit}, termasuk {waste}%
          waste & cutting.
        </div>
      </div>

      <a
        href={`https://wa.me/6281210511526?text=${quoteText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-gold mt-5 w-full justify-center"
      >
        Minta Penawaran untuk Jumlah Ini <span className="arrow">→</span>
      </a>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent } from "@/lib/site-content";

type LoadState = "idle" | "loading" | "ready" | "saving" | "error" | "saved";

const cmsHelp = [
  "Edit site untuk nama, URL, kontak, dan WhatsApp.",
  "Edit pages.[slug] untuk headline, CTA, section, dan SEO.",
  "Set CMS_PASSWORD di hPanel agar dashboard tidak memakai password default.",
];

export default function CmsPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");

  const parsed = useMemo(() => {
    try {
      return jsonText ? (JSON.parse(jsonText) as SiteContent) : null;
    } catch {
      return null;
    }
  }, [jsonText]);

  function getStoredPassword() {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("specsa-cms-password") || password;
  }

  async function loadContent() {
    const activePassword = getStoredPassword();
    if (!activePassword) {
      router.push("/cms/login");
      return;
    }
    setPassword(activePassword);
    setState("loading");
    setMessage("");
    const res = await fetch("/api/cms", {
      headers: {
        "Content-Type": "application/json",
        "x-cms-password": activePassword,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      setState("error");
      setMessage(data.error || "Gagal membuka CMS.");
      if (res.status === 401) router.push("/cms/login");
      return;
    }
    setJsonText(JSON.stringify(data.content, null, 2));
    setState("ready");
  }

  async function saveContent() {
    const activePassword = getStoredPassword();
    if (!activePassword) {
      router.push("/cms/login");
      return;
    }
    if (!parsed) {
      setState("error");
      setMessage("JSON belum valid. Periksa koma, kutip, dan struktur objek.");
      return;
    }
    setState("saving");
    setMessage("");
    const res = await fetch("/api/cms", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-cms-password": activePassword,
      },
      body: JSON.stringify(parsed),
    });
    const data = await res.json();
    if (!res.ok) {
      setState("error");
      setMessage(data.error || "Gagal menyimpan konten.");
      if (res.status === 401) router.push("/cms/login");
      return;
    }
    setJsonText(JSON.stringify(data.content, null, 2));
    setState("saved");
    setMessage("Konten dan SEO tersimpan. Refresh halaman publik untuk melihat perubahan.");
  }

  return (
    <main className="min-h-screen bg-bg-base text-text-dark">
      <section className="border-b bg-bg-dark text-white" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-container mx-auto px-8 py-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span
                className="text-[11px] uppercase text-gold-light"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}
              >
                Specsa CMS
              </span>
              <h1 className="mt-3 text-[36px] font-bold tracking-[-0.02em]">
                Dashboard Konten & SEO
              </h1>
              <p className="mt-3 max-w-[680px] text-white/68">
                Dashboard ini mengatur isi halaman detail navbar dan metadata SEO.
                Data disimpan di server pada file <code>data/content.json</code>.
              </p>
            </div>
            <a href="/" className="btn btn-outline">
              Lihat Website
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-container mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
          <aside className="rounded-[10px] border bg-card-bg p-5 shadow-sm" style={{ borderColor: "var(--border)" }}>
            <button
              type="button"
              onClick={loadContent}
              disabled={state === "loading"}
              className="btn btn-gold mt-4 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
            >
              {state === "loading" ? "Membuka..." : "Buka Konten"}
            </button>
            <button
              type="button"
              onClick={() => {
                window.localStorage.removeItem("specsa-cms-password");
                router.push("/cms/login");
              }}
              className="mt-3 w-full rounded-md border px-4 py-2.5 text-sm font-semibold text-text-muted hover:text-gold"
              style={{ borderColor: "var(--border)" }}
            >
              Logout / Ganti Password
            </button>

            <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--border)" }}>
              <h2 className="text-[14px] font-bold">Panduan Singkat</h2>
              <ul className="mt-3 grid gap-3">
                {cmsHelp.map((item) => (
                  <li key={item} className="flex gap-2 text-[13px] leading-relaxed text-text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-md bg-bg-soft p-3 text-[12px] leading-relaxed text-text-muted">
                Password default development: <strong>specsa-admin</strong>. Ganti
                dengan env <strong>CMS_PASSWORD</strong> di hPanel untuk production.
              </div>
            </div>
          </aside>

          <section className="rounded-[10px] border bg-card-bg shadow-sm" style={{ borderColor: "var(--border)" }}>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b p-5" style={{ borderColor: "var(--border)" }}>
              <div>
                <h2 className="font-bold">Editor JSON</h2>
                <p className="mt-1 text-[13px] text-text-muted">
                  Status: {state} {parsed ? "- JSON valid" : jsonText ? "- JSON belum valid" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={saveContent}
                disabled={!parsed || state === "saving" || state === "loading"}
                className="btn btn-gold disabled:cursor-not-allowed disabled:opacity-50"
              >
                {state === "saving" ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>

            {message ? (
              <div
                className={[
                  "mx-5 mt-5 rounded-md px-4 py-3 text-sm",
                  state === "error"
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700",
                ].join(" ")}
              >
                {message}
              </div>
            ) : null}

            <div className="p-5">
              <textarea
                value={jsonText}
                onChange={(event) => {
                  setJsonText(event.target.value);
                  if (state === "saved") setState("ready");
                }}
                spellCheck={false}
                placeholder="Klik Buka Konten untuk memuat data CMS."
                className="min-h-[68vh] w-full resize-y rounded-md border bg-[#11100e] p-4 font-mono text-[12px] leading-relaxed text-white outline-none focus:border-gold"
                style={{ borderColor: "var(--border)" }}
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

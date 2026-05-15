"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CmsLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/cms/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setLoading(false);
      setError("Password salah atau CMS_PASSWORD belum sesuai di server.");
      return;
    }

    router.push("/cms");
  }

  return (
    <main className="min-h-screen bg-bg-dark text-white grid place-items-center px-6">
      <section className="w-full max-w-[420px] rounded-[10px] border border-white/12 bg-white/8 p-7 shadow-lg backdrop-blur-[18px]">
        <a
          href="/"
          className="text-[11px] uppercase tracking-[0.12em] text-white/52 hover:text-gold-light"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Specsa Website
        </a>
        <h1 className="mt-5 text-[32px] font-bold tracking-[-0.02em]">
          Login CMS
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/62">
          Masukkan password CMS untuk mengatur konten halaman dan SEO website.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
          <label className="grid gap-2">
            <span className="text-[13px] font-semibold text-white/76">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoFocus
              required
              placeholder="CMS_PASSWORD"
              className="h-12 rounded-md border border-white/16 bg-white/10 px-3 text-white outline-none focus:border-gold-light"
            />
          </label>

          {error ? (
            <div className="rounded-md bg-red-500/12 px-3 py-2 text-sm text-red-100">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold justify-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Memeriksa..." : "Masuk Dashboard"}
          </button>
        </form>

        <div className="mt-5 rounded-md bg-black/22 p-3 text-[12px] leading-relaxed text-white/48">
          Default development: <strong>specsa-admin</strong>. Untuk production,
          set env <strong>CMS_PASSWORD</strong> di hPanel.
        </div>
      </section>
    </main>
  );
}

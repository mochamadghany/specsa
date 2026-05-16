"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

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
      headers: { "Content-Type": "application/json" },
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
    <main className={styles.login}>
      <section className={styles.panel}>
        <div className={styles.head}>
          <div className={styles.mark}>S</div>
          <div>
            <div className={styles.brand}>Specsa</div>
            <div className={styles.sub}>Admin Dashboard</div>
          </div>
        </div>

        <div className={styles.body}>
          <h1 className={styles.title}>Login CMS</h1>
          <p className={styles.copy}>
            Masuk untuk mengelola konten, SEO, produk, proyek, media, dan inquiry website.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.field}>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoFocus
                required
                placeholder="CMS_PASSWORD"
                className={styles.input}
              />
            </label>

            {error ? <div className={styles.error}>{error}</div> : null}

            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? "Memeriksa..." : "Masuk Dashboard"}
            </button>
          </form>

          <div className={styles.foot}>
            <a href="/" className={styles.link}>Kembali ke website</a>
            <span>Session 8 jam</span>
          </div>
        </div>
      </section>
    </main>
  );
}

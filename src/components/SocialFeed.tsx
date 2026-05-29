"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type InstagramPost = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  display_url?: string;
  permalink: string;
  timestamp: string;
};

type InstagramResponse = {
  connected: boolean;
  posts: InstagramPost[];
  message?: string;
};

export type SocialFeedProps = {
  instagramHandle: string;
  instagramUrl: string;
  instagramEnabled: boolean;
  facebookPageUrl: string;
  facebookEnabled: boolean;
};

const fallbackPosts: InstagramPost[] = [
  {
    id: "fallback-1",
    caption: "Dokumentasi proyek fasad dan material pilihan Specsa.",
    media_type: "IMAGE",
    display_url: "/images/project-ifc.png",
    permalink: "https://www.instagram.com/",
    timestamp: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    caption: "Update produk, stok, dan proses pengiriman untuk kebutuhan proyek.",
    media_type: "IMAGE",
    display_url: "/images/product-wallspan.png",
    permalink: "https://www.instagram.com/",
    timestamp: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    caption: "Referensi aplikasi material pada bangunan komersial dan fasilitas publik.",
    media_type: "IMAGE",
    display_url: "/images/project-bkk.png",
    permalink: "https://www.instagram.com/",
    timestamp: new Date().toISOString(),
  },
  {
    id: "fallback-4",
    caption: "Solusi waterproofing dan proteksi untuk berbagai area bangunan.",
    media_type: "IMAGE",
    display_url: "/images/project-flyover.png",
    permalink: "https://www.instagram.com/",
    timestamp: new Date().toISOString(),
  },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function trimCaption(value?: string) {
  if (!value) return "Lihat update terbaru Specsa di Instagram.";
  return value.length > 116 ? `${value.slice(0, 116).trim()}...` : value;
}

export default function SocialFeed({
  instagramHandle,
  instagramUrl,
  instagramEnabled,
  facebookPageUrl,
  facebookEnabled,
}: SocialFeedProps) {
  const ref = useRef<HTMLElement>(null);
  const [feed, setFeed] = useState<InstagramResponse>({
    connected: false,
    posts: fallbackPosts,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    el.querySelectorAll(".reveal").forEach((item) => obs.observe(item));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!instagramEnabled) return;
    let mounted = true;

    fetch("/api/instagram", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: InstagramResponse) => {
        if (!mounted) return;
        setFeed({
          ...json,
          posts: json.posts?.length ? json.posts : fallbackPosts,
        });
      })
      .catch(() => {
        if (!mounted) return;
        setFeed({ connected: false, posts: fallbackPosts });
      });

    return () => {
      mounted = false;
    };
  }, [instagramEnabled]);

  const posts = useMemo(() => feed.posts.slice(0, 4), [feed.posts]);
  const handle = instagramHandle.replace(/^@/, "");

  const fbSrc = facebookPageUrl
    ? `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
        facebookPageUrl
      )}&tabs=timeline&width=380&height=520&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`
    : "";

  if (!instagramEnabled && !facebookEnabled) return null;

  return (
    <section
      ref={ref}
      id="sosial-media"
      className="py-24"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-container mx-auto px-8">
        <div className="flex justify-between items-end gap-12 mb-12 flex-wrap">
          <div className="reveal">
            <span className="label">06 - Social Media</span>
            <h2 className="h-display mt-4 max-w-[620px]">
              Update Lapangan & Produk Terbaru.
            </h2>
          </div>
          <div className="max-w-[360px] reveal delay-1">
            <p className="text-text-muted text-sm leading-relaxed">
              Ikuti update proyek, produk, dan aktivitas Specsa langsung dari
              Instagram dan Facebook resmi kami.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Instagram */}
          {instagramEnabled ? (
            <div className="lg:col-span-2 reveal">
              <div className="mb-5 flex items-center justify-between gap-4">
                <span
                  className="text-[11px] uppercase tracking-[0.14em] text-gold"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {feed.connected ? "Live dari Instagram" : "Instagram"}
                </span>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[8px] px-4 py-2 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{
                    background: "var(--gold)",
                    boxShadow: "0 6px 16px rgba(155,117,53,0.22)",
                  }}
                >
                  @{handle}
                  <span aria-hidden="true">-&gt;</span>
                </a>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {posts.map((post) => (
                  <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group overflow-hidden rounded-[10px] border bg-card-bg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-md"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div
                      className="relative aspect-square overflow-hidden"
                      style={{ background: "var(--bg-soft)" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.display_url || "/images/project-ifc.png"}
                        alt={trimCaption(post.caption)}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur">
                        {post.media_type === "VIDEO" ? "Video" : "Post"}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[13px] leading-relaxed text-text-dark">
                        {trimCaption(post.caption)}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3 text-[12px] text-text-muted">
                        <span>{formatDate(post.timestamp)}</span>
                        <span className="font-semibold text-gold">Lihat post</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              {!feed.connected ? (
                <div
                  className="mt-5 rounded-[10px] border px-5 py-4 text-[13px] leading-relaxed text-text-muted"
                  style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
                >
                  Feed Instagram live akan aktif setelah User ID & access token
                  Instagram dipasang di Settings dashboard.
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Facebook */}
          {facebookEnabled && fbSrc ? (
            <div className={`reveal ${instagramEnabled ? "delay-1" : "lg:col-span-3"}`}>
              <div className="mb-5 flex items-center justify-between gap-4">
                <span
                  className="text-[11px] uppercase tracking-[0.14em] text-gold"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Live dari Facebook
                </span>
                <a
                  href={facebookPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-semibold text-gold hover:text-gold-light"
                >
                  Kunjungi Halaman -&gt;
                </a>
              </div>
              <div
                className="overflow-hidden rounded-[10px] border bg-card-bg shadow-sm"
                style={{ borderColor: "var(--border)" }}
              >
                <iframe
                  title="Facebook Page Specsa"
                  src={fbSrc}
                  className="w-full"
                  style={{ border: "none", overflow: "hidden", height: 520 }}
                  scrolling="no"
                  frameBorder={0}
                  allow="encrypted-media"
                  loading="lazy"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

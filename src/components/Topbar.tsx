"use client";

export default function Topbar() {
  return (
    <div
      className="hidden md:block bg-bg-dark text-white/55 font-mono text-[10px] tracking-[0.08em] uppercase"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <div className="max-w-container mx-auto px-8 flex items-center justify-between min-h-[36px] py-2.5 gap-6 flex-wrap">
        <div className="flex gap-6 flex-wrap">
          <span className="inline-flex items-center gap-2">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="opacity-70"
            >
              <path d="M4 4h16v16H4z" />
              <path d="M4 8l8 5 8-5" />
            </svg>
            info@specsa.id
          </span>
          <span className="inline-flex items-center gap-2">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="opacity-70"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.86 12.7a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            0812 105 1526
          </span>
        </div>
        <div>Senin–Jumat · 08.00–17.00 WIB</div>
      </div>
    </div>
  );
}

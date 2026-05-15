import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-base": "#F7F5F1",
        "bg-soft": "#EFECE6",
        "bg-dark": "#1A1814",
        gold: "#9B7535",
        "gold-light": "#B8933F",
        "text-dark": "#1A1814",
        "text-muted": "#6B6356",
        "card-bg": "#FFFFFF",
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        container: "1280px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(26,24,20,0.04), 0 2px 6px rgba(26,24,20,0.04)",
        md: "0 4px 12px rgba(26,24,20,0.06), 0 12px 32px rgba(26,24,20,0.08)",
        lg: "0 18px 48px rgba(26,24,20,0.18)",
      },
    },
  },
  plugins: [],
};
export default config;

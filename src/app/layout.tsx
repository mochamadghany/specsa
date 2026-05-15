import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "PT. Specsa Solusi Pratama — Supplier Material Bangunan Tangerang Selatan",
  description:
    "PT. Specsa Solusi Pratama — supplier material bangunan untuk kontraktor, developer, industri & retail di Jabodetabek. GRC, Conwood, Bitmix, Tensile Membrane, Wallspan GKD, Tegola, Gerfloor.",
  keywords:
    "supplier material bangunan, GRC board, conwood, waterproofing bitmix, tensile membrane, wallspan GKD, genteng bitumen tegola, vinyl gerfloor, kontraktor tangerang, jabodetabek",
  authors: [{ name: "PT. Specsa Solusi Pratama" }],
  openGraph: {
    title: "PT. Specsa Solusi Pratama — Trusted Building Material Partner",
    description:
      "Material berkualitas untuk proyek konstruksi, developer, dan industri. Kompetitif, responsif, on-schedule.",
    type: "website",
    locale: "id_ID",
    url: "https://specsa.id",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${spaceMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

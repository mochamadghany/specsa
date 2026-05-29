import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import FloatingActions from "@/components/FloatingActions";
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
  metadataBase: new URL("https://specsa.id"),
  title: {
    default: "Supplier Material Bangunan Jabodetabek | Specsa Solusi Pratama",
    template: "%s | Specsa Solusi Pratama",
  },
  description:
    "Specsa Solusi Pratama — supplier material bangunan terpercaya di Jabodetabek untuk kontraktor, developer, industri & retail. Membrane tensile, GRC & viber semen, waterproofing, dan protection solution. Harga kompetitif, konsultasi teknis gratis, kirim sesuai jadwal proyek.",
  keywords: [
    "supplier material bangunan",
    "supplier material bangunan jabodetabek",
    "distributor material konstruksi",
    "tensile membrane",
    "GRC board",
    "conwood",
    "viber semen",
    "waterproofing",
    "protection solution",
    "harga material bangunan",
    "kontraktor tangerang selatan",
    "material proyek",
  ],
  applicationName: "Specsa Solusi Pratama",
  authors: [{ name: "PT. Specsa Solusi Pratama", url: "https://specsa.id" }],
  creator: "PT. Specsa Solusi Pratama",
  publisher: "PT. Specsa Solusi Pratama",
  category: "Building Materials",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Supplier Material Bangunan Jabodetabek | Specsa Solusi Pratama",
    description:
      "Material bangunan berkualitas untuk proyek konstruksi, developer, dan industri di Jabodetabek. Kompetitif, responsif, on-schedule.",
    url: "https://specsa.id",
    siteName: "PT. Specsa Solusi Pratama",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/images/logo-specsa.png",
        width: 991,
        height: 363,
        alt: "Specsa Solusi Pratama",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Supplier Material Bangunan Jabodetabek | Specsa Solusi Pratama",
    description:
      "Supplier material bangunan terpercaya di Jabodetabek: tensile membrane, GRC, waterproofing & protection solution.",
    images: ["/images/logo-specsa.png"],
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${spaceMono.variable}`}>
      <body className="antialiased">
        {children}
        <FloatingActions />
      </body>
    </html>
  );
}

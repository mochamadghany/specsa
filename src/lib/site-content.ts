import fs from "node:fs";
import path from "node:path";
import { products } from "./products";

export type SeoContent = {
  title: string;
  description: string;
  keywords: string;
};

export type DetailPageContent = {
  slug: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  lead: string;
  heroImage: string;
  ctaLabel: string;
  ctaHref: string;
  sections: Array<{
    title: string;
    body: string;
    items: string[];
  }>;
  seo: SeoContent;
};

export type SiteContent = {
  site: {
    name: string;
    url: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
  };
  pages: Record<string, DetailPageContent>;
};

export const defaultSiteContent: SiteContent = {
  site: {
    name: "PT. Specsa Solusi Pratama",
    url: "https://specsa.id",
    phone: "0812 105 1526",
    whatsapp: "6281210511526",
    email: "info@specsa.id",
    address:
      "Ruko Bintaro Terrace 2 No.7, Jl. Sumatera, Ciputat, Tangerang Selatan 15414",
  },
  pages: {
    tentang: {
      slug: "tentang",
      navLabel: "Tentang",
      eyebrow: "Tentang Specsa",
      title: "Mitra pengadaan material untuk proyek yang butuh kepastian.",
      lead:
        "Specsa membantu kontraktor, developer, instansi, dan industri mendapatkan material bangunan berkualitas dengan proses yang responsif, transparan, dan tepat waktu.",
      heroImage: "/images/about.png",
      ctaLabel: "Konsultasi kebutuhan proyek",
      ctaHref: "/kontak",
      sections: [
        {
          title: "Fokus Kami",
          body:
            "Kami menggabungkan jaringan produk, pemahaman teknis, dan koordinasi pengiriman untuk membuat proses pengadaan terasa lebih ringan bagi tim proyek.",
          items: [
            "Supply material untuk kebutuhan konstruksi dan renovasi",
            "Rekomendasi produk sesuai aplikasi lapangan",
            "Dukungan pengiriman terjadwal di Jabodetabek",
          ],
        },
        {
          title: "Nilai Kerja",
          body:
            "S.P.E.C.S.A menjadi cara kami menjaga standar layanan dari permintaan awal sampai material diterima.",
          items: [
            "Service yang responsif",
            "Professional dalam komunikasi dan dokumentasi",
            "Efficiency pada pilihan material dan waktu kirim",
            "Commitment, Safety, dan Accountability",
          ],
        },
      ],
      seo: {
        title: "Tentang Specsa - Supplier Material Bangunan Tangerang Selatan",
        description:
          "Kenali PT. Specsa Solusi Pratama, supplier material bangunan untuk kontraktor, developer, instansi, dan industri di Jabodetabek.",
        keywords:
          "tentang specsa, supplier material bangunan tangerang selatan, pengadaan material proyek",
      },
    },
    produk: {
      slug: "produk",
      navLabel: "Produk",
      eyebrow: "Katalog Produk",
      title: "Material proyek dari brand terpercaya, siap dikirim ke lokasi.",
      lead:
        "Temukan GRC Board, Conwood, Waterproofing Bitmix, Tensile Membrane, Fasad Metal Wallspan, Tegola, dan Gerfloor untuk kebutuhan proyek Anda.",
      heroImage: "/images/product-grc.png",
      ctaLabel: "Minta rekomendasi produk",
      ctaHref: "/kontak",
      sections: [
        {
          title: "Kategori Produk",
          body:
            "Produk disiapkan untuk berbagai kebutuhan aplikasi, mulai dari fasad, plafon, waterproofing, roofing, flooring, sampai sistem membrane.",
          items: products.map((product) => `${product.name} - ${product.badge}`),
        },
        {
          title: "Cara Pemilihan",
          body:
            "Tim kami membantu memilih spesifikasi berdasarkan area aplikasi, volume, target waktu, dan kondisi lapangan.",
          items: [
            "Estimasi kebutuhan material",
            "Perbandingan produk dan kisaran harga",
            "Koordinasi stok dan jadwal kirim",
          ],
        },
      ],
      seo: {
        title: "Produk Material Bangunan - GRC, Conwood, Bitmix, Tensile",
        description:
          "Katalog produk Specsa: GRC Board, Conwood, Waterproofing Bitmix, Tensile Membrane, Wallspan, Tegola, dan Gerfloor.",
        keywords:
          "GRC board, Conwood, Bitmix, Tensile Membrane, Wallspan GKD, Tegola, Gerfloor",
      },
    },
    layanan: {
      slug: "layanan",
      navLabel: "Layanan",
      eyebrow: "Layanan Pengadaan",
      title: "Pengadaan material yang mudah dikendalikan dari awal sampai kirim.",
      lead:
        "Kami mendampingi proses pemilihan produk, penawaran, dokumentasi, sampai pengiriman material ke lokasi proyek.",
      heroImage: "/images/project-bkk.png",
      ctaLabel: "Mulai proses penawaran",
      ctaHref: "/kontak",
      sections: [
        {
          title: "Layanan Utama",
          body:
            "Setiap permintaan ditangani dengan alur kerja yang jelas agar keputusan pembelian lebih cepat dan risiko proyek lebih kecil.",
          items: [
            "Penyediaan material proyek",
            "Pengadaan perusahaan dan instansi",
            "Konsultasi produk dan spesifikasi",
            "Pengiriman terjadwal ke lokasi",
            "Dukungan volume kecil hingga besar",
          ],
        },
        {
          title: "Alur Kerja",
          body:
            "Tim kami mengumpulkan kebutuhan, memberi rekomendasi, mengirim penawaran, lalu mengatur ketersediaan dan pengiriman.",
          items: [
            "Brief kebutuhan proyek",
            "Rekomendasi produk dan estimasi harga",
            "Konfirmasi PO dan jadwal",
            "Material dikirim ke lokasi",
          ],
        },
      ],
      seo: {
        title: "Layanan Pengadaan Material Proyek - Specsa",
        description:
          "Layanan pengadaan material proyek, konsultasi produk, penawaran, dan pengiriman untuk kontraktor, developer, dan instansi.",
        keywords:
          "layanan pengadaan material, supplier proyek, konsultasi material bangunan, pengiriman material jabodetabek",
      },
    },
    proyek: {
      slug: "proyek",
      navLabel: "Proyek",
      eyebrow: "Portfolio Proyek",
      title: "Material Specsa telah mendukung proyek fasad dan infrastruktur.",
      lead:
        "Dari gedung komersial hingga fasilitas publik, kami membantu menyediakan material yang sesuai spesifikasi dan jadwal proyek.",
      heroImage: "/images/project-flyover.png",
      ctaLabel: "Diskusikan proyek Anda",
      ctaHref: "/kontak",
      sections: [
        {
          title: "Jenis Proyek",
          body:
            "Kami mendukung kebutuhan material pada proyek komersial, pendidikan, infrastruktur, dan fasilitas publik.",
          items: [
            "Fly Over Agung Sedayu",
            "International Finance Center",
            "Universitas Negeri Jakarta",
            "Bina Karsa Office Kuningan",
          ],
        },
        {
          title: "Dukungan Specsa",
          body:
            "Fokus kami adalah memastikan material yang dipilih sesuai fungsi, tampilan, dan kebutuhan jadwal.",
          items: [
            "Fasad metal dan perforated panel",
            "GKD metal mesh",
            "Tensile membrane facade",
            "Material pendukung konstruksi",
          ],
        },
      ],
      seo: {
        title: "Portfolio Proyek - Specsa Solusi Pratama",
        description:
          "Lihat proyek fasad, infrastruktur, dan komersial yang didukung oleh material dari PT. Specsa Solusi Pratama.",
        keywords:
          "portfolio specsa, proyek fasad metal, GKD metal mesh, tensile membrane, supplier proyek",
      },
    },
    kontak: {
      slug: "kontak",
      navLabel: "Kontak",
      eyebrow: "Hubungi Specsa",
      title: "Mulai kebutuhan material proyek Anda bersama tim Specsa.",
      lead:
        "Kirim kebutuhan produk, volume, lokasi, dan target jadwal. Tim kami akan membantu menyiapkan rekomendasi dan penawaran.",
      heroImage: "/images/hero.png",
      ctaLabel: "Chat via WhatsApp",
      ctaHref: "https://wa.me/6281210511526",
      sections: [
        {
          title: "Informasi Kontak",
          body:
            "Hubungi kami untuk konsultasi produk, permintaan harga, dan koordinasi pengiriman.",
          items: [
            "PIC: M. Sigit Kusbandono",
            "Telepon: 0812 105 1526",
            "Email: info@specsa.id",
            "Jam kerja: Senin - Jumat, 08.00 - 17.00 WIB",
          ],
        },
        {
          title: "Yang Perlu Disiapkan",
          body:
            "Agar tim kami bisa memberi rekomendasi lebih cepat, sertakan detail proyek saat menghubungi kami.",
          items: [
            "Jenis produk atau aplikasi",
            "Estimasi luas/volume",
            "Lokasi pengiriman",
            "Target tanggal penggunaan material",
          ],
        },
      ],
      seo: {
        title: "Kontak Specsa - Minta Penawaran Material Bangunan",
        description:
          "Hubungi Specsa untuk konsultasi produk, harga material bangunan, dan pengiriman proyek di Jabodetabek.",
        keywords:
          "kontak specsa, minta penawaran material, supplier bangunan tangerang selatan",
      },
    },
  },
};

export const contentFilePath = path.join(process.cwd(), "data", "content.json");

export function getSiteContent(): SiteContent {
  try {
    if (!fs.existsSync(contentFilePath)) return defaultSiteContent;
    const raw = fs.readFileSync(contentFilePath, "utf8");
    return JSON.parse(raw) as SiteContent;
  } catch {
    return defaultSiteContent;
  }
}

export function writeSiteContent(content: SiteContent) {
  const dir = path.dirname(contentFilePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(contentFilePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

export function getPageContent(slug: string) {
  const content = getSiteContent();
  return content.pages[slug] ?? null;
}


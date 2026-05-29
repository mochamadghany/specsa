import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPage from "@/components/DetailPage";
import { getPageContent, getSiteContent } from "@/lib/site-content";

const slugs = ["tentang", "produk", "layanan", "proyek", "kontak"];

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const page = getPageContent(params.slug);
  const site = getSiteContent().site;

  if (!page) return {};

  return {
    title: { absolute: page.seo.title },
    description: page.seo.description,
    keywords: page.seo.keywords,
    alternates: {
      canonical: `${site.url}/${page.slug}`,
    },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: `${site.url}/${page.slug}`,
      siteName: site.name,
      type: "website",
      locale: "id_ID",
      images: [{ url: page.heroImage, alt: page.title }],
    },
  };
}

export default function Page({ params }: PageProps) {
  if (!slugs.includes(params.slug)) notFound();

  const page = getPageContent(params.slug);
  if (!page) notFound();

  return <DetailPage page={page} />;
}

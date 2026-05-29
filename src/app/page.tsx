import type { Metadata } from "next";
import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Products from "@/components/Products";
import Services from "@/components/Services";
import Eco from "@/components/Eco";
import Portfolio from "@/components/Portfolio";
import SocialFeed from "@/components/SocialFeed";
import Why from "@/components/Why";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/site-content";
import { getSiteSettings } from "@/lib/settings";
import { getProducts } from "@/lib/products-db";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const site = getSiteContent().site;
  return {
    title: `${site.name} - Supplier Material Bangunan Tangerang Selatan`,
    description:
      "Supplier material bangunan untuk kontraktor, developer, industri, dan retail di Jabodetabek. GRC, Conwood, Bitmix, Tensile Membrane, Wallspan, Tegola, dan Gerfloor.",
    keywords:
      "supplier material bangunan, GRC board, conwood, waterproofing bitmix, tensile membrane, wallspan GKD, genteng bitumen tegola, vinyl gerfloor, kontraktor tangerang, jabodetabek",
    alternates: {
      canonical: site.url,
    },
    openGraph: {
      title: `${site.name} - Trusted Building Material Partner`,
      description:
        "Material berkualitas untuk proyek konstruksi, developer, dan industri. Kompetitif, responsif, on-schedule.",
      url: site.url,
      siteName: site.name,
      type: "website",
      locale: "id_ID",
    },
  };
}

export default async function Home() {
  const settings = await getSiteSettings();
  const products = await getProducts();

  return (
    <>
      <Topbar />
      <Navbar products={products} />
      <main>
        <Hero />
        <About />
        <Products products={products} />
        <Services />
        <Eco />
        <Portfolio />
        <Why />
        <SocialFeed
          instagramHandle={settings.social_instagram_handle}
          instagramUrl={settings.social_instagram_url}
          instagramEnabled={settings.instagram_feed_enabled !== "0"}
          facebookPageUrl={settings.facebook_page_url}
          facebookEnabled={settings.facebook_feed_enabled !== "0"}
        />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

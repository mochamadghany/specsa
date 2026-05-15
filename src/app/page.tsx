import Topbar from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Products from "@/components/Products";
import Services from "@/components/Services";
import Eco from "@/components/Eco";
import Portfolio from "@/components/Portfolio";
import Why from "@/components/Why";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Products />
        <Services />
        <Eco />
        <Portfolio />
        <Why />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

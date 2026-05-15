export type Product = {
  id: string;
  img: string;
  alt: string;
  badge: string;
  name: string;
  brand: string;
  desc: string;
  priceMin: number;
  priceMax: number;
  unit: string;
  coverage: number;
  wasteFactor: number;
  calcLabel: string;
  cnc: boolean;
};

export const products: Product[] = [
  {
    id: "grc",
    img: "/images/product-grc.png",
    alt: "GRC Board",
    badge: "Fiber Cement",
    name: "GRC Board",
    brand: "Glass Reinforced Cement",
    desc: "Panel semen berkualitas tinggi untuk fasad, partisi, dan dekorasi bangunan modern.",
    priceMin: 45000,
    priceMax: 85000,
    unit: "lembar",
    coverage: 2.88,
    wasteFactor: 0.1,
    calcLabel: "m2 area dinding / fasad",
    cnc: false,
  },
  {
    id: "conwood",
    img: "/images/product-conwood.png",
    alt: "Conwood Dekoratif",
    badge: "Wood Alternative",
    name: "Conwood",
    brand: "Dekoratif & CNC Custom",
    desc: "Alternatif kayu tahan cuaca dan anti-rayap. Cocok untuk fasad dekoratif dan CNC custom.",
    priceMin: 180000,
    priceMax: 350000,
    unit: "lembar",
    coverage: 0.6,
    wasteFactor: 0.12,
    calcLabel: "m2 area fasad / dinding",
    cnc: true,
  },
  {
    id: "bitmix",
    img: "/images/product-bitmix.png",
    alt: "Bitmix Waterproofing",
    badge: "Waterproofing",
    name: "Waterproofing Bitmix",
    brand: "Membrane Bitumen",
    desc: "Membran bitumen anti bocor untuk atap datar, basement, dan area lembab.",
    priceMin: 120000,
    priceMax: 220000,
    unit: "roll (10m2)",
    coverage: 10,
    wasteFactor: 0.15,
    calcLabel: "m2 area waterproofing",
    cnc: false,
  },
  {
    id: "tensile",
    img: "/images/product-tensile.png",
    alt: "Tensile Membrane",
    badge: "Structure",
    name: "Tensile Membrane",
    brand: "Agtex, Sioen, Serge Ferrari, Heytex",
    desc: "Struktur kanopi membran untuk area publik, plaza, parkir, dan fasilitas outdoor.",
    priceMin: 450000,
    priceMax: 900000,
    unit: "m2",
    coverage: 1,
    wasteFactor: 0.08,
    calcLabel: "m2 area kanopi",
    cnc: false,
  },
  {
    id: "wallspan",
    img: "/images/product-wallspan.png",
    alt: "Wallspan GKD Fasad Metal",
    badge: "Fasad Metal",
    name: "Fasad Metal Wallspan",
    brand: "Perforated Fasad, GKD",
    desc: "Panel fasad metal berlubang untuk eksterior gedung modern. Estetis dan fungsional.",
    priceMin: 350000,
    priceMax: 750000,
    unit: "m2",
    coverage: 1,
    wasteFactor: 0.1,
    calcLabel: "m2 area fasad metal",
    cnc: true,
  },
  {
    id: "tegola",
    img: "/images/product-tegola.png",
    alt: "Genteng Bitumen Tegola",
    badge: "Roofing & Flooring",
    name: "Tegola + Gerfloor",
    brand: "Genteng Bitumen & Vinyl Floor",
    desc: "Genteng aspal Tegola untuk tampilan premium. Vinyl floor Gerfloor untuk interior.",
    priceMin: 95000,
    priceMax: 280000,
    unit: "m2",
    coverage: 1,
    wasteFactor: 0.1,
    calcLabel: "m2 area atap / lantai",
    cnc: false,
  },
];


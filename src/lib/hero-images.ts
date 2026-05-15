export const heroSliderImages = [
  { src: "/images/hero (1).png", alt: "Specsa project hero 1" },
  { src: "/images/hero (2).png", alt: "Specsa project hero 2" },
  { src: "/images/hero (3).png", alt: "Specsa project hero 3" },
  { src: "/images/hero (4).png", alt: "Specsa project hero 4" },
  { src: "/images/hero (5).png", alt: "Specsa project hero 5" },
  { src: "/images/hero (6).png", alt: "Specsa project hero 6" },
  { src: "/images/hero (7).png", alt: "Specsa project hero 7" },
  { src: "/images/hero (8).png", alt: "Specsa project hero 8" },
  { src: "/images/hero.png", alt: "Specsa project hero" },
];

export function getRandomHeroImage() {
  return heroSliderImages[Math.floor(Math.random() * heroSliderImages.length)];
}

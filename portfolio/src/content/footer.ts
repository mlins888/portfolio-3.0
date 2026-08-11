import type { ImageMetadata } from "astro";

import footerCat from "../assets/illustrations/footer-cat.png";

export const footer = {
  tagline: "dreaming up my next destination...",
  cat: footerCat as ImageMetadata,
  catAlt: "Cat in an astronaut helmet",
  contacts: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/makenna-linsky/" },
    { label: "GitHub", href: "https://github.com/mlins888" },
    { label: "Email", href: "mailto:Makenna@Linsky.net" },
    { label: "Resume", href: "/resume.pdf" },
  ],
  nav: [
    { label: "Home", href: "/" },
    { label: "About Me", href: "/about" },
    { label: "Playground", href: "/playground" },
  ],
};

import type { ImageMetadata } from "astro";

import footerCat from "../assets/illustrations/footer-cat.png";

export const footer = {
  tagline: "dreaming up my next destination...",
  cat: footerCat as ImageMetadata,
  catAlt: "Cat in an astronaut helmet",
  /** `icon` picks the glyph Nav.astro shows for each in the header bar. */
  contacts: [
    { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/makenna-linsky/" },
    { label: "GitHub", icon: "github", href: "https://github.com/mlins888" },
    { label: "Email", icon: "email", href: "mailto:Makenna@Linsky.net" },
    { label: "Resume", icon: "resume", href: "/resume.pdf" },
  ] as { label: string; icon: "linkedin" | "github" | "email" | "resume"; href: string }[],
  nav: [
    { label: "Home", href: "/" },
    { label: "About Me", href: "/about" },
    { label: "Playground", href: "/playground" },
  ],
};

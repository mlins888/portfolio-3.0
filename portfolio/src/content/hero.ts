import type { ImageMetadata } from "astro";

import heroPortrait from "../assets/illustrations/hero-portrait.png";
import logoBadge from "../assets/illustrations/logo-badge.png";

/**
 * Everything the hero says and shows. Components read from here, so no copy or
 * image path is ever typed into markup.
 *
 * Swapping artwork: point the import at a new file in src/assets/ — the
 * components size and position whatever they are handed.
 */
export interface HeroContent {
  greeting: string;
  /** One entry per rendered line of the display headline. */
  nameLines: string[];
  tagline: string;
  stamp: {
    date: string;
    price: string;
  };
  images: {
    portrait: ImageMetadata;
    portraitAlt: string;
    logo: ImageMetadata;
    logoAlt: string;
  };
}

export const hero: HeroContent = {
  greeting: "Hello! I'm...",
  nameLines: ["Makenna", "Linsky"],
  tagline: "bringing you BOLD designs from Duke University",
  stamp: {
    date: "AUG 02",
    price: "10¢",
  },
  images: {
    portrait: heroPortrait,
    portraitAlt: "Line drawing of Makenna seated inside a spotlight circle",
    logo: logoBadge,
    logoAlt: "Cat mascot logo",
  },
};

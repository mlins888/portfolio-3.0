import type { ImageMetadata } from "astro";

import aboutPortrait from "../assets/about/portrait.jpg";

export interface DndCharacter {
  name: string;
  /** e.g. "Level 5 Half-Elf Bard" */
  title: string;
  /** Six ability scores, shown as a compact stat block. */
  stats: { label: string; value: number }[];
  /** A line or two of flavour. */
  blurb: string;
}

export interface AboutContent {
  heading: string;
  paragraphs: string[];
  photo: ImageMetadata;
  photoAlt: string;
  dnd: DndCharacter;
}

export const about: AboutContent = {
  heading: "Hiya! I’m Makenna",
  paragraphs: [
    "I love creating vibrant, lively designs that reinvent the old and challenge the new norms of modern technology. I’m in love with all things vintage- catch me watching Star Trek or thrifting for all my outfits.",
    "Right now, I’m studying Computer Science and Visual Media Studies at Duke University, designing for HackDuke + DuQuantum, and developing for Web Surfing Studios.",
    "When I’m not creating art, you can find me practicing flute or trumpet, or playing a number of videogames.",
  ],
  photo: aboutPortrait,
  photoAlt: "Makenna presenting design work at a poster session",

  // Static — no API. Edit this block whenever the character changes.
  dnd: {
    name: "Seraphina Quill",
    title: "Level 5 Half-Elf Bard",
    stats: [
      { label: "STR", value: 8 },
      { label: "DEX", value: 16 },
      { label: "CON", value: 13 },
      { label: "INT", value: 12 },
      { label: "WIS", value: 10 },
      { label: "CHA", value: 18 },
    ],
    blurb: "College of Lore. Wields a rapier, a lute, and an unshakeable sense of the dramatic.",
  },
};

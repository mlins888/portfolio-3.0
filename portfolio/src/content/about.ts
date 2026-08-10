import type { ImageMetadata } from "astro";

import aboutPortrait from "../assets/illustrations/about-portrait.jpg";

export interface AboutContent {
  heading: string;
  paragraphs: string[];
  photo: ImageMetadata;
  photoAlt: string;
}

export const about: AboutContent = {
  heading: "Hiya! I’m Makenna",
  paragraphs: [
    "I love creating vibrant, lively designs that reinvent the old and challenge the new norms of modern technology. I’m in love with all things vintage- catch me watching Star Trek or thrifting for all my outfits.",
    "Right now, I’m studying Computer Science and Visual Media Studies at Duke University, designing for HackDuke, and developing for Web Surfing Studios.",
    "When I’m not creating art, you can find me practicing flute or trumpet, or playing a number of videogames.",
  ],
  photo: aboutPortrait,
  photoAlt: "Makenna at a desk with design work on screen",
};

import type { ImageMetadata } from "astro";

import aboutPortrait from "../assets/about/portrait.jpg";
import dndCharacterArt from "../assets/about/dnd-chanani.png";

export interface DndCharacter {
  name: string;
  /** e.g. "Level 5 Half-Elf Bard" */
  title: string;
  /** Six ability scores, shown as a compact stat block. */
  stats: { label: string; value: number }[];
  /** A line or two of flavour. */
  blurb: string;
  /** Optional character art, shown at the top of the reveal card. */
  portrait?: ImageMetadata;
  portraitAlt?: string;
}

export interface Practicing {
  /** Freeform — "Flute", "Trumpet", "Flute & trumpet", ... */
  instrument: string;
  piece: string;
  composer?: string;
  ensemble?: string;
  /** Optional one-liner of context. */
  note?: string;
  /**
   * A reference recording, embedded as a Spotify player. Paste the tail of a
   * Spotify share link: for open.spotify.com/track/ABC123 use "track/ABC123".
   * Also accepts "album/…" or "playlist/…". Leave "" to show no player.
   */
  spotifyEmbed: string;
}

export interface AboutContent {
  heading: string;
  paragraphs: string[];
  photo: ImageMetadata;
  photoAlt: string;
  dnd: DndCharacter;
  practicing: Practicing;
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
    name: "Cha'Nari",
    title: "Level 2 Kalashtar Barbarian",
    stats: [
      { label: "STR", value: 15 },
      { label: "DEX", value: 14 },
      { label: "CON", value: 13 },
      { label: "INT", value: 8 },
      { label: "WIS", value: 12 },
      { label: "CHA", value: 14 },
    ],
    blurb: "She's lost her cool, and now seeks adventure as a barbarian, leaving her clan's meditative ways behind... unless she decides to one day return.",
    portrait: dndCharacterArt,
    portraitAlt: "Character illustration of Cha'Nari, hair damp, resting a greatsword on her shoulder",
  },

  // Static — no API. The Spotify player is just an embed iframe.
  practicing: {
    instrument: "Flute",
    piece: "Syrinx",
    composer: "Claude Debussy",
    ensemble: "",
    note: "Solo flute — all breath control and colour.",
    // e.g. "track/6b2oQwSGFkzsMH30153NQnj" — paste your own from a Spotify link
    spotifyEmbed: "",
  },
};

import type { ImageMetadata } from "astro";

/**
 * Everything the playground scene shows and every card it can open — the
 * closet's five clickable pathways (TV, box stack, each shirt, picture
 * frame) all read from `pathways` below, so PlaygroundScene.astro never
 * hardcodes copy or artwork, and adding a sixth shirt (or a seventh, ...) is
 * a matter of pushing one more entry, not touching layout or hover-shift
 * logic (see the neighbor-shift math in PlaygroundScene.astro's script,
 * which is computed from each shirt's index, not written per-shirt).
 *
 * A shirt pathway carries two different kinds of art: `image` is the
 * on-canvas hanger illustration (see src/assets/playground/shirt-*.svg,
 * each its own real, individually-exported Figma asset hung over the
 * closet's empty rod), while `designs` is the real print design shown in
 * its card — one entry, or two (front + back) for a shirt that has both.
 * Swapping either: point the relevant field at a new asset in src/assets/.
 *
 * `hotspot` is the pathway's hit target in Figma canvas units (matches the
 * numbers you'd read off the Figma inspector for that element) — see
 * src/components/hero/canvas.ts for the coordinate system this is rendered
 * through. Each shirt's box was derived from Figma by aligning its own
 * hanger hook to the original hook position on the closet's rod (the
 * standalone shirt export's frame includes the hook, unlike the old
 * closet-with-clothes export's inner sub-frame).
 */

import gamePlaceholder from "../assets/decor/game-placeholder.svg";
import photoPlaceholder from "../assets/decor/photo-placeholder.svg";

import closetArt from "../assets/playground/closet.svg";
import tvArt from "../assets/playground/tv-graphic.svg";
import boxLayer1 from "../assets/playground/box-layer-1.svg";
import boxLayer2 from "../assets/playground/box-layer-2.svg";
import boxLayer3 from "../assets/playground/box-layer-3.svg";
import picFrameArt from "../assets/playground/pic-frame.svg";
import comingSoonBoxArt from "../assets/playground/coming-soon-box.svg";
import shirt1Art from "../assets/playground/shirt-1.svg";
import shirt2Art from "../assets/playground/shirt-2.svg";
import shirt3Art from "../assets/playground/shirt-3.svg";
import shirt4Art from "../assets/playground/shirt-4.svg";
import shirt5Art from "../assets/playground/shirt-5.svg";

import codePlusFront from "../assets/playground/shirts/code-plus-front.png";
import codePlusBack from "../assets/playground/shirts/code-plus-back.png";
import showtime2026 from "../assets/playground/shirts/showtime-2026.jpg";
import goodTimesRoll2025 from "../assets/playground/shirts/good-times-roll-2025.jpg";
import dso100Front from "../assets/playground/shirts/dso-100-front.jpg";
import dso100Back from "../assets/playground/shirts/dso-100-back.jpg";
import rooted from "../assets/playground/shirts/rooted.jpg";

export type PathwayType = "game" | "boardgame" | "shirt" | "social";

export interface HotspotBox {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

interface PathwayBase {
  id: string;
  type: PathwayType;
  /** Hover/aria label for the hotspot. */
  label: string;
  /** Human-readable note on which on-canvas element this hotspot sits over. */
  hotspotTarget: string;
  hotspot: HotspotBox;
  title: string;
  description: string;
}

export interface MediaPathway extends PathwayBase {
  type: "game";
  image: ImageMetadata | any;
  imageAlt: string;
  tags?: string[];
}

/** Content lives in src/content/boardgame.ts — see BoardGameCard.astro. */
export interface BoardgamePathway extends PathwayBase {
  type: "boardgame";
}

export interface ShirtDesignView {
  image: ImageMetadata | any;
  alt: string;
  /** e.g. "Front" / "Back" — only meaningful when a shirt has two views. */
  label?: string;
}

export interface ShirtPathway extends PathwayBase {
  type: "shirt";
  /** On-canvas hanger artwork — the closet's real hanging tee (see canvas.ts). */
  image: ImageMetadata | any;
  imageAlt: string;
  /** The real print design shown in the card: one view, or front + back. */
  designs: ShirtDesignView[];
}

export interface SocialImage {
  image: ImageMetadata | any;
  alt: string;
  tint?: string;
}

export interface SocialBoardPathway extends PathwayBase {
  type: "social";
  images: SocialImage[];
}

export type PlaygroundPathway = MediaPathway | BoardgamePathway | ShirtPathway | SocialBoardPathway;

export const playground = {
  heading: "Playground",

  /** The closet illustration's local canvas — matches the Figma frame 1:1. */
  canvas: { width: 1440, height: 1024 },

  scene: {
    closet: { image: closetArt, x: 690, y: 87, width: 717.9235, height: 943.8358 },
    tv: { image: tvArt, x: 88, y: 330, width: 552.196, height: 448.488 },
    box: {
      // Fall/stack order, bottom to top — also the entrance animation order.
      layer3: { image: boxLayer3, x: -98, y: 856.62, width: 974.093, height: 300.599 },
      layer2: { image: boxLayer2, x: -54.393, y: 748.815, width: 859.228, height: 336.28, rotation: -2.33 },
      layer1: { image: boxLayer1, x: -51.335, y: 649.808, width: 863.837, height: 300.693 },
    },
    frame: { image: picFrameArt, x: 995, y: 682, width: 134.5, height: 128 },
    comingSoonBox: {
      image: comingSoonBoxArt,
      x: 866,
      y: 864,
      width: 218.5,
      height: 113.528,
      // "More Coming Soon..." label baked as text, not into the box art —
      // position/rotation match the Figma text node exactly.
      label: { x: 893.005, y: 903, width: 74.09, height: 65.931, rotation: 5.13 },
    },
  },

  pathways: [
    {
      id: "game",
      type: "game",
      label: "peek at the game I'm building?",
      hotspotTarget: "TV screen",
      hotspot: { x: 91, y: 333, width: 546.194, height: 442.488 },
      title: "Video game — in progress",
      description:
        "A small game I'm prototyping on the side. Swap this copy (and the screenshot below) in src/content/playground.ts once there's something to show off.",
      image: gamePlaceholder,
      imageAlt: "Placeholder game controller icon",
      tags: ["Unity", "Pixel art", "Solo project"],
    },
    {
      id: "boardgame",
      type: "boardgame",
      label: "check out the board game?",
      hotspotTarget: "box stack (all 3 layers)",
      hotspot: { x: -98, y: 649.808, width: 963, height: 499.401 },
      title: "The board game",
      description: "Browse the deck below, and the map it's all played on.",
    },
    {
      id: "social",
      type: "social",
      label: "browse the social designs?",
      hotspotTarget: "picture frame",
      hotspot: { x: 995, y: 682, width: 134.5, height: 128 },
      title: "Social media designs",
      description: "A small board of graphics made for Instagram, LinkedIn, and event promo.",
      images: [
        { image: photoPlaceholder, alt: "Placeholder social post", tint: "var(--color-coral)" },
        { image: photoPlaceholder, alt: "Placeholder social post", tint: "var(--color-teal)" },
        { image: photoPlaceholder, alt: "Placeholder social post", tint: "var(--color-gold)" },
        { image: photoPlaceholder, alt: "Placeholder social post", tint: "var(--color-orange)" },
        { image: photoPlaceholder, alt: "Placeholder social post", tint: "var(--color-teal-deep)" },
        { image: photoPlaceholder, alt: "Placeholder social post", tint: "var(--color-salmon)" },
      ],
    },
    {
      id: "shirt-1",
      type: "shirt",
      label: "look at the Code+Plus 2026 tee?",
      hotspotTarget: "shirt hanger — orange (back)",
      hotspot: { x: 790.103, y: 192.844, width: 237.844, height: 355.587 },
      title: "Code+Plus 2026",
      description: "Event tee for Code+Plus 2026 — front chest logo, full back print.",
      image: shirt1Art,
      imageAlt: "Orange t-shirt on a hanger",
      designs: [
        { image: codePlusFront, alt: "Code+Plus 2026 tee, front — small chest logo on black", label: "Front" },
        { image: codePlusBack, alt: "Code+Plus 2026 tee, back — full illustrated design with event list", label: "Back" },
      ],
    },
    {
      id: "shirt-2",
      type: "shirt",
      label: "look at the It's Showtime tee?",
      hotspotTarget: "shirt hanger — teal",
      hotspot: { x: 821.833, y: 199.042, width: 230.403, height: 352.126 },
      title: "It's Showtime",
      description: "Springfield High School Marching Band, 2026.",
      image: shirt2Art,
      imageAlt: "Teal t-shirt on a hanger",
      designs: [{ image: showtime2026, alt: "It's Showtime tee design, blue comic-panel poster" }],
    },
    {
      id: "shirt-3",
      type: "shirt",
      label: "look at the Let the Good Times Roll tee?",
      hotspotTarget: "shirt hanger — coral",
      hotspot: { x: 857.316, y: 198.497, width: 221.308, height: 370.975 },
      title: "Let the Good Times Roll",
      description: "Springfield High School Marching Band, 2025.",
      image: shirt3Art,
      imageAlt: "Coral t-shirt on a hanger",
      designs: [{ image: goodTimesRoll2025, alt: "Let the Good Times Roll tee design, mustang illustration" }],
    },
    {
      id: "shirt-4",
      type: "shirt",
      label: "look at the DSO 100 tee?",
      hotspotTarget: "shirt hanger — green",
      hotspot: { x: 896, y: 198, width: 217, height: 346 },
      title: "DSO 100",
      description: "Centennial tee for the DSO — front chest logo, full back print.",
      image: shirt4Art,
      imageAlt: "Green t-shirt on a hanger",
      designs: [
        { image: dso100Front, alt: "DSO 100 tee, front — small chest logo on navy", label: "Front" },
        { image: dso100Back, alt: "DSO 100 tee, back — instrument illustrations around a DSO 100 years logo", label: "Back" },
      ],
    },
    {
      id: "shirt-5",
      type: "shirt",
      label: "look at the Rooted tee?",
      hotspotTarget: "shirt hanger — teal (front)",
      hotspot: { x: 941, y: 195, width: 217, height: 391 },
      title: "Rooted in Christ's Love",
      description: "Ephesians 3:17.",
      image: shirt5Art,
      imageAlt: "Teal t-shirt on a hanger",
      designs: [{ image: rooted, alt: "Rooted in Christ's Love tee design, tree emblem on green" }],
    },
  ] satisfies PlaygroundPathway[],
};

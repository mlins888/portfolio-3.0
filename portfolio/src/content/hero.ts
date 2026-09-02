import type { ImageMetadata } from "astro";

import heroSceneSplash from "../assets/illustrations/hero-scene-splash.png";
import heroSceneCharacter from "../assets/illustrations/hero-scene-character.png";
import heroCornerCat from "../assets/illustrations/hero-corner-cat.png";
import buildingPulse from "../assets/illustrations/building-pulse.png";
import buildingHackduke from "../assets/illustrations/building-hackduke.png";
import buildingOther from "../assets/illustrations/building-other.png";

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
    /** Fallback only — StampBadge computes the live date client-side. */
    date: string;
    price: string;
  };
  images: {
    /** Colourful shape burst behind the character; rotates + pulses. */
    sceneSplash: ImageMetadata;
    /** Line-drawn character that sits on top of the splash. */
    sceneCharacter: ImageMetadata;
    sceneAlt: string;
    cornerCat: ImageMetadata;
    cornerCatAlt: string;
    buildingPulse: ImageMetadata;
    buildingHackduke: ImageMetadata;
    buildingOther: ImageMetadata;
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
    sceneSplash: heroSceneSplash,
    sceneCharacter: heroSceneCharacter,
    sceneAlt: "Line drawing of Makenna grinning on a swing",
    cornerCat: heroCornerCat,
    cornerCatAlt: "Cat mascot illustration",
    buildingPulse,
    buildingHackduke,
    buildingOther,
  },
};

import type { ImageMetadata } from "astro";

/**
 * The board game's card catalog + map, shown in the board game pathway's
 * card as a flip-to-reveal carousel (see BoardGameCard.astro). Kept apart
 * from playground.ts — which owns the pathway's title/description/hotspot —
 * because this alone is ~30 image imports; splitting it out keeps
 * playground.ts scannable.
 *
 * Character cards each have their own unique back (per faction + role).
 * Resource cards all share one back, and spell cards all share another —
 * both reused straight from the same import across every entry in that
 * category, so there's exactly one place to swap either shared back.
 */

import gameMapImage from "../assets/playground/game-map.png";

import blueDruid from "../assets/playground/cards/blue-druid.png";
import blueDruidBack from "../assets/playground/cards/blue-druid-back.png";
import blueHexer from "../assets/playground/cards/blue-hexer.png";
import blueHexerBack from "../assets/playground/cards/blue-hexer-back.png";
import blueQuicksilver from "../assets/playground/cards/blue-quicksilver.png";
import blueQuicksilverBack from "../assets/playground/cards/blue-quicksilver-back.png";
import blueWarden from "../assets/playground/cards/blue-warden.png";
import blueWardenBack from "../assets/playground/cards/blue-warden-back.png";
import redDruid from "../assets/playground/cards/red-druid.png";
import redDruidBack from "../assets/playground/cards/red-druid-back.png";
import redHexer from "../assets/playground/cards/red-hexer.png";
import redHexerBack from "../assets/playground/cards/red-hexer-back.png";
import redQuicksilver from "../assets/playground/cards/red-quicksilver.png";
import redQuicksilverBack from "../assets/playground/cards/red-quicksilver-back.png";
import redWarden from "../assets/playground/cards/red-warden.png";
import redWardenBack from "../assets/playground/cards/red-warden-back.png";

import feather from "../assets/playground/cards/feather.png";
import moonstone from "../assets/playground/cards/moonstone.png";
import root from "../assets/playground/cards/root.png";
import sap from "../assets/playground/cards/sap.png";
import thorn from "../assets/playground/cards/thorn.png";
import resourceBack from "../assets/playground/cards/resource-back.png";

import ambushSpell from "../assets/playground/cards/ambush-spell.png";
import captureSpell from "../assets/playground/cards/capture-spell.png";
import harvestSpell from "../assets/playground/cards/harvest-spell.png";
import protectSpell from "../assets/playground/cards/protect-spell.png";
import speedSpell from "../assets/playground/cards/speed-spell.png";
import stealSpell from "../assets/playground/cards/steal-spell.png";
import spellBack from "../assets/playground/cards/spell-back.png";

export type CardCategory = "character" | "resource" | "spell";

export interface CardFace {
  image: ImageMetadata;
  alt: string;
}

export interface GameCard {
  id: string;
  category: CardCategory;
  name: string;
  front: CardFace;
  back: CardFace;
}

const CHARACTER_BACK_ALT = "Character card back";
const RESOURCE_BACK: CardFace = { image: resourceBack, alt: "Resource card back" };
const SPELL_BACK: CardFace = { image: spellBack, alt: "Spell card back" };

export const boardgame = {
  map: { image: gameMapImage, alt: "The board game's game map" },

  cards: [
    // Character cards — each its own front + back.
    { id: "blue-druid", category: "character", name: "Blue Druid", front: { image: blueDruid, alt: "Blue Druid character card" }, back: { image: blueDruidBack, alt: CHARACTER_BACK_ALT } },
    { id: "blue-hexer", category: "character", name: "Blue Hexer", front: { image: blueHexer, alt: "Blue Hexer character card" }, back: { image: blueHexerBack, alt: CHARACTER_BACK_ALT } },
    { id: "blue-quicksilver", category: "character", name: "Blue Quicksilver", front: { image: blueQuicksilver, alt: "Blue Quicksilver character card" }, back: { image: blueQuicksilverBack, alt: CHARACTER_BACK_ALT } },
    { id: "blue-warden", category: "character", name: "Blue Warden", front: { image: blueWarden, alt: "Blue Warden character card" }, back: { image: blueWardenBack, alt: CHARACTER_BACK_ALT } },
    { id: "red-druid", category: "character", name: "Red Druid", front: { image: redDruid, alt: "Red Druid character card" }, back: { image: redDruidBack, alt: CHARACTER_BACK_ALT } },
    { id: "red-hexer", category: "character", name: "Red Hexer", front: { image: redHexer, alt: "Red Hexer character card" }, back: { image: redHexerBack, alt: CHARACTER_BACK_ALT } },
    { id: "red-quicksilver", category: "character", name: "Red Quicksilver", front: { image: redQuicksilver, alt: "Red Quicksilver character card" }, back: { image: redQuicksilverBack, alt: CHARACTER_BACK_ALT } },
    { id: "red-warden", category: "character", name: "Red Warden", front: { image: redWarden, alt: "Red Warden character card" }, back: { image: redWardenBack, alt: CHARACTER_BACK_ALT } },

    // Resource cards — share one back.
    { id: "feather", category: "resource", name: "Feather", front: { image: feather, alt: "Feather resource card" }, back: RESOURCE_BACK },
    { id: "moonstone", category: "resource", name: "Moonstone", front: { image: moonstone, alt: "Moonstone resource card" }, back: RESOURCE_BACK },
    { id: "root", category: "resource", name: "Root", front: { image: root, alt: "Root resource card" }, back: RESOURCE_BACK },
    { id: "sap", category: "resource", name: "Sap", front: { image: sap, alt: "Sap resource card" }, back: RESOURCE_BACK },
    { id: "thorn", category: "resource", name: "Thorn", front: { image: thorn, alt: "Thorn resource card" }, back: RESOURCE_BACK },

    // Spell cards — share one back.
    { id: "ambush-spell", category: "spell", name: "Ambush", front: { image: ambushSpell, alt: "Ambush spell card" }, back: SPELL_BACK },
    { id: "capture-spell", category: "spell", name: "Capture", front: { image: captureSpell, alt: "Capture spell card" }, back: SPELL_BACK },
    { id: "harvest-spell", category: "spell", name: "Harvest", front: { image: harvestSpell, alt: "Harvest spell card" }, back: SPELL_BACK },
    { id: "protect-spell", category: "spell", name: "Protect", front: { image: protectSpell, alt: "Protect spell card" }, back: SPELL_BACK },
    { id: "speed-spell", category: "spell", name: "Speed", front: { image: speedSpell, alt: "Speed spell card" }, back: SPELL_BACK },
    { id: "steal-spell", category: "spell", name: "Steal", front: { image: stealSpell, alt: "Steal spell card" }, back: SPELL_BACK },
  ] satisfies GameCard[],
};

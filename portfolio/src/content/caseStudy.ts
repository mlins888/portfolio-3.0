import type { ImageMetadata } from "astro";
import type { FilmFrame } from "../components/work/FilmStrip.astro";

/**
 * Shared shape of a case-study page (see components/work/CaseStudyLayout).
 * Each study's copy and media live in its own content file — pulse.ts,
 * heirloom.ts — typed against these.
 */

/** A bulleted item; `lead` renders bold ahead of the text. */
export interface ListItem {
  lead?: string;
  text: string;
}

/** A table: a header row, then rows of plain-text cells. Below ~700px each
 *  row stacks into a card, with the header repeated as a label per cell. */
export interface Table {
  columns: string[];
  rows: string[][];
}

/** A paragraph, a bulleted (or `ordered`) list, or a table. */
export type Block = string | { list: ListItem[]; ordered?: boolean } | { table: Table };

/** Media pinned beside a section's text on wide screens (inline below). */
export type SideMedia =
  | { kind: "image"; image: { image: ImageMetadata; alt: string } }
  | {
      kind: "flip";
      before: { image: ImageMetadata; alt: string };
      after: { image: ImageMetadata; alt: string };
    }
  | { kind: "video"; video: string };

export interface Section {
  id: string;
  heading: string;
  body: Block[];
  /** `offset` (rem, wide screens only) shifts the media up (negative) or
   *  down from its section's heading — e.g. to stagger it between phones in
   *  the opposite margin. */
  aside?: SideMedia & { side: "left" | "right"; offset?: number };
  /** Name of a slot on the page holding wide media that breaks across the
   *  page after this section (e.g. Pulse's "badges"). */
  after?: string;
}

export interface CaseStudyContent {
  title: string;
  /** Film-strip frames for the header — one label over its stacked values. */
  meta: FilmFrame[];
  /** Optional links beside the title (repo, Devpost, ...). */
  links?: { label: string; href: string }[];
  /** Omit for short write-ups; the TL;DR box is then left out. */
  tldr?: ListItem[];
  sections: Section[];
}

import type { ImageMetadata } from "astro";

import pulsePreview from "../assets/work/pulse-preview.png";
import heirloomPreview from "../assets/work/heirloom-preview.png";
import healthHoundPoster from "../assets/work/previews/health-hound-poster.jpg";
import healthHoundVideo from "../assets/work/previews/health-hound.mp4?url";
import duQuantumPoster from "../assets/work/previews/duquantum-poster.jpg";
import duQuantumVideo from "../assets/work/previews/duquantum.mp4?url";
import hackDukePoster from "../assets/work/previews/hackduke-poster.jpg";
import hackDukeVideo from "../assets/work/previews/hackduke.mp4?url";
// Animated-image stand-ins for the videos, used only when a browser won't
// autoplay video (Safari in Low Power Mode). ?url so they're never fetched
// unless the swap actually happens.
import healthHoundFallback from "../assets/work/previews/health-hound.webp?url";
import duQuantumFallback from "../assets/work/previews/duquantum.webp?url";
import hackDukeFallback from "../assets/work/previews/hackduke.webp?url";
import pulseGoalSetFallback from "../assets/work/previews/pulse-goal-set.webp?url";
import pulseTrophyFallback from "../assets/work/previews/pulse-trophy.webp?url";
import heirloomPhotoBoardFallback from "../assets/work/previews/heirloom-photo-board.webp?url";
import heirloomSparkFlowFallback from "../assets/work/previews/heirloom-spark-flow.webp?url";
import pulseGoalSetPoster from "../assets/work/previews/pulse-goal-set-poster.jpg?url";
import pulseTrophyPoster from "../assets/work/previews/pulse-trophy-poster.jpg?url";
import heirloomPhotoBoardPoster from "../assets/work/previews/heirloom-photo-board-poster.jpg?url";
import heirloomSparkFlowPoster from "../assets/work/previews/heirloom-spark-flow-poster.jpg?url";

import pulseGoalSetVideo from "../assets/work/pulse/goal-set-demo.mp4?url";
import pulseTrophyVideo from "../assets/work/pulse/trophy-demo.mp4?url";
import heirloomPhotoBoardVideo from "../assets/work/heirloom/photo-board-demo.mp4?url";
import heirloomSparkFlowVideo from "../assets/work/heirloom/spark-flow-demo.mp4?url";

export type PillTone = "coral" | "teal";

export interface CaseStudy {
  id: string;
  slug: string;
  href: string;
  title: string;
  role: string;
  /** Shown beside the role, e.g. "2026" or "2025-2026". */
  year: string;
  description: string;
  image: ImageMetadata;
  imageAlt: string;
  /** Width ÷ height of the card's image frame, straight from Figma. The
   *  cards share one row height, so this also sets each card's width. */
  imageAspect: number;
  /** Horizontal focal point for the cover crop (CSS object-position x). */
  imageFocusX?: string;
  /** Short discipline tag shown under the title in the bento caption. */
  tag: string;
  /** Screen recordings shown as phones on the homepage bento tile. */
  phones: BentoPhone[];
  /** Flat backdrop behind the phones on the bento tile. */
  backdrop: string;
}

/**
 * One phone on a large bento tile. `framed` recordings are bare screen
 * captures dropped into PhoneFrame's bezel; unframed ones were recorded
 * with their own bezel, so they're only clipped to its rounded outline.
 */
export interface BentoPhone {
  video: string;
  /** First frame, shown until (or instead of) playback. */
  poster: string;
  /** Animated stand-in for when the browser won't autoplay video. */
  fallback: string;
  framed: boolean;
}

export interface OtherProject {
  id: string;
  title: string;
  href?: string;
  tone: "teal" | "orange" | "teal-deep";
  /** Short line under the title in the bento caption. */
  meta: string;
  image: ImageMetadata;
  imageAlt: string;
  /** Optional looping screen recording; `image` doubles as its poster. */
  video?: string;
  /** Animated stand-in for `video` when the browser won't autoplay it. */
  fallback?: string;
  /** CSS object-position for the cover crop. */
  imageFocus?: string;
  interactive: boolean;
}

/**
 * Homepage bento grid, in reading order. Each entry points at content that
 * already lives elsewhere (case studies and other projects here, tees and
 * the social feeds in content/playground.ts), so nothing is duplicated.
 * `size` sets the tile's grid span (see BentoGrid.astro).
 */
export type BentoEntry =
  | { kind: "case"; id: string; size: "lg" }
  | { kind: "project"; id: string; size: "md" }
  /** `caption` overrides the tee's title in its caption bar. */
  | { kind: "shirt"; id: string; size: "sm"; caption?: string }
  | { kind: "social"; feed: string; size: "sm" };

export const work = {
  caseStudies: [
    {
      id: "pulse",
      slug: "pulse",
      href: "/work/pulse",
      title: "Pulse: For Research",
      tag: "Engagement Design · Health Tech",
      role: "Design Lead, Developer",
      year: "2026",
      description:
        "Creating a new UI personality and developing the engagement layer to foster Duke health research",
      image: pulsePreview,
      imageAlt: "Pulse for Research app screens on phone and watch",
      imageAspect: 488 / 366,
      phones: [
        { video: pulseGoalSetVideo, poster: pulseGoalSetPoster, fallback: pulseGoalSetFallback, framed: true },
        { video: pulseTrophyVideo, poster: pulseTrophyPoster, fallback: pulseTrophyFallback, framed: false },
      ],
      backdrop: "var(--color-teal-deep)",
    },
    {
      id: "heirloom",
      slug: "heirloom",
      href: "/work/heirloom",
      title: "Heirloom",
      tag: "AI Product Design",
      role: "Design Lead, Developer",
      year: "2026",
      description: "Designing a digital hearth that keeps scattered families’ stories alive",
      image: heirloomPreview,
      imageAlt: "heirloom logo on a tan grid with pink pushpins and plum thread",
      imageAspect: 561 / 364,
      phones: [
        { video: heirloomPhotoBoardVideo, poster: heirloomPhotoBoardPoster, fallback: heirloomPhotoBoardFallback, framed: true },
        { video: heirloomSparkFlowVideo, poster: heirloomSparkFlowPoster, fallback: heirloomSparkFlowFallback, framed: true },
      ],
      backdrop: "var(--color-orange)",
    },
  ] satisfies CaseStudy[],

  otherProjects: [
    {
      id: "health-hound",
      title: "HealthHound",
      href: "/work/health-hound",
      tone: "teal",
      meta: "Wearable Health UX",
      image: healthHoundPoster,
      imageAlt: "HealthHound mobile app preview",
      video: healthHoundVideo,
      fallback: healthHoundFallback,
      interactive: true,
    },
    {
      id: "duquantum",
      title: "DuQuantum",
      href: "/work/duquantum",
      tone: "orange",
      meta: "Brand Identity · Front-End",
      image: duQuantumPoster,
      imageAlt: "DuQuantum hackathon website",
      video: duQuantumVideo,
      fallback: duQuantumFallback,
      interactive: true,
    },
    {
      id: "hackduke",
      title: "HackDuke",
      href: "/work/hackduke",
      tone: "teal-deep",
      meta: "Illustrated Web UI",
      image: hackDukePoster,
      imageAlt: "HackDuke hackathon website",
      video: hackDukeVideo,
      fallback: hackDukeFallback,
      interactive: true,
    },
  ] satisfies OtherProject[],

  bento: [
    { kind: "case", id: "pulse", size: "lg" },
    { kind: "case", id: "heirloom", size: "lg" },
    { kind: "project", id: "duquantum", size: "md" },
    { kind: "project", id: "health-hound", size: "md" },
    { kind: "project", id: "hackduke", size: "md" },
    // Tees first: on desktop the 9 small tiles wrap 5 + 4, and the shorter
    // second row grows to fill the width, so the 4 social feeds (the tiles
    // that cycle through posts) land in the bigger slots.
    { kind: "shirt", id: "shirt-1", size: "sm" },
    { kind: "shirt", id: "shirt-2", size: "sm" },
    { kind: "shirt", id: "shirt-3", size: "sm" },
    { kind: "shirt", id: "shirt-4", size: "sm", caption: "CHBC College Ministry" },
    { kind: "shirt", id: "shirt-5", size: "sm" },
    { kind: "social", feed: "DPAD", size: "sm" },
    { kind: "social", feed: "DuQuantum", size: "sm" },
    { kind: "social", feed: "My Creative Journal", size: "sm" },
    { kind: "social", feed: "EG Ministries", size: "sm" },
  ] satisfies BentoEntry[] as BentoEntry[],

  buildingHotspots: [
    {
      id: "pulse",
      target: "#pulse",
      prompt: "travel to Pulse?",
      // Matches the pulse_building illustration's exact box (Figma canvas
      // units), raised 20 to sit further behind the heirloom house.
      x: 725,
      y: 418,
      width: 419,
      height: 617,
    },
    {
      id: "heirloom",
      target: "#heirloom",
      prompt: "travel to heirloom?",
      // The heirloom house's box: scaled 1.12× about its bottom-centre,
      // then nudged 30 units left.
      x: 887.9,
      y: 711.24,
      width: 487.2,
      height: 333.76,
    },
    {
      id: "other-projects",
      target: "#duquantum",
      prompt: "see other projects?",
      // Raised 20 to sit further behind the heirloom house.
      x: 1185,
      y: 424.57,
      width: 258,
      height: 581,
    },
  ],
};

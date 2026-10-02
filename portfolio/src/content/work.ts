import type { ImageMetadata } from "astro";

import pulsePreview from "../assets/work/pulse-preview.png";
import heirloomPreview from "../assets/work/heirloom-preview.png";
import healthHoundPreview from "../assets/work/health-hound-preview.png";

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
}

export interface OtherProject {
  id: string;
  title: string;
  href?: string;
  tone: "teal" | "orange" | "teal-deep";
  image?: ImageMetadata;
  imageAlt?: string;
  interactive: boolean;
}

/**
 * The "see other projects..." heading + project panels are hidden for now
 * (still built — flip this back to `true` to show them). While hidden, the
 * third hero building points at the playground link instead of the missing
 * panels.
 */
const SHOW_OTHER_PROJECTS = true;

export const work = {
  caseStudies: [
    {
      id: "pulse",
      slug: "pulse",
      href: "/work/pulse",
      title: "Pulse: For Research",
      role: "Design Lead, Developer",
      year: "2026",
      description:
        "Creating a new UI personality and developing the engagement layer to foster Duke health research",
      image: pulsePreview,
      imageAlt: "Pulse for Research app screens on phone and watch",
      imageAspect: 488 / 366,
    },
    {
      id: "heirloom",
      slug: "heirloom",
      href: "/work/heirloom",
      title: "Heirloom",
      role: "Design Lead, Developer",
      year: "2026",
      description: "Designing a digital hearth that keeps scattered families’ stories alive",
      image: heirloomPreview,
      imageAlt: "heirloom logo on a tan grid with pink pushpins and plum thread",
      imageAspect: 561 / 364,
    },
  ] satisfies CaseStudy[],

  showOtherProjects: SHOW_OTHER_PROJECTS,
  otherProjectsHeading: "see other projects...",
  otherProjects: [
    {
      id: "health-hound",
      title: "HealthHound",
      href: "/work/health-hound",
      tone: "teal",
      image: healthHoundPreview,
      imageAlt: "HealthHound mobile app preview",
      interactive: true,
    },
    {
      id: "duquantum",
      title: "DuQuantum",
      href: "/work/duquantum",
      tone: "orange",
      interactive: true,
    },
    {
      id: "hackduke",
      title: "HackDuke",
      href: "/work/hackduke",
      tone: "teal-deep",
      interactive: true,
    },
  ] satisfies OtherProject[],

  playgroundCta: {
    before: "...or visit the",
    pill: "playground",
    after: "to see some of my other design pursuits",
    href: "/playground",
  },

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
      target: SHOW_OTHER_PROJECTS ? "#other-projects" : "#playground-cta",
      prompt: SHOW_OTHER_PROJECTS ? "see other projects?" : "visit the playground?",
      // Raised 20 to sit further behind the heirloom house.
      x: 1185,
      y: 424.57,
      width: 258,
      height: 581,
    },
  ],
};

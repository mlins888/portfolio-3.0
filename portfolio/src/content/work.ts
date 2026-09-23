import type { ImageMetadata } from "astro";

import pulsePreview from "../assets/work/pulse-preview.png";
import hackdukePreview from "../assets/work/hackduke-preview.webp";
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
      imageAspect: 547 / 410,
    },
    {
      id: "hackduke",
      slug: "hackduke",
      href: "/work/hackduke",
      title: "HackDuke",
      role: "Design Executive",
      year: "2025-2026",
      description: "Crafting UI design decisions for Duke’s premier hackathon",
      image: hackdukePreview,
      imageAlt: "HackDuke website mockup with storefront illustration",
      imageAspect: 634 / 411,
      // Figma crops this wide screenshot slightly left of centre.
      imageFocusX: "39%",
    },
  ] satisfies CaseStudy[],

  showOtherProjects: SHOW_OTHER_PROJECTS,
  otherProjectsHeading: "see other projects...",
  otherProjects: [
    {
      id: "health-hound",
      title: "Health Hound",
      href: "/work/health-hound",
      tone: "teal",
      image: healthHoundPreview,
      imageAlt: "Health Hound mobile app preview",
      interactive: true,
    },
    {
      id: "coming-soon-a",
      title: "Coming Soon",
      tone: "orange",
      interactive: false,
    },
    {
      id: "coming-soon-b",
      title: "Coming Soon",
      tone: "teal-deep",
      interactive: false,
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
      // Matches the pulse_building illustration's exact box (Figma canvas units).
      x: 725,
      y: 438,
      width: 419,
      height: 617,
    },
    {
      id: "hackduke",
      target: "#hackduke",
      prompt: "travel to HackDuke?",
      x: 944,
      y: 747,
      width: 435,
      height: 298,
    },
    {
      id: "other-projects",
      target: SHOW_OTHER_PROJECTS ? "#other-projects" : "#playground-cta",
      prompt: SHOW_OTHER_PROJECTS ? "see other projects?" : "visit the playground?",
      x: 1185,
      y: 444.57,
      width: 258,
      height: 581,
    },
  ],
};

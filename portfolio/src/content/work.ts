import type { ImageMetadata } from "astro";

import pulsePreview from "../assets/work/pulse-preview.png";
import hackdukePreview from "../assets/work/hackduke-preview.png";
import healthHoundPreview from "../assets/work/health-hound-preview.png";

export type PillTone = "coral" | "teal";

export interface WorkPill {
  label: string;
  tone: PillTone;
}

export interface CaseStudy {
  id: string;
  slug: string;
  href: string;
  title: string;
  role: string;
  description: string;
  pills: WorkPill[];
  image: ImageMetadata;
  imageAlt: string;
  /** Optional — when present, CaseStudyCard swaps in a <video> for hover playback. */
  videoSrc?: string;
  /** Text panel tucks left (behind image) or right on scroll-out. */
  fold: "left" | "right";
  layout: "image-right" | "image-left";
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

export const work = {
  caseStudies: [
    {
      id: "pulse",
      slug: "pulse",
      href: "/work/pulse",
      title: "Pulse: For Research",
      role: "Design Lead, Developer",
      description:
        "Creating a new UI personality and developing the engagement layer to foster Duke health research",
      pills: [
        { label: "2026", tone: "coral" },
        { label: "Duke | Code+", tone: "teal" },
      ],
      image: pulsePreview,
      imageAlt: "Pulse for Research app screens on phone and watch",
      fold: "left",
      layout: "image-right",
    },
    {
      id: "hackduke",
      slug: "hackduke",
      href: "/work/hackduke",
      title: "HackDuke",
      role: "Designer",
      description:
        "Designing website flows, layouts, and assets for 100+ participants at Duke’s premier Hackathon",
      pills: [
        { label: "HackDuke", tone: "teal" },
        { label: "2025–2026", tone: "coral" },
      ],
      image: hackdukePreview,
      imageAlt: "HackDuke website mockup with storefront illustration",
      fold: "right",
      layout: "image-left",
    },
  ] satisfies CaseStudy[],

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
      target: "#other-projects",
      prompt: "see other projects?",
      x: 1185,
      y: 444.57,
      width: 258,
      height: 581,
    },
  ],
};

import type { CaseStudyContent } from "./caseStudy";
import previewVideo from "../assets/work/previews/duquantum.mp4?url";
import previewPoster from "../assets/work/previews/duquantum-poster.jpg?url";
import previewFallback from "../assets/work/previews/duquantum.webp?url";

/**
 * DuQuantum (solo designer, inaugural hackathon, Oct 2026). Short write-up
 * like HackDuke's: no TL;DR, one section.
 */
export const duQuantum = {
  title: "DuQuantum",

  meta: [
    { label: "Role", values: ["Solo Designer"] },
    { label: "Event", values: ["DuQuantum 2026", "Oct 2026"] },
    { label: "Tools", values: ["Figma", "TypeScript"] },
  ],

  links: [{ label: "View Website", href: "https://duquantum.org" }],

  preview: {
    video: previewVideo,
    poster: previewPoster,
    fallback: previewFallback,
    alt: "Scrolling through the DuQuantum hackathon website",
  },

  sections: [
    {
      id: "overview",
      heading: "Designing DuQuantum",
      body: [
        "As DuQuantum’s solo design team, I created the 2026 visual identity for our inaugural hackathon, which brings together over 100 participants this October. Beyond designing the site in Figma, I also built my designs into the website’s frontend.",
        "I owned the retro tech theme and color scheme, which were designed to pair well with quantum circuit imagery and our already-established branding. I also created the event’s promotional and social media materials.",
      ],
    },
  ],
} satisfies CaseStudyContent;

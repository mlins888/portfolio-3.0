import type { CaseStudyContent } from "./caseStudy";

/**
 * HealthHound (FigBuild 2026). Deliberately short: no TL;DR, one section,
 * drawn from the Devpost write-up.
 */
export const healthHound = {
  title: "HealthHound",

  meta: [
    { label: "Event", values: ["FigBuild 2026"] },
    { label: "Duration", values: ["1 weekend", "Mar 2026"] },
    { label: "Collaborators", values: ["Team of 4"] },
    { label: "Tools", values: ["Figma Make", "Figma", "Spline"] },
  ],

  links: [{ label: "View on Devpost", href: "https://devpost.com/software/healthhound" }],

  sections: [
    {
      id: "overview",
      heading: "What is HealthHound?",
      body: [
        "Trained service dogs can sniff out biomarkers of disease and sense fatigue in their owners, a sense of smell that has saved lives but has never been built into a commercial wearable. HealthHound is our take on one: the ScensoRing, a concept ring with a biomimetic scent-sensor array that reads trace compounds from the wearer’s skin and breath, through instant scans or continuous monitoring.",
        "The companion HealthHound app turns those readings into something useful: baseline biomarkers, alerts for risks like infection or blood-sugar changes, health trends over time, and a direct line to healthcare providers.",
        "Our team of four, all HackDuke members, designed it over a weekend while traveling. We modeled the ring in Spline, created the graphics in Figma, and designed the app entirely in Figma Make, a tool none of us had used before.",
      ],
    },
  ],
} satisfies CaseStudyContent;

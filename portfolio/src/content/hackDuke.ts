import type { CaseStudyContent } from "./caseStudy";

/**
 * HackDuke (design executive, Fall 2025–present). Short write-up like
 * HealthHound's: no TL;DR, one section.
 */
export const hackDuke = {
  title: "HackDuke",

  meta: [
    { label: "Role", values: ["Design Executive"] },
    { label: "Duration", values: ["Fall 2025 –", "Present"] },
    { label: "Collaborators", values: ["Design team of ~5"] },
  ],

  links: [{ label: "View Website", href: "https://2026.hackduke.org" }],

  sections: [
    {
      id: "overview",
      heading: "Designing HackDuke",
      body: [
        "HackDuke is Duke’s intercollegiate hackathon for social good. As a design executive, I worked with a team of about five designers from fall 2025 through spring 2026 to create the event’s visual identity: the website for a hackathon of 100+ participants, plus the posters, slide decks, and other promotional material around it.",
        "Our theme was a grocery store, and I played a big role in designing the site’s UI layout: deciding how to order assets and images so the page reads intuitively, and making sure our visuals stayed easy to understand within the grocery store theme.",
        "I also illustrated many of the site’s assets, including the cat mascot and several of the grocery store items. I’m looking forward to starting work on the HackDuke 2027 site soon!",
      ],
    },
  ],
} satisfies CaseStudyContent;

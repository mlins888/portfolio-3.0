import type { CaseStudyContent } from "./caseStudy";


import loadingVideo from "../assets/work/heirloom/loading-demo.mp4?url";
import photoBoardVideo from "../assets/work/heirloom/photo-board-demo.mp4?url";
import loomieVideo from "../assets/work/heirloom/loomie-demo.mp4?url";
import sparkFlowVideo from "../assets/work/heirloom/spark-flow-demo.mp4?url";

/**
 * Heirloom case study (Hack GT, Sep 2026). Side media (phone mock-ups,
 * GIFs) goes on a section as `aside`, exactly as in pulse.ts.
 */
export const heirloom = {
  title: "Heirloom",

  meta: [
    { label: "Role", values: ["Design Lead", "iOS UI Engineer"] },
    { label: "Duration", values: ["3 days", "Sep 2026"] },
    { label: "Award", values: ["3rd Place", "Meta @ Hack GT"] },
    { label: "Tools", values: ["Figma", "SwiftUI", "Backboard", "MongoDB"] },
  ],

  links: [
    { label: "View on GitHub", href: "https://github.com/Adalo-Gusa/SPIRE_GT_Hacks" },
    { label: "View on Devpost", href: "https://devpost.com/software/heirloom-3q2bn9" },
  ],

  tldr: [
    {
      lead: "The problem",
      text: "Elders’ stories disappear before anyone records them, and family-tree sites feel like filling out forms.",
    },
    {
      lead: "My role",
      text: "Design lead, iOS UI engineer, and integration lead on a team of three, over three days at HackGT.",
    },
    {
      lead: "What I did",
      text: "Designed every screen in Figma around physical keepsakes, built them in SwiftUI, and got the app running on real iPhones.",
    },
    {
      lead: "The outcome",
      text: "3rd place in Meta’s “Bringing People Closer Together with AI” challenge, at a hackathon of 800+ participants and 200+ teams. Judges singled out the design.",
    },
  ],

  sections: [
    {
      id: "overview",
      heading: "What is Heirloom?",
      aside: { side: "left", kind: "video", video: loadingVideo },
      body: [
        "An iOS app that archives family stories and gives distant relatives reasons to reconnect. It has three parts: a photo board in place of a family tree, Loomie (a voice AI that interviews elders), and family notebooks.",
      ],
    },
    {
      id: "why",
      heading: "Why We Built It",
      body: [
        "Families are scattered, and a group chat that only wakes up for birthdays isn’t closeness. Most people know little about their family past their grandparents, and elders’ stories vanish before anyone writes them down. Existing tools don’t help: family-tree sites feel like forms, and shared albums become photo dumps.",
      ],
    },
    {
      id: "role",
      heading: "My Role",
      // The four phones alternate sides at an even ~35rem step, measured at
      // 1440px wide; offsets nudge each one onto that rhythm.
      aside: { side: "right", offset: 5.75, kind: "video", video: photoBoardVideo },
      body: [
        "My teammates built the voice agent, the archive AI, and the backend. I designed every screen in Figma, then built them in SwiftUI with Claude Code as a pair programmer. I set the direction, reviewed each change, and tested on the simulator and my iPhone. A Figma MCP bridge carried vectors, colors, and spacing into code exactly as drawn.",
        {
          list: [
            {
              lead: "Build:",
              text: "Xcode, SwiftUI, MapKit, FastAPI, MongoDB Atlas, xAI Grok, Cloudflare Tunnel",
            },
          ],
        },
      ],
    },
    {
      id: "direction",
      heading: "Design Direction",
      aside: { side: "left", offset: 19.5, kind: "video", video: loomieVideo },
      body: [
        "My team first floated a nature theme, the obvious choice for a family-tree app. I pushed for something more memorable:",
        {
          list: [
            { text: "A warm pink, purple, and tan palette" },
            { text: "A logo whose linked O’s represent intertwined family ties" },
            { text: "A name with two meanings: an heirloom, and a loom that weaves people together" },
          ],
        },
        "That idea shaped everything else. Loomie is a ball of yarn that sits raised in the nav bar. Tapping it blurs the photo board so the conversation appears on top, keeping family visible behind every story. Instead of a tree of names, the home screen is a corkboard of pinned photos joined by string. Family records live on an actual bookshelf.",
      ],
    },
    {
      id: "sparks",
      heading: "Sparks: Designing for Connection",
      aside: { side: "right", offset: 23.6, kind: "video", video: sparkFlowVideo },
      body: [
        "Sparks answer “why would a teenager care?” As stories come in, the AI finds threads across generations, like a great-grandfather’s tinkering and a granddaughter studying engineering. Each Spark arrives as a notification inviting you to call the relative or ask Loomie for more.",
        {
          ordered: true,
          list: [
            { text: "Loomie prompts Grandpa Joseph: “Alex started college today. What was your first day like?”" },
            { text: "Joseph tells his story, and it’s saved to the family archive." },
            { text: "A Spark connects Joseph’s story to his grandson Alex." },
            { text: "“Give a Call” dials Joseph directly." },
          ],
        },
        "Heirloom doesn’t replace family conversation with AI. It creates reasons to have one.",
      ],
    },
    {
      id: "outcome",
      heading: "Outcome",
      body: [
        "A working iOS app running on real phones, which placed 3rd in Meta’s challenge. Several judges said the design is what brought our concept together.",
        "What I contributed:",
        {
          list: [
            { text: "The visual language and every screen’s design" },
            { text: "The SwiftUI implementation as reusable, animated components" },
            { text: "The Sparks experience" },
            { text: "The integration, backend, and performance work behind the demo" },
          ],
        },
      ],
    },
    {
      id: "learned",
      heading: "What I Learned",
      body: [
        {
          list: [
            {
              lead: "Metaphor carries emotion.",
              text: "Choosing a woven theme over a chart or a nature theme gave the app its identity, and everything else followed from it.",
            },
            {
              lead: "Design should explain itself.",
              text: "We kept narration in our demo video minimal so the UI could carry the story.",
            },
            {
              lead: "Next steps:",
              text: "real family photos in place of illustrated portraits, read status per person, and moving API keys off the device.",
            },
          ],
        },
      ],
    },
  ],
} satisfies CaseStudyContent;

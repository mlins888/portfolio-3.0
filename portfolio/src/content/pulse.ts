import type { ImageMetadata } from "astro";
import type { ListItem, Section } from "./caseStudy";

import landingNew from "../assets/work/pulse/landing-screen-new.png";
import homeScreen from "../assets/work/pulse/home-screen.webp";
import landingOld from "../assets/work/pulse/landing-screen-old.png";
import webPortalGroups from "../assets/work/pulse/web-portal-groups.png";
import webPortalPosts from "../assets/work/pulse/web-portal-posts.png";

import goalSetVideo from "../assets/work/pulse/goal-set-demo.mp4?url";


export interface Badge {
  id: string;
  image: ImageMetadata;
  label: string;
}

/**
 * All hex badge artwork lives in assets/work/pulse/badges — pulled in
 * eagerly so a new file dropped in that folder shows up here without
 * touching this file. Labels are derived from the filename convention
 * `badge_<category>_<milestone>.png`; the two one-off minigame badges
 * (minesweeper, 2048) get their own cases.
 */
const badgeModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/work/pulse/badges/*.png",
  { eager: true },
);

const CATEGORY_LABEL: Record<string, string> = {
  distance: "Distance",
  steps: "Steps",
  energy: "Energy",
  sleep: "Sleep",
  streak: "Login",
};

const CATEGORY_ORDER = ["streak", "steps", "distance", "energy", "sleep", "minigame"];

function describeBadge(id: string): { label: string; category: string; order: number } {
  const goalMatch = id.match(/^badge_(distance|steps|energy|sleep|streak)_(\d+)$/);
  if (goalMatch) {
    const [, category, days] = goalMatch;
    const noun = category === "streak" ? "Streak" : "Goal";
    return {
      label: `${days}-Day ${CATEGORY_LABEL[category]} ${noun}`,
      category,
      order: Number(days),
    };
  }

  const tierMatch = id.match(/^badge_minesweeper_(bronze|silver|gold)$/);
  if (tierMatch) {
    const tier = tierMatch[1];
    const tierRank = { bronze: 0, silver: 1, gold: 2 }[tier] ?? 0;
    return {
      label: `Minesweeper — ${tier[0].toUpperCase()}${tier.slice(1)}`,
      category: "minigame",
      order: tierRank,
    };
  }

  if (id === "badge_2048") {
    return { label: "2048 Champion", category: "minigame", order: 10 };
  }

  return { label: id.replace(/^badge_/, "").replace(/_/g, " "), category: "other", order: 0 };
}

export const badges: Badge[] = Object.entries(badgeModules)
  .map(([path, mod]) => {
    const id = path.split("/").pop()!.replace(/\.png$/, "");
    const { label, category, order } = describeBadge(id);
    return { id, image: mod.default, label, category, order };
  })
  .sort((a, b) => {
    const catDiff = CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
    return catDiff !== 0 ? catDiff : a.order - b.order;
  })
  .map(({ id, image, label }) => ({ id, image, label }));

export const pulse = {
  title: "Pulse: For Research",

  /** Film-strip frames for the case-study header — one label over its
   *  stacked values. Add or reorder frames freely; FilmStrip wraps past
   *  its column count and grows to fit. */
  meta: [
    { label: "Role", values: ["Developer", "Design Lead"] },
    { label: "Duration", values: ["May–Jul 2026"] },
    { label: "Collaborators", values: ["Team of 4"] },
    { label: "Tools", values: ["SwiftUI", "Figma", "Preact", "FastAPI"] },
  ],

  tldr: [
    {
      lead: "The problem",
      text: "Duke’s health-research app only collects data when participants open it, and it gave them no reason to.",
    },
    {
      lead: "My role",
      text: "Design lead and developer on a team of four in Duke Code+, over 10 weeks.",
    },
    {
      lead: "What I did",
      text: "Set the visual direction, designed a streak-based engagement system (a Tamagotchi-style pet plus 30+ badges I illustrated), built goal setting in SwiftUI, and designed a secure admin portal.",
    },
    {
      lead: "The outcome",
      text: "A tested prototype continuing toward production. Separately, my concerns about student art being used for AI training changed Code+’s design policy.",
    },
  ] satisfies ListItem[],

  sections: [
    {
      id: "problem",
      heading: "The Problem",
      // The three phones (landing, before/after flip, goal-setting video)
      // alternate sides on an even ~28.6rem step, measured at 1440px wide,
      // so the last one clears the badge row below it.
      aside: {
        side: "left",
        kind: "image",
        image: {
          image: landingNew,
          alt: "Pulse for Research welcome screen with the branded gradient and a Continue button",
        },
      },
      body: [
        "Dr. Amanda Randles and Duke’s DCCDHI built an app that pools wearable data from consenting participants into one de-identified dataset. Researchers at many institutions can draw from it without a new round of IRB approval for every study. The catch: on iOS, background data collection only keeps running if people open the app, and the original app gave them no reason to.",
      ],
    },
    {
      id: "role",
      heading: "My Role",
      body: [
        "Design lead and developer on a team of four Duke sophomores in Code+ (May–July 2026). I owned the visual direction and gamification system and built goal setting in SwiftUI. I also worked on the Python backend and its API integration, and designed and helped build the admin portal.",
      ],
    },
    {
      id: "question",
      heading: "The Question",
      body: [
        "Every decision came back to one question: why would someone want to open this app every day? We scoped four features around it:",
        {
          list: [
            { text: "Health metrics people can actually understand" },
            { text: "Duke Rec classes gathered in one place" },
            { text: "Gamified check-ins and goals" },
            { text: "Social features" },
          ],
        },
      ],
    },
    {
      id: "design",
      heading: "Designing From a Blank Canvas",
      body: [
        "The original app was a plain chart with almost no visual design. I built a design system on DCCDHI’s brand so Pulse still reads as a credible Duke research tool. Then I layered in playful, fluid elements so it feels like something you’d open on your own, not just a study you signed up for.",
      ],
      aside: {
        side: "right",
        // Pulled up so it sits vertically centred between the two phones in
        // the left margin (the landing screen above, goal-setting below).
        offset: -25.5,
        kind: "flip",
        before: {
          image: landingOld,
          alt: "Original Pulse for Research landing screen, a plain Energy Levels chart",
        },
        after: {
          image: homeScreen,
          alt: "Redesigned Pulse home screen: the PulsePet hedgehog above goal progress, the trophy case, and health stat cards",
        },
      },
    },
    {
      id: "engagement",
      heading: "Making Engagement a Habit",
      body: [
        "Habit-forming apps like Duolingo rely on the streak: a small daily commitment that feels costly to break. So I tied the streak to something people would care about. Your Tamagotchi-style pet’s health rises and falls with your daily check-ins. That turns an invisible requirement (open the app so data syncs) into something personal.",
        "For longer-term retention, I built goal setting that turns steps, distance, and sleep into daily or weekly targets. Hitting a target earns a badge. I illustrated 30+ badges, tiered by category and milestone, so new users get early wins and dedicated users always have something to chase.",
      ],
      // TODO(pet): add the pet visual as a second, left-side aside once it exists.
      aside: {
        side: "left",
        offset: -11.5,
        kind: "video",
        video: goalSetVideo,
      },
      after: "badges",
    },
    {
      id: "testing",
      heading: "Testing and Iterating",
      body: [
        "We ran small-group usability and accessibility tests with about 10 participants. The usability feedback led to three changes:",
        {
          list: [
            { text: "We added goal setting to the fitness screen, not just the home screen." },
            { text: "We reworked the social screens." },
            { text: "We added info pop-ups explaining features." },
          ],
        },
        "The accessibility checks made sure consent screens were readable, color contrast was high, and buttons worked with screen readers.",
      ],
    },
    {
      id: "community",
      heading: "Keeping the Community Safe",
      body: [
        "Social features in a research app need moderation. I designed an admin site in the app’s design language and helped build it. It sits behind Duke’s Shibboleth login and is containerized with Docker, so only authorized staff can manage posts and groups.",
      ],
      after: "admin",
    },
    {
      id: "ahead",
      heading: "Looking Ahead",
      body: [
        "Pulse ended as a tested prototype continuing toward a production release, with larger-scale testing planned. With more time, I’d replace generic SwiftUI elements with custom icons and motion. That would make the design more cohesive and easier to carry over to Android.",
        "I also raised concerns within Code+ about student work, especially original art, being used for AI training. That conversation changed the program’s design policies for future students.",
      ],
    },
  ] satisfies Section[],

  adminShots: [
    { image: webPortalGroups, alt: "Pulse admin portal — Groups management screen" },
    { image: webPortalPosts, alt: "Pulse admin portal — Post Moderation screen" },
  ],
};

import type { ImageMetadata } from "astro";

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

/** A bulleted item; `lead` renders bold ahead of the text. */
export interface ListItem {
  lead?: string;
  text: string;
}

/** A paragraph, or a bulleted list. */
export type Block = string | { list: ListItem[] };

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
  /** Wide media that breaks across the page after this section. */
  after?: "badges" | "admin";
}

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
      text: "Duke’s health-research app depended on participants opening it daily, but gave them no reason to.",
    },
    {
      lead: "My role",
      text: "Design lead and developer on a team of four sophomores in Duke’s Code+ program, over 10 weeks.",
    },
    {
      lead: "What I did",
      text: "Set the app’s visual direction, designed its engagement system (a Tamagotchi-style pet tied to daily streaks, plus goals that earn badges I illustrated), built goal setting in SwiftUI, and designed a secure admin portal for moderating the social features.",
    },
    {
      lead: "The outcome",
      text: "A tested, iterated prototype that’s continuing toward a production release. Along the way, I raised concerns about student art being used for AI training, which led to design-policy changes for future Code+ students.",
    },
  ] satisfies ListItem[],

  sections: [
    {
      id: "problem",
      heading: "The Problem",
      body: [
        "Life-saving health research moves slowly. At institutions like Duke, every new study can mean another round of costly, time-consuming IRB approval before any data is collected. Dr. Amanda Randles and the Duke Center for Computational and Digital Health Innovation (DCCDHI) came up with a way around it: a health app that collects wearable data from consenting participants into one shared, de-identified pool that researchers at many institutions can draw from.",
        "There was a catch. On iOS, the background tasks that collect that data only keep running if people actually open the app. The original app offered basically no reason to come back, so the whole research pipeline depended on an engagement problem nobody had solved yet.",
      ],
    },
    {
      id: "role",
      heading: "My Role",
      body: [
        "Design lead and developer on a team of four Duke sophomores, over a 10-week summer (May–July 2026) in Duke’s Code+ program. I owned the app’s visual direction and gamification system, built the goal-setting feature in SwiftUI, and designed and co-developed the admin web portal.",
      ],
    },
    {
      id: "question",
      heading: "The Question",
      body: [
        "One question drove the whole project: why would someone actually want to keep using this app? As design lead, I felt that this is a motivation backing a majority of our work, and so it shaped every decision that followed.",
        "Our team scoped four features around it:",
        {
          list: [
            {
              lead: "Meaningful health metrics:",
              text: "For an app centered around health data, allowing users to simply understand and make beneficial decisions based on their trends is crucial.",
            },
            {
              lead: "Duke Recreation, in one place:",
              text: "Duke Rec’s classes and fitness events were scattered across a confusing collection of websites, which made them hard to find and sign up for. Pulse pulls from the Duke Rec API and gathers every sign-up in one place, then sends you straight to the right registration page. It’s a Duke-specific feature, and a practical reason to open the app.",
            },
            { lead: "Gamified check-ins and fitness goals", text: "" },
            {
              lead: "Social features:",
              text: "so participants can connect with each other.",
            },
          ],
        },
        "Together they make Pulse an all-in-one place to keep up with your health, connect with others, and get rewarded for showing up. That consistency is exactly what the research needs.",
      ],
      aside: {
        side: "left",
        kind: "image",
        image: {
          image: landingNew,
          alt: "Pulse for Research welcome screen with the branded gradient and a Continue button",
        },
      },
    },
    {
      id: "design",
      heading: "Designing From a Blank Canvas",
      body: [
        "The original app had minimal functionality and no real visual design, which meant I was starting almost from scratch. I built the design system around DCCDHI’s existing brand identity, so the app still reads as a credible Duke research tool. I then combined that with some more playful and fluid elements, so it feels like something you’d open on your own and not just a study you signed up for.",
      ],
      aside: {
        side: "right",
        // Pulled up so it sits vertically centred between the two phones in
        // the left margin (the landing screen above, goal-setting below).
        offset: -14.6,
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
        "I took charge of the heart of the engagement strategy: gamification. Before designing anything, I looked at how habit-forming apps like Duolingo keep people coming back. The pattern that kept showing up was the streak: a small daily commitment that feels costly to break.",
        "So I tied the streak to something people would care about. Participants choose a Tamagotchi-style pet, and its health rises and falls with their daily check-in streak. Skip a day and your pet feels it. That turns an invisible requirement (open the app so data can sync) into something personal.",
        "Streaks bring people back daily, but I also wanted to implement longer-term retention. I built a goal-setting feature that turns the metrics participants already track, like steps, distance and sleep, into daily or weekly targets. Hitting a target earns a badge. I illustrated the full badge set, tiered by category and milestone, so new users get early wins and dedicated users always have something further to chase.",
      ],
      // TODO(pet): add the pet visual as a second, left-side aside once it exists.
      aside: {
        side: "left",
        kind: "video",
        video: goalSetVideo,
      },
      after: "badges",
    },
    {
      id: "community",
      heading: "Keeping the Community Safe",
      body: [
        "Social features create a responsibility, especially in a university-affiliated research app. Research staff needed a way to moderate posts and groups without touching code, so I designed a minimal admin website that matches the app’s design language, and helped build it. We put it behind Duke’s Shibboleth login and containerized it with Docker, so only authorized administrators can reach the moderation tools.",
      ],
      after: "admin",
    },
    {
      id: "ahead",
      heading: "Looking Ahead",
      body: [
        "Toward the end of the project, we ran some preliminary UI/UX testing, which gave us a window into smaller fixes we could make right away and larger-scope tasks for future iterations.",
        "We finished with a solid prototype that will keep being iterated on toward a production release. With more time, I’d polish the designs further and innovate more unique icon sets and motion designs beyond some of Apple’s generic SwiftUI features we utilized for this timeframe. A more custom component set would make the design more cohesive and easier to carry over to an Android release.",
        "Some of my impact reached past the app itself. I raised concerns within Code+ about how the work students make, especially original art, could be used for AI training. That conversation led to changes in the program’s design policies for Code+ students in years to come.",
      ],
    },
  ] satisfies Section[],

  adminShots: [
    { image: webPortalGroups, alt: "Pulse admin portal — Groups management screen" },
    { image: webPortalPosts, alt: "Pulse admin portal — Post Moderation screen" },
  ],
};

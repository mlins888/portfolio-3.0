import type { ImageMetadata } from "astro";

import landingNew from "../assets/work/pulse/landing-screen-new.png";
import landingOld from "../assets/work/pulse/landing-screen-old.png";
import webPortalGroups from "../assets/work/pulse/web-portal-groups.png";
import webPortalPosts from "../assets/work/pulse/web-portal-posts.png";

import goalSetVideo from "../assets/work/pulse/goal-set-demo.mp4?url";
import trophyVideo from "../assets/work/pulse/trophy-demo.mp4?url";


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
    { label: "Tools", values: ["SwiftUI", "SwiftData", "Figma", "Preact", "FastAPI"] },
  ],

  overview:
    "Pulse: For Research is a mobile app that turns participants' wearable data — collected through Apple HealthKit with informed consent — into a shared, de-identified repository for health researchers. By centralizing this data collection, the Duke Computational and Digital Health Innovation Lab and its partners can launch new studies without the delay of new IRB approval for each one. My team's mandate was to redesign the app's experience end to end and build engagement features that kept participants opening the app regularly, since its background data-collection tasks depend on active daily use.",

  landing: {
    before: { image: landingOld, alt: "Original Pulse for Research landing screen, a plain Energy Levels chart" },
    after: { image: landingNew, alt: "Redesigned Pulse for Research landing screen with branded gradient welcome" },
  },

  features: {
    goalSetting: {
      id: "goal-setting",
      title: "Goal setting",
      description:
        "I built a goal-setting feature that lets participants turn their tracked health metrics — steps, distance, sleep, and more — into daily or weekly targets. Progress toward each goal updates in real time and feeds directly into the badge system below, giving every stat a tangible reward attached to it.",
      video: goalSetVideo,
    },
    trophyCase: {
      id: "trophy-case",
      title: "Trophy case",
      description:
        "Taking a page from habit-forming apps like Duolingo, I designed a trophy case that rewards participants for hitting goals and keeping up daily streaks, turning consistent engagement into something collectible. I illustrated every badge in the set myself, hand-tuned per goal category and milestone.",
      video: trophyVideo,
    },
    adminPortal: {
      id: "admin-portal",
      title: "Admin web portal",
      description:
        "Since the app included social features — image posts, leaderboard groups, and friend lists — I designed and co-developed a dockerized Preact admin portal so research staff could moderate content and enforce community guidelines. Access is locked behind Shibboleth authentication to keep moderation tools restricted to authorized administrators.",
      images: [
        { image: webPortalGroups, alt: "Pulse admin portal — Groups management screen" },
        { image: webPortalPosts, alt: "Pulse admin portal — Post Moderation screen" },
      ],
    },
  },
};

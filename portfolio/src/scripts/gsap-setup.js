import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Shared GSAP setup for the site.
 *
 * The pattern: components tag animatable elements with `data-anim="<name>"` and
 * never animate themselves. A section's own scoped <script> imports these
 * helpers, collects the elements it cares about, and builds one timeline. That
 * keeps components reusable and keeps choreography in one readable place.
 *
 * Plugins are registered once, here, so no component has to remember to do it.
 */
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const EASE = {
  soft: "power3.out",
  glide: "power2.out",
  pop: "back.out(1.7)",
};

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Every element inside `root` tagged with a given data-anim name. */
export function targets(root, name) {
  return Array.from(root.querySelectorAll(`[data-anim="${name}"]`));
}

/**
 * Jump straight to the finished state — used for reduced-motion visitors.
 */
export function showAll(root) {
  gsap.set(root.querySelectorAll("[data-anim]"), {
    opacity: 1,
    clearProps: "transform",
  });
}

/**
 * Reveal anything tagged for animation that a timeline never claimed. Elements
 * start at opacity 0 via CSS, so this is the safety net that keeps a renamed or
 * forgotten data-anim value from leaving artwork permanently invisible.
 */
export function revealUnclaimed(root, claimed) {
  const leftovers = Array.from(root.querySelectorAll("[data-anim]")).filter(
    (el) => !claimed.includes(el),
  );

  if (leftovers.length > 0) {
    gsap.set(leftovers, { opacity: 1 });
  }
}

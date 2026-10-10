import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap-setup.js";

/**
 * Slower, eased wheel scrolling for the whole site.
 *
 * Lenis drives the native scroll position (no wrapper markup), so
 * ScrollTrigger and gsap's ScrollToPlugin keep working unchanged. It only
 * touches mouse-wheel / trackpad input — touch scrolling stays native.
 *
 * Tuning:
 *  - wheelMultiplier: distance per wheel tick (1 = browser default). Lower
 *    is slower.
 *  - lerp: how quickly the page catches up to the target (0–1). Lower is
 *    floatier.
 */
if (!prefersReducedMotion()) {
  const lenis = new Lenis({
    wheelMultiplier: 0.65,
    lerp: 0.09,
    // Let scrollable children (the playground modal, carousels) scroll
    // themselves instead of Lenis hijacking the wheel.
    allowNestedScroll: true,
    autoRaf: false,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

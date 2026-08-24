/**
 * Shared "hover-highlight hotspot" behavior — an invisible hit target layered
 * over a piece of artwork toggles a `.is-glowing` class on that artwork (see
 * `.hotspot-button` / `.hotspot-glow` in global.css for the visual side) and
 * fires optional callbacks for whatever a page wants to layer on top (the
 * hero's speech bubbles, the playground's modal cards, ...).
 *
 * Originally built for the hero's building hotspots; factored out here so any
 * page can reuse the exact same interaction without duplicating it.
 *
 * Markup contract: each hotspot is an element carrying `data-hotspot`. It may
 * also carry `data-glow-target`, a CSS selector (resolved against `root`,
 * i.e. it may match more than one element — the box stack glows as one unit
 * across its three layers) naming what should receive `.is-glowing` while
 * the hotspot is hovered/focused.
 */
export function initHotspots(root, { onEnter, onLeave, onClick } = {}) {
  const hotspots = Array.from(root.querySelectorAll("[data-hotspot]"));

  function setGlow(hotspot, active) {
    const selector = hotspot.getAttribute("data-glow-target");
    if (!selector) return;
    root.querySelectorAll(selector).forEach((el) => el.classList.toggle("is-glowing", active));
  }

  hotspots.forEach((hotspot) => {
    hotspot.addEventListener("pointerenter", () => {
      setGlow(hotspot, true);
      onEnter?.(hotspot);
    });
    hotspot.addEventListener("pointerleave", () => {
      setGlow(hotspot, false);
      onLeave?.(hotspot);
    });
    hotspot.addEventListener("focus", () => {
      setGlow(hotspot, true);
      onEnter?.(hotspot);
    });
    hotspot.addEventListener("blur", () => {
      setGlow(hotspot, false);
      onLeave?.(hotspot);
    });
    hotspot.addEventListener("click", () => onClick?.(hotspot));
  });

  return hotspots;
}

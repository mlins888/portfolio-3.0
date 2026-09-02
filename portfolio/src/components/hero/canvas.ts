/**
 * The hero is a fixed-ratio comic cover, so it is laid out on a canvas that
 * matches the Figma frame 1:1 — 1 canvas unit === 1px in Figma. Hero.astro
 * defines `--u` as one unit of the frame's current width, so every number you
 * see in a component is the number you'd read off the Figma inspector, and the
 * whole cover scales fluidly with its container.
 *
 * Outside the hero canvas `--u` is undefined and falls back to 1px, which is
 * what makes the decorative components usable anywhere on the site.
 */
export const CANVAS = { width: 1440, height: 1025 } as const;

/**
 * The rocket's striped ribbon doubles as the site's scroll progress bar
 * (components/ScrollRocket.astro), fixed flush under the nav.
 */
export const ROCKET_TRACK = {
  /** Horizontal inset. Flush with the left edge of the screen — the ship's
   *  terminal position (trailMax + shipLead, still measured from this same
   *  left edge) shifts left along with it, which is fine since nothing else
   *  anchors to it. */
  x: 0,
  width: 1355,
  /** Trail length at 0% and 100% scrolled. trailMax is picked so the ship's
   *  ROTATED bounding box — its layout box is shipWidth × the SVG's natural
   *  height (166.582), rotated ~90° about its own centre, which swaps which
   *  dimension reaches furthest horizontally — has its rightmost visible
   *  pixel land exactly on the screen's right edge at 100% scrolled:
   *  trailMax + shipLead + shipWidth/2 + 166.582/2 = 1440 (the canvas's
   *  full-viewport-width unit count). Re-derive this if shipWidth,
   *  shipLead, or the rocket artwork's aspect ratio ever change. */
  trailMin: 16.8,
  trailMax: 1290.2,
  /** The ship's box starts this far ahead of the trail's end, so the trail
      tucks under its exhaust rather than butting against it. */
  shipLead: 35.1,
  shipWidth: 62.804,
  shipRotation: 90.42,
} as const;

/** Turn a Figma pixel value into a canvas-relative CSS length. */
export function u(n: number): string {
  return `calc(${n} * var(--u, 1px))`;
}

/**
 * Build an inline style string, dropping empty declarations. Astro renders a
 * style object as "[object Object]", so styles are always strings here.
 */
export function css(
  declarations: Record<string, string | number | undefined>,
): string {
  return Object.entries(declarations)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(
      ([property, value]) =>
        `${property.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}: ${value}`,
    )
    .join("; ");
}

export interface CanvasBox {
  /** Left edge, in canvas units. Omit to leave the element in normal flow. */
  x?: number;
  /** Top edge, in canvas units. */
  y?: number;
  width?: number;
  height?: number;
  /** Degrees, rotated about the element's centre. */
  rotation?: number;
  /** Any CSS colour. Drives currentColor for tintable SVG artwork. */
  color?: string;
}

/** Build the inline style for an element placed on the hero canvas. */
export function canvasStyle({
  x,
  y,
  width,
  height,
  rotation,
  color,
}: CanvasBox): string {
  const placed = x !== undefined || y !== undefined;

  return css({
    position: placed ? "absolute" : undefined,
    left: x !== undefined ? u(x) : undefined,
    top: y !== undefined ? u(y) : undefined,
    width: width !== undefined ? u(width) : undefined,
    height: height !== undefined ? u(height) : undefined,
    transform: rotation ? `rotate(${rotation}deg)` : undefined,
    color,
  });
}

/** Scale an artwork's natural size to a requested width, keeping its ratio. */
export function fitWidth(
  natural: { w: number; h: number },
  width?: number,
): { width: number; height: number } {
  const w = width ?? natural.w;
  return { width: w, height: (w / natural.w) * natural.h };
}

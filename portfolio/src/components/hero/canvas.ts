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
export const CANVAS = { width: 1440, height: 963 } as const;

/**
 * The landing's planet scene (moon, tree, buildings, swing) is drawn at its
 * Figma coordinates, then scaled down by SCENE.scale about the middle of
 * the moon's flat bottom edge (SCENE.origin), so it shrinks toward the
 * ground. HeroCat applies the same scale to the planet it runs on.
 */
export const SCENE = { scale: 0.9, origin: { x: 735.5, y: 870 } } as const;

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

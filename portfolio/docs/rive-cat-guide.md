# Interactive cat in the hero's top band, built in Rive

## Context
Now that the always-on nav bar carries the name and links, the hero's top coral band (corner cat and stamp, comic nav banners, "Hello! I'm…", MAKENNA LINSKY, speech burst) is mostly redundant.

The user wants to turn that band into a little playground for an animated cat:
- **Cursor inside the band:** the cat runs over and grabs onto the cursor.
- **Cursor outside the band:** the cat goes to the closest spot inside the band and sits waiting for it to come back.

The user wants to make the cat in Rive, has never done this kind of thing, and asked for **just the guide for now**. Wiring it up comes once they have a `.riv` file.

## The split: Rive does the body, the site does the brain
- **Rive** owns *how the cat moves*: sitting, waiting, running, grabbing, hanging on. It's a set of looping animations inside one state machine that switches between them when told to.
- **The site's code** owns *where the cat is*: tracking the cursor, clamping the target inside the band, moving the cat there at a running speed, flipping it to face the way it's heading, and telling Rive which state to be in.

This keeps the Rive file small and beginner-sized: no pathfinding or page geometry inside Rive. The behavior can be tuned in code without re-exporting.

## What to build in Rive (the "contract")
Use the **Rive editor** at rive.app (the free tier is fine).

1. **Art (drawn in Procreate).** Procreate can't export SVG, and you don't need it to: Rive animates images too.
   - **Separate layers:** draw each body part on its own layer (head, ears, eyes and pupils, body, tail, and each leg split into upper leg, lower leg and paw). Then use **Share → PNG Files**, which exports every layer as its own transparent PNG.
   - **Overlaps:** draw the hidden bits too, like the full top of a leg tucked under the body. Give joints slightly overlapping round ends so the pieces still meet when they rotate.
   - **One view:** draw everything in a **single view** (side or three-quarter), **facing right**; the site flips it for left. Rive is 2D cutout animation: it moves, rotates, scales, skews and bends (bones and meshes) each part, but can't turn a drawing in 3D. Within one view you draw each part once.
   - **Adding a front view later:** a different view, such as a front-facing sit like your logo, needs its own drawing. Rive swaps it in by toggling which drawing is visible inside an animation.
   - **Tracing instead:** only if you want vector art (Illustrator *Image Trace* or vectorizer.ai, then import the SVG). Raster parts keep your hand-drawn line and stay light at this size.
   - Import the PNGs into Rive and group them into the cat.
2. **Artboard.** Name it `Cat`, roughly 400×400 with a transparent background.
   - Put the cat's feet on a line about 10% above the bottom, centered horizontally. The site anchors the cat by that bottom-center point.
   - Leave headroom for the grab pose, where the paws reach up.
3. **Rig.** Add **bones** to the tail (3–4 bones) and the legs, so the animations bend instead of sliding pieces around.
   - Leg pieces can just be parented to their bones and rotate.
   - For the tail, turn its image into a **mesh** bound to the bones so the raster drawing bends smoothly.
   - For the eyes, a simple translate on the pupils is enough.
4. **Timeline animations** (each set to **loop** unless noted):

   | Name | What it shows |
   |---|---|
   | `sit` | Idle: blink, tail swish, a little breathing |
   | `wait` | Crouched by the band's edge waiting: tail flick, butt wiggle like it's about to pounce |
   | `run` | Run cycle in place (the site moves it across the band) |
   | `grab` | **One-shot:** leap and reach up, paws closing |
   | `hang` | Holding the cursor: dangling, back legs kicking slowly |

5. **State machine** named `Cat`, with these **inputs**. The names must match exactly, because the site sets them:

   | Input | Type | Meaning |
   |---|---|---|
   | `running` | Boolean | The cat is moving toward its target |
   | `holding` | Boolean | The cat has reached the cursor and is hanging on |
   | `waiting` | Boolean | The cursor is outside the band, so the cat sits at the edge in the `wait` pose |
   | `lookX` | Number −1…1 (optional) | Head and pupils turn toward the cursor while waiting or sitting |

   **Transitions:** sit ↔ run on `running`; run → wait when `waiting`; run → grab → hang when `holding`; hang → run when `holding` turns off. Use 0.1–0.2s blend durations so switches look smooth.

   Test it in Rive's **state machine playback panel** by toggling the inputs by hand. If it looks right there, it'll look right on the site.
6. **Export.** Go to **File → Export → for runtime** (a `.riv` file) and send it to me, or drop it in `public/rive/cat.riv`.

**Learning path:** Rive's docs, in order:
- *Interface overview*
- *Bones*
- *Timeline & keys*
- *State Machine*
- *Inputs*

The Rive **Community** also has free cat and character rigs you can remix to see how others set up run cycles and state machines. It's the fastest way to learn the bones and run-cycle part.

Keep it small: the first version can be just `sit`, `run` and `hang`. `wait`, `grab` and `lookX` are polish you can add later without changing the site code.

## How I'll wire it in once the `.riv` exists (later, not now)
- **Package:** add `@rive-app/canvas`, the small 2D runtime. `@rive-app/webgl2` is only needed if the file uses feathered or blurred effects.
- **New component, `src/components/hero/HeroCat.astro`.** It renders a `<canvas>` absolutely positioned inside the top band's box (canvas units from `src/components/hero/canvas.ts`, the band at x 42, y 43, 1355×329), and loads `cat.riv` with the `Cat` state machine.
- **Behavior loop** (gsap ticker, already in `src/scripts/gsap-setup.js`):
  - Track `pointermove`. The target is the cursor if it's inside the band; otherwise it's the cursor clamped to the band's nearest edge, with `waiting = true`.
  - Move the cat toward the target at a capped run speed with a little easing, and set `running` while it's further than a few px away.
  - Within grab range of an in-band cursor, set `holding = true` and keep the cat's paws locked to the cursor until it leaves the band.
  - Flip the canvas horizontally when it's heading left, and feed `lookX`.
- **Band content:** remove or slim down whatever we agree should go from the top band (to decide when we wire it).
- **Edge cases:**
  - Touch devices: no hover, so the cat just idles (`sit`).
  - Reduced motion: a static `sit` pose.
  - Loading: before the `.riv` loads, the band shows the existing cat drawing as a fallback.

## Verification (for the later wiring)
In the browser at desktop width:
- the cursor inside the band makes the cat run to it and hang on
- leaving the band sends the cat to the nearest edge to wait
- coming back resumes the chase
- no horizontal overflow at 390px
- reduced motion shows a still cat
- `astro build` passes

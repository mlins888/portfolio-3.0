# Interactive cat in the hero's top band, built in Rive

_Part 1 (below) is the overall plan and the Rive "contract" the site expects. Part 2 (at the end) is the step-by-step for turning the traced Figma cat into that Rive file._

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

1. **Art (drawn in Procreate).** _Superseded: the cat is now traced as vectors in Figma. Follow Part 2, Step 1 instead._ Procreate can't export SVG, and you don't need it to: Rive animates images too.
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

---

# Part 2: From the traced Figma cat to a Rive animation

## Context
The user traced their cat sketch into vector layers in Figma (`cat`, node 333:208 in the Portfolio Design file) and asked how to turn it into the Rive animation for the hero's top band. The site-side behavior is in Part 1 above.

What's in the Figma frame (456×612, standing three-quarter view, facing right):

| Group | Layers |
|---|---|
| Behind the body | `tail`, `hind back leg`, `fore back leg` |
| Middle | `body` (outline plus an inner shape), `neck`, `chest fluff` |
| In front of the body | `hind front leg`, `fore front leg` |
| Head | `head`, `left ear`, `right ear`, `antennae`, `face` |

That's already a good cutout rig layout: separate, sensibly named parts, layered back to front, facing the direction the site expects.

## Step 1: Prep in Figma (about 15 minutes, saves hours in Rive)
1. **Keep your line-plus-fill pairs (already done).** Each part is a group of an **open stroke line** with a **separate filled shape behind it** (e.g. `hind back leg` = `Vector 180`, the line, over `Vector 179`, the fill). This is the right setup for animation:
   - The open lines mean there's no outline where a limb meets the body.
   - The fill acts as the part's "paper", so the body's line won't show through a front leg swinging over it.
   - A few things to keep it working:
     - **Same group:** keep each line and its fill together in one group, so rotating the group moves both.
     - **Tuck the fill:** where a line stops open (the top of a leg meeting the body, the base of the tail), let the **fill extend a little past the line's ends**, tucked under the body. Then a rotating limb never opens a gap at the joint.
     - **Stay inside the line:** the fill shouldn't stick out past the stroke anywhere else.
     - **Check for parts without a fill:** `chest fluff`, `head` and `face` are single shapes. If anything needs to hide what's behind it (the head over the neck, for instance), give it a fill shape the same way.
2. **Split the face.** Inside `face`, keep each eye (white, pupil, sparkle), the nose and the mouth as separate named layers (e.g. `eye L`, `pupil L`, `mouth`) so you can blink (squash an eye vertically) and move the pupils (for `lookX`).
3. **Keep strokes as strokes.** Don't outline them. Rive imports strokes with their caps, and bones bend stroked paths more cleanly than outlined shapes.
4. **Leave the legs whole.** No need to cut them into thigh and shin: in Rive you'll bend each one with two bones. Line art with a hard cut at the knee would show a seam when it rotates.
5. **Make the frame bigger.** Resize the `cat` frame to about 650×750 with the cat's feet near the bottom center, leaving headroom for the leap and grab. Remove the frame's fill so its background is transparent.
6. **Export:** select the `cat` frame → **Export → SVG**, and in the export settings turn on **"Include 'id' attribute"** so your layer names carry into Rive as group names.

## Step 2: Import and set pivots in Rive
1. New file → **Artboard** named `Cat`, the same size as the frame, with no fill. Drag the SVG onto it. Check that the hierarchy matches your Figma layers.
2. **Set each part's pivot** (origin): where it should rotate from. Select the group, press **Freeze** (so moving the origin doesn't move the art) and drag the origin to:

   | Part | Pivot |
   |---|---|
   | head (with ears, antennae and face inside it) | the neck |
   | ears | their base |
   | antennae | where they sprout |
   | tail | where it meets the body |
   | legs | the hip (top of each leg) |

3. **Nest the head:** make sure `left ear`, `right ear`, `antennae` and `face` sit inside a head group, so turning the head carries them along.

## Step 3: Rig with bones
1. **Tail:** a chain of 3–4 bones from the base to the tip. Select the tail's paths → **Bind bones** in the inspector → pick the tail bones. Rive weights the vertices automatically, so the line art bends smoothly.
   - **Bind both shapes of each part,** the line *and* its fill, to the same bones. Otherwise the line bends and the fill stays stiff behind it.
2. **Legs:** 2 bones each (hip → knee → paw), bound the same way.
   - **Optional:** add an **IK constraint** to each leg with a target at the paw. Then you animate a run by moving four paw targets instead of rotating eight bones. Skip it if it feels like too much at first.
3. **Antennae:** 2 bones each so they boing and wobble. Cheap, and very charming in a run.
4. **Body:** an optional single "spine" bone, if you want the back to arch in the run or the crouch.

## Step 4: Animate (start with three)
Make each one a timeline animation set to loop:

| Animation | What to key |
|---|---|
| `sit` (idle) | Your current standing pose. Blink every ~3 seconds (scale an eye's height to 0.1 for 2–3 frames), a slow tail swish, an ear twitch, an antennae sway. About 4 seconds long. |
| `run` | A ~0.4 second loop with 4 key poses: contact, down, passing, up. Legs work in opposite pairs, the body bobs a few px, the head bobs a frame behind the body, the tail streams out straight behind, and the antennae flop back. |
| `hang` | The cat dangling from the cursor: arms up, body slightly stretched, back legs kicking slowly, tail swinging like a pendulum. The site pins the cat's paws to the cursor. |

Polish to add later, without any site changes: `wait` (crouch low, rear wiggling, tail flicking, like it's about to pounce), `grab` (a one-shot leap with paws reaching up), and `lookX` (pupils and a slight head turn).

**Workflow tip:** key every pose in the **first** animation (`sit`). Then **duplicate** it to start the next one, so all of them share the same rest pose and the state machine blends between them cleanly.

## Step 5: State machine and export
Use the contract from Part 1 above: a state machine named `Cat` with Boolean inputs `running`, `holding` and `waiting` (plus an optional Number `lookX`), with transitions blending over 0.1–0.2s.

Test it in the **state machine playback panel** by toggling the inputs, then **Export → for runtime** as `cat.riv` and put it in `public/rive/`. That's when I wire it into the band.

## Verification
The user's checks, in Rive:
- every part rotates around its joint without showing lines through other parts
- the tail and legs bend smoothly (no kinks at bone joints)
- toggling `running` and `holding` in the playback panel switches animations smoothly

import type { APIRoute } from "astro";

import { getNowPlaying } from "../../lib/spotify";

// Run on demand (Vercel serverless function) instead of being prerendered,
// so the response reflects what I'm actually listening to.
export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const track = await getNowPlaying();

    if (!track) {
      return json({ isPlaying: false, track: null }, 200, 60);
    }

    return json({ track }, 200, 60);
  } catch (err) {
    console.error("[now-playing]", err);
    // Fail soft — the About page just hides the widget on a null track.
    return json({ track: null, error: "unavailable" }, 200, 30);
  }
};

/** JSON response with a short shared cache so we don't hammer Spotify. */
function json(body: unknown, status: number, sMaxAge: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, s-maxage=${sMaxAge}, stale-while-revalidate=${sMaxAge * 2}`,
    },
  });
}

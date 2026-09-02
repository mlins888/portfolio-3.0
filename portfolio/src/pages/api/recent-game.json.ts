import type { APIRoute } from "astro";

import { getRecentGame } from "../../lib/steam";

// On-demand (Vercel serverless), same as the Spotify endpoint.
export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const game = await getRecentGame();
    return json({ game }, 300);
  } catch (err) {
    console.error("[recent-game]", err);
    return json({ game: null, error: "unavailable" }, 60);
  }
};

function json(body: unknown, sMaxAge: number) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, s-maxage=${sMaxAge}, stale-while-revalidate=${sMaxAge * 2}`,
    },
  });
}

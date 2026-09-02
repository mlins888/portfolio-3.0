/**
 * Server-only Spotify helper. Reads "recently played" (with a "now playing"
 * check first) for a single account — mine — using the refresh-token grant.
 *
 * The OAuth consent flow runs ONCE, by hand, via `node scripts/spotify-refresh-token.mjs`.
 * That yields a long-lived refresh token which we trade for a short-lived
 * access token on each request. Nothing here is exposed to the browser: this
 * module is only imported by the /api/now-playing.json endpoint.
 *
 * Required env vars (set locally in .env, and in the Vercel project settings):
 *   SPOTIFY_CLIENT_ID
 *   SPOTIFY_CLIENT_SECRET
 *   SPOTIFY_REFRESH_TOKEN
 */

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

export interface NowPlaying {
  /** true = playing right now; false = this is the last thing I finished. */
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  /** Largest album-art image URL, or null if Spotify returned none. */
  albumImageUrl: string | null;
  /** Public Spotify URL for the track. */
  songUrl: string;
  /** Only present when isPlaying is false. */
  playedAt?: string;
}

/**
 * Reads an env var from either source: `import.meta.env` picks up `.env`
 * during local dev, while `process.env` is where Vercel injects the values
 * configured in the project settings at runtime.
 */
function env(key: string): string | undefined {
  const fromMeta = (import.meta.env as Record<string, string | undefined>)[key];
  return fromMeta ?? process.env[key];
}

function credentials() {
  const clientId = env("SPOTIFY_CLIENT_ID");
  const clientSecret = env("SPOTIFY_CLIENT_SECRET");
  const refreshToken = env("SPOTIFY_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing Spotify env vars (SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET / SPOTIFY_REFRESH_TOKEN)",
    );
  }
  return { clientId, clientSecret, refreshToken };
}

async function getAccessToken(): Promise<string> {
  const { clientId, clientSecret, refreshToken } = credentials();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    throw new Error(`Spotify token request failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string; width: number }[] };
  external_urls: { spotify: string };
}

function shape(track: SpotifyTrack, extra: Partial<NowPlaying>): NowPlaying {
  const images = [...(track.album?.images ?? [])].sort(
    (a, b) => (b.width ?? 0) - (a.width ?? 0),
  );
  return {
    isPlaying: false,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album?.name ?? "",
    albumImageUrl: images[0]?.url ?? null,
    songUrl: track.external_urls.spotify,
    ...extra,
  };
}

/**
 * Returns the currently-playing track, or the most recently played one as a
 * fallback. Returns null only if the account has no listening history at all.
 */
export async function getNowPlaying(): Promise<NowPlaying | null> {
  const token = await getAccessToken();
  const auth = { Authorization: `Bearer ${token}` };

  // 1. Is something playing right now?
  const current = await fetch(NOW_PLAYING_ENDPOINT, { headers: auth });
  if (current.status === 200) {
    const data = (await current.json()) as {
      is_playing: boolean;
      item: SpotifyTrack | null;
    };
    // `item` is null for podcast episodes / local files / private sessions.
    if (data.item) {
      return shape(data.item, { isPlaying: data.is_playing });
    }
  }

  // 2. Otherwise, the last track played.
  const recent = await fetch(RECENTLY_PLAYED_ENDPOINT, { headers: auth });
  if (!recent.ok) {
    throw new Error(`Spotify recently-played failed: ${recent.status}`);
  }
  const data = (await recent.json()) as {
    items: { track: SpotifyTrack; played_at: string }[];
  };
  const latest = data.items[0];
  if (!latest) return null;

  return shape(latest.track, { isPlaying: false, playedAt: latest.played_at });
}

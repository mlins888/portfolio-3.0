/**
 * Server-only Steam helper. Returns the game I've played most recently.
 *
 * Two ways in, tried in order:
 *   1. Official Web API — needs STEAM_API_KEY + STEAM_ID (SteamID64).
 *      Uses IPlayerService/GetRecentlyPlayedGames, falls back to the
 *      most-recently-played entry from GetOwnedGames.
 *   2. Public community XML feed — needs only STEAM_ID or STEAM_VANITY, but
 *      the profile's game details must be set to Public. No key required.
 *
 * If nothing is configured (or the profile is private), returns null and the
 * About page just shows the panel art with a "not connected" note.
 *
 * Env vars (local .env + Vercel project settings):
 *   STEAM_API_KEY   optional — https://steamcommunity.com/dev/apikey
 *   STEAM_ID        SteamID64, the 17-digit number
 *   STEAM_VANITY    optional — the custom URL name, if you don't know the ID64
 */

export interface RecentGame {
  appId: number;
  name: string;
  /** Minutes played in the last 2 weeks (0 if only an all-time figure is known). */
  playtimeRecentMin: number;
  /** Minutes played all-time. */
  playtimeTotalMin: number;
  /** Steam store page for the game. */
  storeUrl: string;
  /** Wide cinematic banner (1920x620) — not present for every game. */
  heroImageUrl: string;
  /** Landscape capsule art (460x215) — always present; use as a fallback. */
  headerImageUrl: string;
}

function env(key: string): string | undefined {
  const fromMeta = (import.meta.env as Record<string, string | undefined>)[key];
  return fromMeta ?? process.env[key];
}

const cdn = "https://cdn.cloudflare.steamstatic.com/steam/apps";
const hero = (appId: number) => `${cdn}/${appId}/library_hero.jpg`;
const header = (appId: number) => `${cdn}/${appId}/header.jpg`;
const store = (appId: number) => `https://store.steampowered.com/app/${appId}`;

interface ApiGame {
  appid: number;
  name?: string;
  playtime_2weeks?: number;
  playtime_forever?: number;
  rtime_last_played?: number;
}

async function fromWebApi(key: string, steamId: string): Promise<RecentGame | null> {
  const base = "https://api.steampowered.com/IPlayerService";
  const common = `key=${key}&steamid=${steamId}&format=json`;

  const recent = await fetch(
    `${base}/GetRecentlyPlayedGames/v1/?${common}&count=1`,
  );
  if (recent.ok) {
    const data = (await recent.json()) as {
      response?: { games?: ApiGame[] };
    };
    const g = data.response?.games?.[0];
    if (g) return shapeApi(g);
  }

  // Nothing in the last 2 weeks — fall back to whatever was played last.
  const owned = await fetch(
    `${base}/GetOwnedGames/v1/?${common}&include_appinfo=1&include_played_free_games=1`,
  );
  if (!owned.ok) return null;
  const data = (await owned.json()) as { response?: { games?: ApiGame[] } };
  const games = data.response?.games ?? [];
  const latest = games
    .filter((g) => g.rtime_last_played)
    .sort((a, b) => (b.rtime_last_played ?? 0) - (a.rtime_last_played ?? 0))[0];
  return latest ? shapeApi(latest) : null;
}

function shapeApi(g: ApiGame): RecentGame {
  return {
    appId: g.appid,
    name: g.name ?? `App ${g.appid}`,
    playtimeRecentMin: g.playtime_2weeks ?? 0,
    playtimeTotalMin: g.playtime_forever ?? 0,
    storeUrl: store(g.appid),
    heroImageUrl: hero(g.appid),
    headerImageUrl: header(g.appid),
  };
}

async function fromXmlFeed(idOrVanity: {
  steamId?: string;
  vanity?: string;
}): Promise<RecentGame | null> {
  const path = idOrVanity.steamId
    ? `profiles/${idOrVanity.steamId}`
    : `id/${idOrVanity.vanity}`;
  const res = await fetch(`https://steamcommunity.com/${path}/games?tab=recent&xml=1`);
  if (!res.ok) return null;
  const xml = await res.text();

  // The feed is a stable, flat format; a light parse is enough for one entry.
  const block = xml.match(/<game>([\s\S]*?)<\/game>/)?.[1];
  if (!block) return null;

  const pick = (tag: string) => {
    const raw = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1] ?? "";
    return raw.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
  };

  const appId = Number(pick("appID"));
  if (!appId) return null;

  const hoursToMin = (h: string) => Math.round(parseFloat(h.replace(/,/g, "")) * 60) || 0;
  return {
    appId,
    name: pick("name") || `App ${appId}`,
    playtimeRecentMin: hoursToMin(pick("hoursLast2Weeks")),
    playtimeTotalMin: hoursToMin(pick("hoursOnRecord")),
    storeUrl: store(appId),
    heroImageUrl: hero(appId),
    headerImageUrl: header(appId),
  };
}

export async function getRecentGame(): Promise<RecentGame | null> {
  const key = env("STEAM_API_KEY");
  const steamId = env("STEAM_ID");
  const vanity = env("STEAM_VANITY");

  if (key && steamId) {
    return fromWebApi(key, steamId);
  }
  if (steamId || vanity) {
    return fromXmlFeed({ steamId, vanity });
  }
  return null;
}

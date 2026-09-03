# About page panels

The About page (`src/pages/about.astro`) is a bio column beside a cluster of
four angular comic panels ([`src/components/about/AboutPanels.astro`]). Each
panel shows an illustration; hovering / focusing / tapping it reveals a card:

| Panel | Illustration | Reveal |
| --- | --- | --- |
| top-left | d20 | Static D&D character card — edit `about.dnd` in `src/content/about.ts` |
| top-right | boombox | Spotify: now playing / last played |
| bottom-left | controller | Steam: most recently played game |
| bottom-right | flute | Static "currently practicing" card — edit `about.practicing`; optional Spotify embed of the reference recording |

The cluster is laid out on a fixed canvas that mirrors the Figma frame (1 unit
== 1px in Figma, same trick as the hero — see `src/components/hero/canvas.ts`).
Below 860px it drops the canvas and stacks the panels as plain cards.

## Data flow

Static site + two on-demand endpoints (that's why `astro.config.mjs` has the
Vercel adapter — only `/api/*` runs as a function, every page stays prerendered):

- `src/lib/spotify.ts` → `src/pages/api/now-playing.json.ts`
- `src/lib/steam.ts` → `src/pages/api/recent-game.json.ts`

`AboutPanels.astro`'s inline script fetches both on mount and fills the cards
while they're still hidden. If an endpoint returns nothing (not configured,
profile private, nothing playing) the card shows a muted fallback and the page
is otherwise unaffected.

## Spotify setup (one-time)

1. Create an app at <https://developer.spotify.com/dashboard>.
2. Add the Redirect URI exactly: `http://127.0.0.1:8888/callback`
3. Copy the Client ID and Client Secret.
4. Get a refresh token:

   ```bash
   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-refresh-token.mjs
   ```

   Approve in the browser; it prints `SPOTIFY_REFRESH_TOKEN=...`.
5. Put all three in `.env` (copy `.env.example`) and in Vercel → Settings →
   Environment Variables. The refresh token doesn't expire unless revoked.

Scopes used: `user-read-currently-playing`, `user-read-recently-played`.

## Steam setup

Two options — the code tries the API first, then the keyless feed:

- **With an API key** (<https://steamcommunity.com/dev/apikey>): set
  `STEAM_API_KEY` and `STEAM_ID` (your SteamID64, the 17-digit number —
  <https://steamid.io> if you don't know it). Uses
  `GetRecentlyPlayedGames`, falling back to the most-recently-played entry
  from `GetOwnedGames`.
- **Without a key**: set `STEAM_ID` (or `STEAM_VANITY`, your custom URL name)
  and set the profile's **Game details** to Public. The public
  `.../games?tab=recent&xml=1` feed is parsed instead. Only shows something if
  you've played in the last ~2 weeks.

## Local testing

`npm run dev` serves the endpoints too:

- <http://localhost:4321/api/now-playing.json>
- <http://localhost:4321/api/recent-game.json>

Restart the dev server after editing `.env` — env vars load at boot.

## "Currently practicing" panel

Static config in `about.practicing` (`src/content/about.ts`): `instrument`,
`piece`, `composer`, `ensemble`, `note`. The `spotifyEmbed` field embeds a
reference recording as a Spotify player — paste the tail of a share link
(`open.spotify.com/track/ABC` → `"track/ABC"`, also `album/…` / `playlist/…`);
leave `""` for no player. The iframe is lazy — its `src` is only set the first
time the panel is revealed.

## Assets

Panel art lives in `src/assets/about/`. The three illustrations
(`illo-*.png`) were sliced from a single Figma export; the panel shapes are
inline SVG paths in the component. The portrait is `portrait.jpg`
(the older `src/assets/illustrations/about-portrait.jpg` is now unused).

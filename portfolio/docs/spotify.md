# Spotify "now playing" widget

The About page shows the track I'm currently playing on Spotify, or the last
one I finished. It's a client-side widget backed by a small serverless
function so the Spotify credentials never reach the browser.

## Pieces

| File | Role |
| --- | --- |
| `src/lib/spotify.ts` | Server-only: refresh-token → access-token → track. |
| `src/pages/api/now-playing.json.ts` | On-demand endpoint (`prerender = false`), cached ~60s. |
| `src/components/NowPlaying.astro` | Hidden markup + fetch script + styles. |
| `scripts/spotify-refresh-token.mjs` | One-time OAuth helper to get the refresh token. |

The rest of the site is still statically prerendered — only `/api/*` runs as a
Vercel function (that's why `astro.config.mjs` has the Vercel adapter).

## One-time setup

1. Create an app at <https://developer.spotify.com/dashboard>.
2. In the app settings, add this Redirect URI exactly:
   `http://127.0.0.1:8888/callback`
3. Copy the Client ID and Client Secret.
4. Get a refresh token:

   ```bash
   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-refresh-token.mjs
   ```

   Approve in the browser; the script prints `SPOTIFY_REFRESH_TOKEN=...`.
5. Put all three values in `.env` (copy `.env.example`) for local dev, **and**
   in the Vercel project → Settings → Environment Variables for production.

The refresh token doesn't expire unless the app's access is revoked.

## Local testing

`npm run dev` serves the endpoint too. Hit
<http://localhost:4321/api/now-playing.json> directly to see the raw payload.

## Notes

- Scopes used: `user-read-currently-playing`, `user-read-recently-played`.
- If the token env vars are missing, the endpoint returns `{ track: null }` and
  the widget simply stays hidden — no build or runtime error.

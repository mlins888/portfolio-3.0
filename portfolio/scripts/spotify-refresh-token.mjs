/**
 * One-time helper: run the Spotify OAuth consent flow locally and print a
 * refresh token you can paste into .env (and the Vercel project settings).
 *
 * Prereqs:
 *   1. Create an app at https://developer.spotify.com/dashboard
 *   2. In its settings, add this exact Redirect URI:
 *        http://127.0.0.1:8888/callback
 *   3. Export the client credentials, then run this script:
 *        SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-refresh-token.mjs
 *
 * It opens your browser, you click "Agree", and the token is printed here.
 * The refresh token does not expire unless you revoke the app's access.
 */

import http from "node:http";
import { exec } from "node:child_process";

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPE = "user-read-currently-playing user-read-recently-played";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    "Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in the environment first.",
  );
  process.exit(1);
}

const state = Math.random().toString(36).slice(2);
const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: SCOPE,
    redirect_uri: REDIRECT_URI,
    state,
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }

  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");

  if (!code || returnedState !== state) {
    res.writeHead(400).end("State mismatch or missing code. Try again.");
    server.close();
    return;
  }

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = await tokenRes.json();

  if (!tokenRes.ok) {
    res.writeHead(500).end("Token exchange failed. See terminal.");
    console.error(data);
    server.close();
    return;
  }

  res.writeHead(200, { "Content-Type": "text/html" }).end(
    "<h1>Done — you can close this tab.</h1>",
  );

  console.log("\n  SPOTIFY_REFRESH_TOKEN=" + data.refresh_token + "\n");
  console.log("Paste that line into .env and your Vercel project env vars.\n");
  server.close();
});

server.listen(PORT, () => {
  console.log("Opening browser for Spotify consent...\n" + authUrl + "\n");
  const opener =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";
  exec(`${opener} "${authUrl}"`);
});

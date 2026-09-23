/**
 * One-time helper: download the latest few posts from Instagram accounts you
 * admin into src/assets/social/<account>/, so the playground's social board
 * can use them as ordinary local images. Nothing here runs on the live site —
 * re-run it whenever you want to refresh the pictures.
 *
 * Prereqs (per account — token setup steps are in .env.example):
 *   1. The account is a Professional (Business or Creator) account.
 *   2. You generated an access token for it in your Meta app
 *      ("Instagram API with Instagram login" → Generate access tokens).
 *   3. The token is in .env as IG_TOKEN_<NAME>, e.g.
 *        IG_TOKEN_DUKE_DESIGN=IGAA...
 *      <NAME> becomes the folder name (lowercased, _ → -): duke-design.
 *
 * Run:
 *   node --env-file=.env scripts/pull-instagram.mjs                 # every account, 5 posts each
 *   node --env-file=.env scripts/pull-instagram.mjs --count 3       # 3 posts each
 *   node --env-file=.env scripts/pull-instagram.mjs duke-design:5 other-acct:3
 *
 * For each post it saves one image: the photo itself, the first slide of a
 * carousel, or the cover frame of a video/reel. Alongside the images it
 * writes manifest.json (permalink, caption, date) for alt text and links.
 * Tokens are never printed.
 */

import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const API = "https://graph.instagram.com";
const OUT_ROOT = path.resolve("src/assets/social");
const DEFAULT_COUNT = 5;

const args = process.argv.slice(2);
let defaultCount = DEFAULT_COUNT;
/** @type {Map<string, number>} slug → count, when accounts are named explicitly */
const picked = new Map();

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--count") {
    defaultCount = Number(args[++i]);
  } else {
    const [slug, n] = args[i].split(":");
    picked.set(slug, n ? Number(n) : NaN);
  }
}

const accounts = Object.entries(process.env)
  .filter(([key, value]) => key.startsWith("IG_TOKEN_") && value)
  .map(([key, token]) => ({
    slug: key.slice("IG_TOKEN_".length).toLowerCase().replaceAll("_", "-"),
    token,
  }))
  .filter(({ slug }) => picked.size === 0 || picked.has(slug))
  .map((a) => ({ ...a, count: Number.isFinite(picked.get(a.slug)) ? picked.get(a.slug) : defaultCount }));

if (accounts.length === 0) {
  console.error(
    picked.size
      ? `No IG_TOKEN_* in the environment matches: ${[...picked.keys()].join(", ")}`
      : "No IG_TOKEN_* variables found. Add them to .env and run with --env-file=.env.",
  );
  process.exit(1);
}

/** GET a Graph endpoint. The token goes in the query string, so never log `url`. */
async function graph(pathname, token, params = {}) {
  const url = new URL(pathname, API);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  url.searchParams.set("access_token", token);
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) {
    const msg = body.error?.message ?? `HTTP ${res.status}`;
    throw new Error(`${pathname}: ${msg}`);
  }
  return body;
}

/** The single image that best represents a post. */
function pickImage(post) {
  if (post.media_type === "CAROUSEL_ALBUM") {
    const first = post.children?.data?.[0];
    if (first) return first.media_type === "VIDEO" ? first.thumbnail_url : first.media_url;
  }
  return post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url;
}

function extensionFor(contentType) {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  return "jpg";
}

let failed = 0;

for (const { slug, token, count } of accounts) {
  try {
    const me = await graph("/me", token, { fields: "username" });
    const media = await graph("/me/media", token, {
      fields:
        "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}",
      limit: count,
    });

    const dir = path.join(OUT_ROOT, slug);
    await mkdir(dir, { recursive: true });
    // Clear the previous pull so removed/reordered posts don't linger.
    for (const file of await readdir(dir)) await rm(path.join(dir, file));

    const manifest = { username: me.username, pulledAt: new Date().toISOString(), posts: [] };
    const posts = (media.data ?? []).slice(0, count);

    for (const [i, post] of posts.entries()) {
      const src = pickImage(post);
      if (!src) {
        console.warn(`  @${me.username}: skipped post ${post.id} (no image available)`);
        continue;
      }
      const res = await fetch(src);
      if (!res.ok) throw new Error(`image download failed for post ${post.id}: HTTP ${res.status}`);
      const file = `${String(i + 1).padStart(2, "0")}.${extensionFor(res.headers.get("content-type"))}`;
      await writeFile(path.join(dir, file), Buffer.from(await res.arrayBuffer()));
      manifest.posts.push({
        file,
        permalink: post.permalink,
        caption: post.caption ?? "",
        timestamp: post.timestamp,
        mediaType: post.media_type,
      });
    }

    await writeFile(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
    console.log(`✓ @${me.username} → src/assets/social/${slug}/ (${manifest.posts.length} images)`);
  } catch (err) {
    failed++;
    console.error(`✗ ${slug}: ${err.message}`);
  }
}

process.exit(failed ? 1 : 0);

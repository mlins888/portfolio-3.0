// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Absolute base for canonical + social-share (og:) URLs. Override with a
  // SITE_URL env var in Vercel if the domain ever changes (e.g. a custom
  // domain); the fallback is the current production URL.
  site: process.env.SITE_URL || "https://makenna-portfolio.vercel.app",

  // Pages stay static by default; only routes that opt out with
  // `export const prerender = false` run on demand (see src/pages/api/).
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()]
  }
});

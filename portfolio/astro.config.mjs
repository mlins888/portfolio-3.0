// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Pages stay static by default; only routes that opt out with
  // `export const prerender = false` run on demand (see src/pages/api/).
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()]
  }
});

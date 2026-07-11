// @ts-check
import {defineConfig} from 'astro/config';

import svelte from '@astrojs/svelte';

import partytown from '@astrojs/partytown';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://draftperfect.therockyt.com/',
  integrations: [svelte(), partytown(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});
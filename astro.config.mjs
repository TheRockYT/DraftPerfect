// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), partytown()]
});
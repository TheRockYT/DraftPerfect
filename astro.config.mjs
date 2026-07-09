// @ts-check
import {defineConfig} from 'astro/config';

import svelte from '@astrojs/svelte';

import partytown from '@astrojs/partytown';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://perfectdraft.therockyt.com/',
    integrations: [svelte(), partytown(), sitemap()]
});
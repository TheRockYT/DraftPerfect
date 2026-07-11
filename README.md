# DraftPerfect

[![Deploy to GitHub Pages](https://github.com/TheRockYT/DraftPerfect/actions/workflows/deploy.yml/badge.svg)](https://github.com/TheRockYT/DraftPerfect/actions/workflows/deploy.yml)

A distraction-free university essay writing assistant built with [Astro](https://astro.build) and [Svelte](https://svelte.dev). Draft essays with real-time limit tracking, configurable byte encodings (including UTF-16 LE for Korean), and automatic local saves — no account required.

**Live site:** [perfectdraft.therockyt.com](https://perfectdraft.therockyt.com/)

## Features

- **Distraction-free editor** — A clean editor, optimized for long-form drafting.
- **Flexible limits** — Set a maximum by **bytes** or **characters**, with a visual progress bar that turns orange near the limit (90%) and red when exceeded.
- **Encoding support** — Count bytes as **UTF-8** or **UTF-16 LE**. UTF-16 LE uses 2 bytes per BMP character (including Korean Hangul), matching many application portal requirements.
- **Auto-save** — Drafts and settings are debounced and saved to `localStorage` every 2 seconds. Status indicators show *Typing…*, *Saving…*, and *All changes saved locally*.
- **Export & clear** — Download your draft as a `.txt` file or wipe local storage with one click.
- **Accessible UI** — ARIA labels, keyboard focus states, and system light/dark mode via `prefers-color-scheme`.
- **Privacy-first** — All data stays in the browser. Nothing is sent to a server.

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Framework  | Astro 7                           |
| UI         | Svelte 5 (interactive components) |
| Styling    | Tailwind CSS 4                    |
| Language   | TypeScript                        |
| Deployment | Static site (`astro build`)       |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **≥ 22.12.0**

### Install & run

```bash
git clone <repository-url>
cd DraftPerfect
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

For background dev server management (Astro 7):

```bash
astro dev --background   # start in background
astro dev status         # check status
astro dev logs           # view logs
astro dev stop           # stop server
```

### Production build

```bash
npm run build
npm run preview
```

Static output is written to `./dist/`.

## How Limits Work

| Setting      | Description                                                                |
|--------------|----------------------------------------------------------------------------|
| **Maximum**  | Numeric cap (1–100,000). Default: 3,000.                                   |
| **Unit**     | `Bytes` or `Characters` — determines which metric the progress bar tracks. |
| **Encoding** | `UTF-8` or `UTF-16 LE` — affects byte counting and byte-based limits.      |

The counter always displays both character and byte counts. When limiting by characters, encoding still controls how bytes are reported.

Persisted draft shape in `localStorage` (`draftperfect-essay-draft`):

```ts
{
  content: string;
  limitValue: number;
  limitUnit: 'bytes' | 'characters';
  encoding: 'utf-8' | 'utf-16le';
}
```

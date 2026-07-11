<script lang="ts">
  import type { SaveStatus } from '../lib/types';

  interface Props {
    status: SaveStatus;
    onclear: () => void;
    onexport: () => void;
  }

  let { status, onclear, onexport }: Props = $props();

  const statusText = $derived(
    status === 'typing'
      ? 'Typing…'
      : status === 'saving'
        ? 'Saving…'
        : status === 'saved'
          ? 'All changes saved locally'
          : 'Ready',
  );

  const statusIcon = $derived(
    status === 'typing' || status === 'saving' ? 'animate-pulse' : '',
  );
</script>

<div
  class="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"
  role="toolbar"
  aria-label="Draft actions"
>
  <div
    class="flex items-center gap-2 text-sm text-text-muted"
    aria-live="polite"
    aria-atomic="true"
  >
    <span
      class="inline-flex size-2 rounded-full {status === 'saved'
        ? 'bg-success'
        : status === 'saving'
          ? 'bg-warning'
          : 'bg-text-subtle'} {statusIcon}"
      aria-hidden="true"
    ></span>
    <span>{statusText}</span>
  </div>

  <div class="flex flex-wrap gap-2">
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5
        text-sm font-medium text-text-muted transition-colors duration-200
        hover:border-border-strong hover:bg-surface-muted hover:text-text"
      onclick={onexport}
      aria-label="Export draft as text file"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="size-4"
        aria-hidden="true"
      >
        <path
          d="M10.75 11.25a.75.75 0 0 0-1.5 0v3.69L7.28 12.22a.75.75 0 0 0-1.06 1.06l3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 0 0-1.06-1.06l-1.97 1.97V11.25Z"
        />
        <path
          d="M3.5 9.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 15h10.5A2.75 2.75 0 0 0 18 12.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z"
        />
      </svg>
      Export .txt
    </button>

    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5
        text-sm font-medium text-text-muted transition-colors duration-200
        hover:border-danger/40 hover:bg-danger/5 hover:text-danger"
      onclick={onclear}
      aria-label="Clear saved draft from local storage"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="size-4"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.062l.416 6.595a.75.75 0 0 0 1.498.094l-.416-6.595Zm1.878 0a.75.75 0 0 0-1.5.062l.416 6.595a.75.75 0 0 0 1.498.094l-.416-6.595Zm2.456-.062a.75.75 0 0 0-1.498.062l.416 6.595a.75.75 0 0 0 1.498-.062l-.416-6.595Z"
          clip-rule="evenodd"
        />
      </svg>
      Clear draft
    </button>
  </div>
</div>

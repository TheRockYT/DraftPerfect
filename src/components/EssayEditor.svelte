<script lang="ts">
  interface Props {
    value: string;
    oninput: (value: string) => void;
  }

  let { value, oninput }: Props = $props();

  const textareaId = 'essay-draft';
</script>

<div class="flex min-h-0 flex-1 flex-col">
  <header class="mb-4 space-y-1">
    <label for={textareaId} class="block text-lg font-semibold text-text">
      Essay draft
    </label>
    <p class="text-sm text-text-muted">
      Write freely — your draft is saved automatically to this browser.
    </p>
  </header>

  <textarea
    id={textareaId}
    class="min-h-[min(60vh,32rem)] w-full flex-1 resize-y rounded-xl border border-border bg-surface-raised
      px-4 py-3 text-base leading-relaxed text-text shadow-sm
      transition-colors duration-200 placeholder:text-text-subtle
      focus:border-accent focus:ring-2 focus:ring-accent/20"
    placeholder="Start writing your essay here…"
    {value}
    oninput={(e) => oninput(e.currentTarget.value)}
    aria-describedby="{textareaId}-hint"
    spellcheck="true"
  ></textarea>

  <p id="{textareaId}-hint" class="sr-only">
    Essay draft editor. Changes are saved automatically to your browser.
  </p>
</div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>

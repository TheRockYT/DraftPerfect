<script lang="ts">
  import { onMount } from 'svelte';
  import ByteCounter from './ByteCounter.svelte';
  import EssayEditor from './EssayEditor.svelte';
  import LimitSettings from './LimitSettings.svelte';
  import SaveIndicator from './SaveIndicator.svelte';
  import { SAVE_DEBOUNCE_MS } from '../lib/constants';
  import {
    clampLimitValue,
    clearDraft,
    loadDraft,
    saveDraft,
  } from '../lib/storage';
  import type { EssayDraft, LimitUnit, SaveStatus, TextEncoding } from '../lib/types';

  let draft = $state<EssayDraft>({
    content: '',
    limitValue: 3000,
    limitUnit: 'bytes',
    encoding: 'utf-8',
  });

  let saveStatus = $state<SaveStatus>('idle');
  let saveTimer: ReturnType<typeof setTimeout> | undefined;
  let mounted = $state(false);

  onMount(() => {
    draft = loadDraft();
    saveStatus = 'saved';
    mounted = true;

    return () => {
      if (saveTimer) clearTimeout(saveTimer);
    };
  });

  function scheduleSave() {
    saveStatus = 'typing';
    if (saveTimer) clearTimeout(saveTimer);

    saveTimer = setTimeout(() => {
      saveStatus = 'saving';
      saveDraft(draft);
      saveStatus = 'saved';
    }, SAVE_DEBOUNCE_MS);
  }

  function persistNow() {
    if (saveTimer) clearTimeout(saveTimer);
    saveStatus = 'saving';
    saveDraft(draft);
    saveStatus = 'saved';
  }

  function handleInput(value: string) {
    draft = { ...draft, content: value };
    if (mounted) scheduleSave();
  }

  function handleLimitValueChange(value: number) {
    draft = { ...draft, limitValue: clampLimitValue(value) };
    if (mounted) persistNow();
  }

  function handleLimitUnitChange(unit: LimitUnit) {
    draft = { ...draft, limitUnit: unit };
    if (mounted) persistNow();
  }

  function handleEncodingChange(encoding: TextEncoding) {
    draft = { ...draft, encoding };
    if (mounted) persistNow();
  }

  function handleClear() {
    if (!confirm('Clear your draft and settings from local storage? This cannot be undone.')) {
      return;
    }

    if (saveTimer) clearTimeout(saveTimer);
    clearDraft();
    draft = loadDraft();
    saveStatus = 'saved';
  }

  function handleExport() {
    const blob = new Blob([draft.content || ''], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `essay-draft-${new Date().toISOString().slice(0, 10)}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
</script>

<div class="mx-auto w-full max-w-4xl">
  <div class="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
    <EssayEditor value={draft.content} oninput={handleInput} />

    <div class="mt-6 space-y-4">
      <LimitSettings
        limitValue={draft.limitValue}
        limitUnit={draft.limitUnit}
        encoding={draft.encoding}
        onlimitvaluechange={handleLimitValueChange}
        onlimitunitchange={handleLimitUnitChange}
        onencodingchange={handleEncodingChange}
      />
      <ByteCounter
        text={draft.content}
        limitValue={draft.limitValue}
        limitUnit={draft.limitUnit}
        encoding={draft.encoding}
      />
    </div>

    <SaveIndicator status={saveStatus} onclear={handleClear} onexport={handleExport} />
  </div>
</div>

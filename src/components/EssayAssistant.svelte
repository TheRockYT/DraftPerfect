<script lang="ts">
  import { onMount } from 'svelte';
  import ByteCounter from './ByteCounter.svelte';
  import EssayEditor from './EssayEditor.svelte';
  import LimitSettings from './LimitSettings.svelte';
  import SaveIndicator from './SaveIndicator.svelte';
  import {
    SAVE_DEBOUNCE_MS,
    DEFAULT_LIMIT_VALUE,
    DEFAULT_LIMIT_UNIT,
    DEFAULT_ENCODING,
  } from '../lib/constants';
  import {
    clampLimitValue,
    loadAllDrafts,
    saveAllDrafts,
  } from '../lib/storage';
  import type { EssayDraft, LimitUnit, SaveStatus, TextEncoding } from '../lib/types';

  let drafts = $state<EssayDraft[]>([]);
  let activeDraftId = $state<string | null>(null);
  let editingDraftId = $state<string | null>(null);
  let saveStatus = $state<SaveStatus>('idle');
  let saveTimer: ReturnType<typeof setTimeout> | undefined;
  let mounted = $state(false);

  // Derived state
  let activeDraft = $derived(drafts.find(d => d.id === activeDraftId));

  onMount(() => {
    drafts = loadAllDrafts();
    if (drafts.length > 0) {
      activeDraftId = drafts[0].id;
    } else {
      createNewDraft();
    }
    saveStatus = 'saved';
    mounted = true;

    return () => {
      if (saveTimer) clearTimeout(saveTimer);
    };
  });

  function createNewDraft() {
    const newDraft: EssayDraft = {
      id: crypto.randomUUID(),
      title: 'New Draft',
      content: '',
      limitValue: DEFAULT_LIMIT_VALUE,
      limitUnit: DEFAULT_LIMIT_UNIT,
      encoding: DEFAULT_ENCODING,
      updatedAt: Date.now(),
    };
    drafts = [newDraft, ...drafts];
    activeDraftId = newDraft.id;
    saveAllDrafts(drafts);
  }

  function deleteDraft(event: MouseEvent, id: string) {
    event.stopPropagation();
    if (!confirm('Are you sure you want to delete this draft?')) return;
    drafts = drafts.filter(d => d.id !== id);
    if (activeDraftId === id) {
      activeDraftId = drafts.length > 0 ? drafts[0].id : null;
      if (!activeDraftId) createNewDraft();
    }
    saveAllDrafts(drafts);
  }

  function scheduleSave() {
    if (!activeDraft) return;
    saveStatus = 'typing';
    if (saveTimer) clearTimeout(saveTimer);

    saveTimer = setTimeout(() => {
      saveStatus = 'saving';
      activeDraft!.updatedAt = Date.now();
      saveAllDrafts(drafts);
      saveStatus = 'saved';
    }, SAVE_DEBOUNCE_MS);
  }

  function persistNow() {
    if (!activeDraft) return;
    if (saveTimer) clearTimeout(saveTimer);
    saveStatus = 'saving';
    activeDraft.updatedAt = Date.now();
    saveAllDrafts(drafts);
    saveStatus = 'saved';
  }

  function handleInput(value: string) {
    if (!activeDraft) return;
    activeDraft.content = value;
    activeDraft.title = value.slice(0, 20) || 'New Draft';
    if (mounted) scheduleSave();
  }

  function handleLimitValueChange(value: number) {
    if (!activeDraft) return;
    activeDraft.limitValue = clampLimitValue(value);
    if (mounted) persistNow();
  }

  function handleLimitUnitChange(unit: LimitUnit) {
    if (!activeDraft) return;
    activeDraft.limitUnit = unit;
    if (mounted) persistNow();
  }

  function handleEncodingChange(encoding: TextEncoding) {
    if (!activeDraft) return;
    activeDraft.encoding = encoding;
    if (mounted) persistNow();
  }

  function handleExport() {
    if (!activeDraft) return;
    const blob = new Blob([activeDraft.content || ''], {
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

<div class="mx-auto w-full max-w-6xl p-4 flex flex-col md:flex-row gap-6">
  <div class="md:w-1/4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
    <h2 class="text-lg font-semibold mb-4 text-text">Drafts</h2>
    <button
      onclick={createNewDraft}
      class="w-full mb-4 px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
    >
      + New Draft
    </button>
    <ul class="space-y-2">
      {#each drafts as draft (draft.id)}
        <li
          class:bg-accent-muted={activeDraftId === draft.id}
          class="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-border/20 transition-colors"
          onclick={() => activeDraftId = draft.id}
        >
          {#if editingDraftId === draft.id}
            <input
              type="text"
              value={draft.title}
              class="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-text"
              onblur={() => {
                if (!draft.title.trim()) {
                  draft.title = draft.content.slice(0, 20) || 'New Draft';
                }
                editingDraftId = null;
                saveAllDrafts(drafts);
              }}
              onkeydown={(e) => {
                if (e.key === 'Enter') {
                    if (!draft.title.trim()) {
                        draft.title = draft.content.slice(0, 20) || 'New Draft';
                    }
                    editingDraftId = null;
                    saveAllDrafts(drafts);
                }
              }}
              oninput={(e) => {
                 const target = e.target as HTMLInputElement;
                 draft.title = target.value;
              }}
              onclick={(e) => e.stopPropagation()}
            />
          {:else}
            <span
              class="truncate text-sm font-medium text-text"
              ondblclick={() => editingDraftId = draft.id}
            >
                {draft.title}
            </span>
          {/if}
          <button
            onclick={(e) => deleteDraft(e, draft.id)}
            class="text-text-muted hover:text-red-500 transition-colors"
            aria-label="Delete draft"
          >
            ✕
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <div class="md:w-3/4">
    {#if activeDraft}
      {@const draft = activeDraft}
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

        <SaveIndicator status={saveStatus} onclear={() => deleteDraft(new MouseEvent('click'), draft.id)} onexport={handleExport} />
      </div>
    {/if}
  </div>
</div>

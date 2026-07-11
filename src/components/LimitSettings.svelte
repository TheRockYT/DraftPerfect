<script lang="ts">
  import {
    ENCODING_OPTIONS,
    LIMIT_UNIT_OPTIONS,
    MAX_LIMIT_VALUE,
    MIN_LIMIT_VALUE,
  } from '../lib/constants';
  import type { LimitUnit, TextEncoding } from '../lib/types';

  interface Props {
    limitValue: number;
    limitUnit: LimitUnit;
    encoding: TextEncoding;
    onlimitvaluechange: (value: number) => void;
    onlimitunitchange: (unit: LimitUnit) => void;
    onencodingchange: (encoding: TextEncoding) => void;
  }

  let {
    limitValue,
    limitUnit,
    encoding,
    onlimitvaluechange,
    onlimitunitchange,
    onencodingchange,
  }: Props = $props();

  const activeEncoding = $derived(
    ENCODING_OPTIONS.find((option) => option.value === encoding) ?? ENCODING_OPTIONS[0],
  );

  function handleLimitInput(e: Event) {
    const value = Number((e.currentTarget as HTMLInputElement).value);
    if (!Number.isNaN(value)) onlimitvaluechange(value);
  }

  function handleUnitChange(e: Event) {
    const value = (e.currentTarget as HTMLSelectElement).value as LimitUnit;
    onlimitunitchange(value);
  }

  function handleEncodingChange(e: Event) {
    const value = (e.currentTarget as HTMLSelectElement).value as TextEncoding;
    onencodingchange(value);
  }
</script>

<fieldset
  class="rounded-xl border border-border bg-surface-raised/50 p-4"
  aria-label="Limit settings"
>
  <legend class="px-1 text-sm font-medium text-text">Limit</legend>

  <div class="mt-2 space-y-4">
    <div>
      <label for="limit-value" class="mb-1.5 block text-xs font-medium text-text-muted">
        Maximum
      </label>
      <div class="flex gap-2">
        <input
          id="limit-value"
          type="number"
          class="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text
            transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
          min={MIN_LIMIT_VALUE}
          max={MAX_LIMIT_VALUE}
          step={limitUnit === 'bytes' ? 100 : 1}
          value={limitValue}
          oninput={handleLimitInput}
          aria-describedby="limit-value-hint"
        />
        <select
          id="limit-unit"
          class="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text
            transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
          value={limitUnit}
          onchange={handleUnitChange}
          aria-label="Limit unit"
        >
          {#each LIMIT_UNIT_OPTIONS as option (option.value)}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
      <p id="limit-value-hint" class="mt-1 text-xs text-text-subtle">
        {MIN_LIMIT_VALUE.toLocaleString()}–{MAX_LIMIT_VALUE.toLocaleString()}
        {limitUnit === 'bytes' ? 'bytes' : 'characters'}
      </p>
    </div>

    <div>
      <label for="encoding" class="mb-1.5 block text-xs font-medium text-text-muted">
        Byte encoding
        {#if limitUnit === 'characters'}
          <span class="font-normal text-text-subtle">(for byte count display)</span>
        {/if}
      </label>
      <select
        id="encoding"
        class="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text
          transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
        value={encoding}
        onchange={handleEncodingChange}
        aria-describedby="encoding-hint"
      >
        {#each ENCODING_OPTIONS as option (option.value)}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
      <p id="encoding-hint" class="mt-1 text-xs text-text-subtle">
        {activeEncoding.description}
      </p>
    </div>
  </div>
</fieldset>

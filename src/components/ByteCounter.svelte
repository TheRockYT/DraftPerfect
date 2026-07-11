<script lang="ts">
  import {
    getEncodedByteLength,
    getEncodingLabel,
    getLimitStatus,
    getMeasuredValue,
    getProgressPercent,
  } from '../lib/byte-utils';
  import type { LimitUnit, TextEncoding } from '../lib/types';

  interface Props {
    text: string;
    limitValue: number;
    limitUnit: LimitUnit;
    encoding: TextEncoding;
  }

  let { text, limitValue, limitUnit, encoding }: Props = $props();

  const charCount = $derived(text.length);
  const byteLength = $derived(getEncodedByteLength(text, encoding));
  const measured = $derived(getMeasuredValue(text, limitUnit, encoding));
  const status = $derived(getLimitStatus(measured, limitValue));
  const progress = $derived(getProgressPercent(measured, limitValue));

  const barColor = $derived(
    status === 'over'
      ? 'bg-progress-over'
      : status === 'near'
        ? 'bg-progress-near'
        : 'bg-progress-safe',
  );

  const statusLabel = $derived(
    status === 'over'
      ? 'Over limit'
      : status === 'near'
        ? 'Approaching limit'
        : 'Within limit',
  );

  const primaryLabel = $derived(limitUnit === 'bytes' ? 'bytes' : 'characters');
  const encodingLabel = $derived(getEncodingLabel(encoding));
</script>

<div
  class="space-y-3"
  role="region"
  aria-label="Usage counter"
>
  <div class="flex flex-wrap items-end justify-between gap-3">
    <div class="flex flex-wrap gap-x-5 gap-y-1 text-sm">
      <p class="text-text-muted">
        <span
          class="font-medium tabular-nums {limitUnit === 'characters' && status !== 'safe'
            ? status === 'over'
              ? 'text-danger'
              : 'text-warning'
            : 'text-text'}"
        >
          {charCount.toLocaleString()}
        </span>
        {#if limitUnit === 'characters'}
          / {limitValue.toLocaleString()} characters
        {:else}
          characters
        {/if}
      </p>
      <p class="text-text-muted">
        <span
          class="font-medium tabular-nums {limitUnit === 'bytes' && status !== 'safe'
            ? status === 'over'
              ? 'text-danger'
              : 'text-warning'
            : 'text-text'}"
        >
          {byteLength.toLocaleString()}
        </span>
        {#if limitUnit === 'bytes'}
          / {limitValue.toLocaleString()} bytes ({encodingLabel})
        {:else}
          bytes ({encodingLabel})
        {/if}
      </p>
    </div>

    <span
      class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-300
        {status === 'over'
        ? 'bg-danger/10 text-danger'
        : status === 'near'
          ? 'bg-warning/10 text-warning'
          : 'bg-progress-safe/10 text-progress-safe'}"
      aria-live="polite"
    >
      <span class="size-1.5 rounded-full {barColor}" aria-hidden="true"></span>
      {statusLabel}
    </span>
  </div>

  <div
    class="h-2 w-full overflow-hidden rounded-full bg-surface-muted"
    role="progressbar"
    aria-valuenow={measured}
    aria-valuemin={0}
    aria-valuemax={limitValue}
    aria-label="Progress toward {limitValue.toLocaleString()} {primaryLabel} limit"
  >
    <div
      class="h-full rounded-full transition-all duration-300 ease-out {barColor}"
      style="width: {progress}%"
    ></div>
  </div>
</div>

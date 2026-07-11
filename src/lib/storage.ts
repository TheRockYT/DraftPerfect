import {
  DEFAULT_ENCODING,
  DEFAULT_LIMIT_UNIT,
  DEFAULT_LIMIT_VALUE,
  MAX_LIMIT_VALUE,
  MIN_LIMIT_VALUE,
  STORAGE_KEY,
} from './constants';
import type { EssayDraft, LimitUnit, TextEncoding } from './types';

const DEFAULT_DRAFT: EssayDraft = {
  content: '',
  limitValue: DEFAULT_LIMIT_VALUE,
  limitUnit: DEFAULT_LIMIT_UNIT,
  encoding: DEFAULT_ENCODING,
};

/** Clamps a limit value to valid bounds. */
export function clampLimitValue(value: number): number {
  return Math.min(MAX_LIMIT_VALUE, Math.max(MIN_LIMIT_VALUE, value));
}

function isLimitUnit(value: unknown): value is LimitUnit {
  return value === 'bytes' || value === 'characters';
}

function isEncoding(value: unknown): value is TextEncoding {
  return value === 'utf-8' || value === 'utf-16le';
}

/** Loads the essay draft from localStorage, falling back to defaults. */
export function loadDraft(): EssayDraft {
  if (typeof window === 'undefined') return { ...DEFAULT_DRAFT };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DRAFT };

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return normalizeDraft(parsed);
  } catch {
    return { ...DEFAULT_DRAFT };
  }
}

/** Persists the essay draft to localStorage. */
export function saveDraft(draft: EssayDraft): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

/** Removes the stored draft from localStorage. */
export function clearDraft(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function normalizeDraft(parsed: Record<string, unknown>): EssayDraft {
  // Migrate legacy multi-section format
  if ('personalStatement' in parsed || 'studyPlan' in parsed) {
    const parts = [
      typeof parsed.personalStatement === 'string' ? parsed.personalStatement : '',
      typeof parsed.studyPlan === 'string' ? parsed.studyPlan : '',
    ].filter(Boolean);

    return {
      ...DEFAULT_DRAFT,
      content: parts.join('\n\n'),
    };
  }

  // Migrate separate byteLimit / charLimit format
  if ('byteLimit' in parsed || 'charLimit' in parsed) {
    const charLimit = typeof parsed.charLimit === 'number' ? parsed.charLimit : 0;
    const byteLimit =
      typeof parsed.byteLimit === 'number' ? parsed.byteLimit : DEFAULT_LIMIT_VALUE;

    return {
      content: typeof parsed.content === 'string' ? parsed.content : DEFAULT_DRAFT.content,
      limitValue: charLimit > 0 ? clampLimitValue(charLimit) : clampLimitValue(byteLimit),
      limitUnit: charLimit > 0 ? 'characters' : 'bytes',
      encoding: DEFAULT_ENCODING,
    };
  }

  return {
    content: typeof parsed.content === 'string' ? parsed.content : DEFAULT_DRAFT.content,
    limitValue:
      typeof parsed.limitValue === 'number'
        ? clampLimitValue(parsed.limitValue)
        : DEFAULT_DRAFT.limitValue,
    limitUnit: isLimitUnit(parsed.limitUnit) ? parsed.limitUnit : DEFAULT_DRAFT.limitUnit,
    encoding: isEncoding(parsed.encoding) ? parsed.encoding : DEFAULT_DRAFT.encoding,
  };
}

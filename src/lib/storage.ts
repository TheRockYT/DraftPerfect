import {
  DEFAULT_ENCODING,
  DEFAULT_LIMIT_UNIT,
  DEFAULT_LIMIT_VALUE,
  MAX_LIMIT_VALUE,
  MIN_LIMIT_VALUE,
  STORAGE_KEY,
  STORAGE_KEY_LIST,
} from './constants';
import type { EssayDraft, LimitUnit, TextEncoding } from './types';

const DEFAULT_DRAFT_CONTENT = {
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

/** Loads all essay drafts, migrating legacy ones if necessary. */
export function loadAllDrafts(): EssayDraft[] {
  if (typeof window === 'undefined') return [];

  try {
    const rawList = localStorage.getItem(STORAGE_KEY_LIST);
    if (rawList) {
      return JSON.parse(rawList) as EssayDraft[];
    }

    // Migration
    const legacyRaw = localStorage.getItem(STORAGE_KEY);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw) as Record<string, unknown>;
      const legacyDraft = normalizeDraft(parsed);
      const migrated: EssayDraft = {
        ...legacyDraft,
        id: crypto.randomUUID(),
        title: 'Untitled Draft',
        updatedAt: Date.now(),
      };
      saveAllDrafts([migrated]);
      localStorage.removeItem(STORAGE_KEY);
      return [migrated];
    }
  } catch (e) {
    console.error('Failed to load drafts', e);
  }
  return [];
}

/** Persists all essay drafts to localStorage. */
export function saveAllDrafts(drafts: EssayDraft[]): void {
  localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(drafts));
}

function normalizeDraft(parsed: Record<string, unknown>): Omit<EssayDraft, 'id' | 'title' | 'updatedAt'> {
  // Migrate legacy multi-section format
  if ('personalStatement' in parsed || 'studyPlan' in parsed) {
    const parts = [
      typeof parsed.personalStatement === 'string' ? parsed.personalStatement : '',
      typeof parsed.studyPlan === 'string' ? parsed.studyPlan : '',
    ].filter(Boolean);

    return {
      ...DEFAULT_DRAFT_CONTENT,
      content: parts.join('\n\n'),
    };
  }

  // Migrate separate byteLimit / charLimit format
  if ('byteLimit' in parsed || 'charLimit' in parsed) {
    const charLimit = typeof parsed.charLimit === 'number' ? parsed.charLimit : 0;
    const byteLimit =
      typeof parsed.byteLimit === 'number' ? parsed.byteLimit : DEFAULT_LIMIT_VALUE;

    return {
      content: typeof parsed.content === 'string' ? parsed.content : DEFAULT_DRAFT_CONTENT.content,
      limitValue: charLimit > 0 ? clampLimitValue(charLimit) : clampLimitValue(byteLimit),
      limitUnit: charLimit > 0 ? 'characters' : 'bytes',
      encoding: DEFAULT_ENCODING,
    };
  }

  return {
    content: typeof parsed.content === 'string' ? parsed.content : DEFAULT_DRAFT_CONTENT.content,
    limitValue:
      typeof parsed.limitValue === 'number'
        ? clampLimitValue(parsed.limitValue)
        : DEFAULT_DRAFT_CONTENT.limitValue,
    limitUnit: isLimitUnit(parsed.limitUnit) ? parsed.limitUnit : DEFAULT_DRAFT_CONTENT.limitUnit,
    encoding: isEncoding(parsed.encoding) ? parsed.encoding : DEFAULT_DRAFT_CONTENT.encoding,
  };
}

import type { LimitUnit, TextEncoding } from './types';

export const STORAGE_KEY = 'draftperfect-essay-draft';
export const DEFAULT_LIMIT_VALUE = 3000;
export const DEFAULT_LIMIT_UNIT: LimitUnit = 'bytes';
export const DEFAULT_ENCODING: TextEncoding = 'utf-8';
export const SAVE_DEBOUNCE_MS = 2000;
export const NEAR_LIMIT_THRESHOLD = 0.9;

export const MIN_LIMIT_VALUE = 1;
export const MAX_LIMIT_VALUE = 100_000;

export const LIMIT_UNIT_OPTIONS: { value: LimitUnit; label: string }[] = [
  { value: 'bytes', label: 'Bytes' },
  { value: 'characters', label: 'Characters' },
];

export const ENCODING_OPTIONS: { value: TextEncoding; label: string; description: string }[] = [
  {
    value: 'utf-8',
    label: 'UTF-8',
    description: 'Variable length — ASCII is 1 byte, Korean is typically 3 bytes',
  },
  {
    value: 'utf-16le',
    label: 'UTF-16 LE',
    description: '2 bytes per character — common for Korean application portals',
  },
];

/** Unit used to measure and enforce the limit */
export type LimitUnit = 'bytes' | 'characters';

/** Byte encoding used when counting or limiting by bytes */
export type TextEncoding = 'utf-8' | 'utf-16le';

/** Persisted draft shape stored in localStorage */
export interface EssayDraft {
  content: string;
  limitValue: number;
  limitUnit: LimitUnit;
  encoding: TextEncoding;
}

/** Auto-save lifecycle states shown in the UI */
export type SaveStatus = 'idle' | 'typing' | 'saving' | 'saved';

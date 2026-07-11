import { NEAR_LIMIT_THRESHOLD } from './constants';
import type { LimitUnit, TextEncoding } from './types';

const utf8Encoder = new TextEncoder();

/** Returns the UTF-8 byte length of a string. */
export function getUtf8ByteLength(text: string): number {
  return utf8Encoder.encode(text).length;
}

/**
 * Returns the UTF-16 LE byte length of a string.
 * BMP characters (including Korean Hangul) count as 2 bytes; surrogate pairs count as 4.
 */
export function getUtf16LeByteLength(text: string): number {
  let bytes = 0;

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);

    if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length) {
      const next = text.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        bytes += 4;
        i++;
        continue;
      }
    }

    bytes += 2;
  }

  return bytes;
}

/** Returns byte length for the selected encoding. */
export function getEncodedByteLength(text: string, encoding: TextEncoding): number {
  return encoding === 'utf-16le' ? getUtf16LeByteLength(text) : getUtf8ByteLength(text);
}

/** Human-readable label for the active encoding. */
export function getEncodingLabel(encoding: TextEncoding): string {
  return encoding === 'utf-16le' ? 'UTF-16 LE' : 'UTF-8';
}

/** Returns the measured value for the active limit unit. */
export function getMeasuredValue(
  text: string,
  unit: LimitUnit,
  encoding: TextEncoding,
): number {
  return unit === 'characters' ? text.length : getEncodedByteLength(text, encoding);
}

export type LimitStatus = 'safe' | 'near' | 'over';

/** Determines visual status based on usage relative to a limit. */
export function getLimitStatus(used: number, limit: number): LimitStatus {
  if (limit <= 0) return 'safe';
  if (used > limit) return 'over';
  if (used >= limit * NEAR_LIMIT_THRESHOLD) return 'near';
  return 'safe';
}

/** Progress percentage capped at 100 for the bar width. */
export function getProgressPercent(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min((used / limit) * 100, 100);
}

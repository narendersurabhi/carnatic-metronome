import { AccentLevel, AngaType } from './types';

/**
 * Accent logic for Carnatic hand-counting feel:
 * - First beat of cycle (samam): STRONG
 * - First beat of non-initial anga: MEDIUM
 * - Remaining beats: WEAK
 * - Optional boost for DRUTAM closing beat to MEDIUM for clarity.
 */
export const resolveAccent = (params: {
  cycleBeatIndex: number;
  angaBeatIndex: number;
  angaType: AngaType;
}): AccentLevel => {
  const { cycleBeatIndex, angaBeatIndex, angaType } = params;

  if (cycleBeatIndex === 0) return 'STRONG';
  if (angaBeatIndex === 0) return 'MEDIUM';
  if (angaType === 'DRUTAM' && angaBeatIndex === 1) return 'MEDIUM';
  return 'WEAK';
};

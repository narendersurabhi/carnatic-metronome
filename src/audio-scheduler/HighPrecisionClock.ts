import { Clock } from './types';

/**
 * Monotonic-ish clock for scheduling math. In JS runtimes this is still bounded
 * by event-loop jitter, but isolates scheduler math from UI rendering state.
 */
export class HighPrecisionClock implements Clock {
  nowMs(): number {
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      return performance.now();
    }
    return Date.now();
  }
}

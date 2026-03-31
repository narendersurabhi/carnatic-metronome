export type AnalyticsEventName =
  | 'app_launch'
  | 'play_start'
  | 'play_stop'
  | 'tala_selected'
  | 'jati_selected'
  | 'template_saved'
  | 'template_loaded'
  | 'template_play'
  | 'audio_error';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  payload?: Record<string, unknown>;
  timestamp: string;
}

class ConsoleAnalyticsService {
  track(name: AnalyticsEventName, payload?: Record<string, unknown>): void {
    const event: AnalyticsEvent = {
      name,
      payload,
      timestamp: new Date().toISOString()
    };

    // Lightweight hook for beta; replace with Segment/Amplitude/etc when needed.
    console.info('[analytics]', JSON.stringify(event));
  }
}

export const analytics = new ConsoleAnalyticsService();

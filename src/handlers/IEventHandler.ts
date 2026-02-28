import type { IncomingEvent, RenderEvent } from './types';

/**
 * Handles events for a specific language/framework.
 * Normalizes the incoming payload and returns a RenderEvent for the feed and gutter.
 */
export interface IEventHandler {
  readonly framework: string;

  /**
   * Returns true if this handler supports the given event (e.g. by framework tag or file extension).
   */
  supports(event: IncomingEvent): boolean;

  /**
   * Normalize the incoming event for storage and display (e.g. path format, default kind).
   */
  normalize(event: IncomingEvent): RenderEvent;
}

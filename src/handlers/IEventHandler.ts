/**
 * Event Handler Interface
 *
 * Contract for language/framework-specific event handlers (React, PHP, JavaScript).
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1 [28-02-2026]
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
 */

import type { IncomingEvent, RenderEvent } from './types';

/**
 * Handles events for a specific language/framework.
 * Normalizes the incoming payload and returns a RenderEvent for the feed and gutter.
 */
export interface IEventHandler {
  readonly framework: string;

  /**
   * Returns true if this handler supports the given event (e.g. by framework tag or file extension).
   * @param {IncomingEvent} event - Raw event from WebSocket
   * @returns {boolean}
   * @version 1.1.1
   */
  supports(event: IncomingEvent): boolean;

  /**
   * Normalize the incoming event for storage and display (e.g. path format, default kind).
   * @param {IncomingEvent} event - Raw event from WebSocket
   * @returns {RenderEvent}
   * @version 1.1.1
   */
  normalize(event: IncomingEvent): RenderEvent;
}

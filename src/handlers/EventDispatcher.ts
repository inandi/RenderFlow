/**
 * Event Dispatcher
 *
 * Routes incoming WebSocket events to the correct language handler (React, PHP, JavaScript).
 * First handler that supports the event wins.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1 [28-02-2026]
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
 */

import type { IEventHandler } from './IEventHandler';
import type { IncomingEvent, RenderEvent } from './types';
import { JavaScriptEventHandler } from './JavaScriptEventHandler';
import { PhpEventHandler } from './PhpEventHandler';
import { ReactEventHandler } from './ReactEventHandler';

/**
 * Dispatches incoming events to the appropriate language handler.
 * Order matters: first handler that supports the event wins.
 */
export class EventDispatcher {
  private readonly handlers: IEventHandler[] = [
    new ReactEventHandler(),
    new PhpEventHandler(),
    new JavaScriptEventHandler(),
  ];

  /**
   * Dispatches an incoming event to the first supporting handler and returns the normalized event.
   *
   * @param {IncomingEvent} incoming - Raw event from WebSocket
   * @returns {RenderEvent} Normalized event for feed and gutter
   * @version 1.1.1
   */
  dispatch(incoming: IncomingEvent): RenderEvent {
    for (const handler of this.handlers) {
      if (handler.supports(incoming)) {
        return handler.normalize(incoming);
      }
    }
    return this.defaultNormalize(incoming);
  }

  private defaultNormalize(event: IncomingEvent): RenderEvent {
    return {
      filePath: event.filePath,
      line: event.line,
      column: event.column,
      functionName: event.functionName,
      kind: event.kind ?? 'event',
    };
  }
}

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

import * as path from 'path';
import type { IEventHandler } from './IEventHandler';
import type { IncomingEvent, RenderEvent } from './types';

/**
 * Handles vanilla JavaScript / Node.js events (e.g. framework: 'javascript' or .mjs/.cjs).
 * React handler runs first and claims .js/.ts in React apps; this handles explicit JS or .mjs/.cjs.
 */
export class JavaScriptEventHandler implements IEventHandler {
  readonly framework = 'javascript';

  supports(event: IncomingEvent): boolean {
    if (event.framework === 'javascript' || event.framework === 'js') return true;
    const ext = path.extname(event.filePath).toLowerCase();
    return ['.mjs', '.cjs'].includes(ext);
  }

  normalize(event: IncomingEvent): RenderEvent {
    return {
      filePath: event.filePath,
      line: event.line,
      column: event.column,
      functionName: event.functionName,
      kind: event.kind ?? 'call',
      framework: 'javascript',
    };
  }
}

/**
 * JavaScript Event Handler
 *
 * Handles vanilla JavaScript / Node.js events (framework: 'javascript' or 'js', or .mjs/.cjs).
 * React handler runs first for .js/.ts; this handles explicit JS or .mjs/.cjs.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1 [28-02-2026]
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
 */

import * as path from 'path';
import type { IEventHandler } from './IEventHandler';
import type { IncomingEvent, RenderEvent } from './types';

/**
 * Handles vanilla JavaScript / Node.js events (e.g. framework: 'javascript' or .mjs/.cjs).
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

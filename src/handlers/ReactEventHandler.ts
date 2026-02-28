/**
 * React Event Handler
 *
 * Handles events for React apps (.jsx, .tsx, .js, .ts or framework: 'react').
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1 [28-02-2026]
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
 */

import * as path from 'path';
import type { IEventHandler } from './IEventHandler';
import type { IncomingEvent, RenderEvent } from './types';

export class ReactEventHandler implements IEventHandler {
  readonly framework = 'react';

  supports(event: IncomingEvent): boolean {
    if (event.framework === 'react') return true;
    const ext = path.extname(event.filePath).toLowerCase();
    return ['.jsx', '.tsx', '.js', '.ts'].includes(ext) || !ext;
  }

  normalize(event: IncomingEvent): RenderEvent {
    return {
      filePath: event.filePath,
      line: event.line,
      column: event.column,
      functionName: event.functionName,
      kind: event.kind ?? 'render',
      framework: 'react',
    };
  }
}

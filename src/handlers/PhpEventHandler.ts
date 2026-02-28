/**
 * PHP Event Handler
 *
 * Handles events for PHP (.php or framework: 'php'). Normalizes path and default kind.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1 [28-02-2026]
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
 */

import * as path from 'path';
import type { IEventHandler } from './IEventHandler';
import type { IncomingEvent, RenderEvent } from './types';

export class PhpEventHandler implements IEventHandler {
  readonly framework = 'php';

  supports(event: IncomingEvent): boolean {
    if (event.framework === 'php') return true;
    const ext = path.extname(event.filePath).toLowerCase();
    return ext === '.php';
  }

  normalize(event: IncomingEvent): RenderEvent {
    let filePath = event.filePath;
    if (!filePath.toLowerCase().endsWith('.php')) {
      filePath = filePath + (filePath.includes('.') ? '' : '.php');
    }
    return {
      filePath,
      line: event.line,
      column: event.column,
      functionName: event.functionName,
      kind: event.kind ?? 'call',
      framework: 'php',
    };
  }
}

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

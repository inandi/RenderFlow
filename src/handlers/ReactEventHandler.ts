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

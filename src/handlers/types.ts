/**
 * Shared types for language/framework-specific event handling.
 */

export type Framework = 'react' | 'php' | 'javascript';

/** Incoming payload may send 'js' as shorthand for 'javascript'. */
export interface IncomingEvent {
  filePath: string;
  line: number;
  column?: number;
  functionName?: string;
  kind?: string;
  framework?: Framework | 'js';
}

/**
 * Normalized event stored in the activity feed and used for gutter/UI.
 */
export interface RenderEvent {
  filePath: string;
  line: number;
  column?: number;
  functionName?: string;
  kind?: string;
  framework?: Framework;
}

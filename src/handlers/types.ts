/**
 * Handler Types
 *
 * Shared types for language/framework-specific event handling (React, PHP, JavaScript).
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1 [28-02-2026]
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
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

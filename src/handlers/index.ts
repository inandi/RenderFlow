/**
 * Handlers Index
 *
 * Re-exports event dispatcher, handler interfaces, and language-specific handlers.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1 [28-02-2026]
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
 */

export { EventDispatcher } from './EventDispatcher';
export type { IEventHandler } from './IEventHandler';
export type { Framework, IncomingEvent, RenderEvent } from './types';
export { JavaScriptEventHandler } from './JavaScriptEventHandler';
export { PhpEventHandler } from './PhpEventHandler';
export { ReactEventHandler } from './ReactEventHandler';

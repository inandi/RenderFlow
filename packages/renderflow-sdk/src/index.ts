/**
 * Render Flow SDK – send render/update events to the Render Flow VS Code extension.
 * Use in browser only (connects to ws://127.0.0.1:port).
 */

export {
  connect,
  disconnect,
  sendEvent,
  isConnected,
  type RenderFlowEvent,
} from './core';

export { useRenderFlow, reportRender } from './react';
export type { UseRenderFlowOptions } from './react';

/**
 * Core WebSocket client for Render Flow SDK.
 * Shared by index and react to avoid circular imports.
 */

export interface RenderFlowEvent {
  filePath: string;
  line: number;
  column?: number;
  functionName?: string;
  kind?: string;
}

const DEFAULT_PORT = 8765;

let socket: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let desiredPort: number = DEFAULT_PORT;

export function connect(port: number = DEFAULT_PORT): void {
  if (typeof WebSocket === 'undefined') {
    console.warn('[renderflow-sdk] WebSocket not available (e.g. not in browser).');
    return;
  }
  desiredPort = port;
  if (socket?.readyState === WebSocket.OPEN) {
    return;
  }
  if (socket) {
    socket.close();
    socket = null;
  }
  const url = `ws://127.0.0.1:${port}`;
  try {
    socket = new WebSocket(url);
    socket.onclose = () => {
      socket = null;
      scheduleReconnect();
    };
    socket.onerror = () => {
      // Avoid spamming console; extension might not be running
    };
  } catch {
    scheduleReconnect();
  }
}

function scheduleReconnect(): void {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect(desiredPort);
  }, 3000);
}

export function disconnect(): void {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (socket) {
    socket.close();
    socket = null;
  }
}

export function sendEvent(event: RenderFlowEvent): void {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return;
  }
  const payload = JSON.stringify({
    filePath: event.filePath,
    line: event.line,
    ...(event.column != null && { column: event.column }),
    ...(event.functionName != null && { functionName: event.functionName }),
    ...(event.kind != null && { kind: event.kind }),
  });
  socket.send(payload);
}

export function isConnected(): boolean {
  return socket?.readyState === WebSocket.OPEN;
}

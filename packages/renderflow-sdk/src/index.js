"use strict";
/**
 * Render Flow SDK – send render/update events to the Render Flow VS Code extension.
 * Use in browser only (connects to ws://127.0.0.1:port).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRender = exports.useRenderFlow = void 0;
exports.connect = connect;
exports.disconnect = disconnect;
exports.sendEvent = sendEvent;
exports.isConnected = isConnected;
const DEFAULT_PORT = 8765;
let socket = null;
let reconnectTimer = null;
let desiredPort = DEFAULT_PORT;
/**
 * Connect to the Render Flow extension's WebSocket server.
 * @param port - Port number (default 8765). Must match extension setting `renderflow.port`.
 */
function connect(port = DEFAULT_PORT) {
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
    }
    catch {
        scheduleReconnect();
    }
}
function scheduleReconnect() {
    if (reconnectTimer)
        return;
    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect(desiredPort);
    }, 3000);
}
/**
 * Disconnect from the Render Flow extension.
 */
function disconnect() {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
    if (socket) {
        socket.close();
        socket = null;
    }
}
/**
 * Send a render event to the extension. The extension will show a gutter flash and add the event to the Activity Feed.
 * @param event - At minimum filePath (relative to project root or absolute) and line (1-based).
 */
function sendEvent(event) {
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
/**
 * Returns true if the SDK is connected to the extension.
 */
function isConnected() {
    return socket?.readyState === WebSocket.OPEN;
}
// React integration (optional peer)
var react_1 = require("./react");
Object.defineProperty(exports, "useRenderFlow", { enumerable: true, get: function () { return react_1.useRenderFlow; } });
Object.defineProperty(exports, "reportRender", { enumerable: true, get: function () { return react_1.reportRender; } });
//# sourceMappingURL=index.js.map
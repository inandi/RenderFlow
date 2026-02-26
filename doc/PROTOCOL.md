# Render Flow – WebSocket Protocol

## Overview

The Render Flow extension runs a **WebSocket server** on the development machine. The SDK (running in the browser) connects as a **client** and sends JSON messages. The extension never sends messages to the app; the protocol is one-way (app → extension).

## Connection

- **URL:** `ws://127.0.0.1:<port>`
- **Port:** Configurable in VS Code (`renderflow.port`). Default: `8765`.
- **Host:** Extension binds to `127.0.0.1` only (localhost).

## Message Format

All messages are JSON strings sent as WebSocket text frames.

### Render / update event (from app to extension)

Sent by the SDK when a render or state update occurs (e.g. from `sendEvent()` or `useRenderFlow()`).

```json
{
  "filePath": "src/App.tsx",
  "line": 42,
  "column": 10,
  "functionName": "Button",
  "kind": "render"
}
```

| Field          | Type   | Required | Description |
|----------------|--------|----------|-------------|
| `filePath`     | string | Yes      | Path to the source file. Relative to project root (e.g. `src/App.tsx`) or absolute. |
| `line`         | number | Yes      | 1-based line number. |
| `column`       | number | No       | 0-based column (optional). |
| `functionName`  | string | No       | Human-readable label (e.g. component or function name). |
| `kind`         | string | No       | e.g. `"render"`, `"mount"`, `"update"`. |

The extension uses `filePath` and `line` to resolve the workspace file and show the gutter flash and activity feed entry. Other fields are for display and future filtering.

## Reconnection

The SDK may reconnect automatically after a disconnect (e.g. extension restarted). The extension does not send ping/pong; the connection is kept alive by the periodic events from the app. If no events are sent for a long time, the connection may be closed by the OS or the server; the SDK’s reconnect logic will establish a new connection when the next event is sent (or on a timer).

## Discovery

- **Port:** The app (or build) must use the same port as the extension. Options:
  - Use the default `8765` in both.
  - Set `renderflow.port` in VS Code and pass the same value to `connect(port)` in the app (e.g. via env: `REACT_APP_RENDERFLOW_PORT=8765`).
- **Host:** Always `127.0.0.1` for security.

## Example (SDK)

```ts
import { connect, sendEvent } from 'renderflow-sdk';

connect(8765);
sendEvent({
  filePath: 'src/App.tsx',
  line: 20,
  functionName: 'App',
  kind: 'render',
});
```

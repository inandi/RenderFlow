# Render Flow

A **VS Code extension** that gives you **real-time visual telemetry** for your frontend app: as you interact with the UI, the corresponding code in VS Code lights up and appears in an Activity Feed.

---

## What It Does

- **Live mapping:** When your app runs, the lines that fired show a short gutter highlight in VS Code.
- **Activity Feed:** A sidebar lists the sequence of recent events (file:line and function name). Click an entry to jump to that location.
- **React support:** Use the `renderflow-sdk` in your React app to send events; the extension shows them instantly.

---

## Quick Start

1. **Install & run the extension**
   - Open this repo in VS Code, press **F5** to launch the Extension Development Host.
   - In the new window, run **"Render Flow: Start"** from the Command Palette (Ctrl/Cmd+Shift+P).
   - Open the **Render Flow** view (pulse icon in the Activity Bar) and expand **Activity Feed**.

2. **Use the SDK in your React app**
   ```bash
   npm install renderflow-sdk
   ```
   ```js
   import { connect, sendEvent } from 'renderflow-sdk';

   connect(8765);  // same port as extension (default 8765)

   // In a click handler or effect:
   sendEvent({ filePath: 'src/App.jsx', line: 42, functionName: 'handleClick' });
   ```

3. **Optional:** Use the **useRenderFlow()** hook to report on each component render, or **reportRender()** for manual events.

See **[doc/RUN_AND_TEST.md](doc/RUN_AND_TEST.md)** for step-by-step run and test instructions, and **[doc/DEVELOPMENT.md](doc/DEVELOPMENT.md)** for the full SDK API and integration details.

---

## Repo Layout

| Path | Description |
|------|-------------|
| **Root** | VS Code extension (TypeScript in `src/`, run with F5). |
| **packages/renderflow-sdk** | npm package: `connect`, `sendEvent`, `useRenderFlow`, `reportRender`. |
| **examples/sample-react** | Minimal React + Vite app that uses the SDK. |
| **doc/** | [ARCHITECTURE.md](doc/ARCHITECTURE.md), [PROTOCOL.md](doc/PROTOCOL.md), [DEVELOPMENT.md](doc/DEVELOPMENT.md), [RUN_AND_TEST.md](doc/RUN_AND_TEST.md). |

---

## Requirements

- **VS Code** 1.85+
- **Node.js** 18+ (for building the extension and sample app)
- React app using the SDK (browser; connects to `ws://127.0.0.1:8765`)

---

## Configuration

In VS Code settings (search for **Render Flow**):

- **renderflow.port** – WebSocket port (default `8765`). Must match the port passed to `connect()` in your app.
- **renderflow.activityFeedMaxItems** – Max entries in the Activity Feed (default `100`).
- **renderflow.gutterFlashDurationMs** – How long the line highlight stays (default `1500` ms).

---

## Vision & Roadmap

Render Flow addresses the "black box" in frontend development: you click, the UI changes, but tracing which code caused it is hard. The extension bridges the running app and the editor so you can see what fired.

- **Done:** VS Code extension, WebSocket bridge, React SDK, gutter flash, Activity Feed.
- **Planned:** Filtering and throttling, heatmaps, Vue/Angular SDKs, optional manual instrumentation (e.g. `// renderflow:watch`).

See **[doc/PLAN.md](doc/PLAN.md)** for the full implementation plan.

---

## License

MIT. See [LICENSE](LICENSE).

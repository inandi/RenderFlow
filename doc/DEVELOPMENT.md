# Render Flow – Development Guide

## Repo layout

- **Root:** VS Code extension (TypeScript in `src/`, output in `out/`).
- **`packages/renderflow-sdk/`:** npm package for the app (connect, sendEvent, React hook).
- **`examples/sample-react/`:** Minimal Vite + React app that uses the SDK; useful for testing the full flow.
- **`doc/`:** Architecture, protocol, and this development guide.

## Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)

## Building and running the extension

1. **Install dependencies (root):**
   ```bash
   npm install
   ```

2. **Compile:**
   ```bash
   npm run compile
   ```
   Or run the watch task so the extension recompiles on change:
   ```bash
   npm run watch
   ```

3. **Debug the extension:**
   - Open this repo in VS Code.
   - Press **F5** (or Run > Start Debugging). A new VS Code window opens with the extension loaded (“Extension Development Host”).
   - In the new window: open a folder that contains your frontend project (or the sample app).
   - Run the command **“Render Flow: Start”** (Command Palette: `Ctrl/Cmd+Shift+P` → “Render Flow: Start”). You should see “Render Flow listening on port 8765.”
   - The **Render Flow** view appears in the Activity Bar (pulse icon). Open “Activity Feed” to see events.

4. **Stop:** Run **“Render Flow: Stop”** when done.

## Using the SDK in a React app

1. **Install the SDK** (from this repo, via link or path):
   ```bash
   npm install ../path/to/RenderFlow/packages/renderflow-sdk
   ```
   Or add to `package.json`:
   ```json
   "renderflow-sdk": "file:../packages/renderflow-sdk"
   ```
   Then `npm install`.

2. **Build the SDK** (if you changed it):
   ```bash
   cd packages/renderflow-sdk && npm run build
   ```

3. **In your app:**
   - Connect when the app starts (e.g. in `main.tsx` or `App.tsx`):
     ```ts
     import { connect } from 'renderflow-sdk';
     connect(8765); // or omit to use default 8765
     ```
   - In components, either:
     - **Automatic:** Call `useRenderFlow()` (optionally with `{ filePath, line, functionName }` if the stack isn’t reliable):
       ```tsx
       import { useRenderFlow } from 'renderflow-sdk';
       function Button() {
         useRenderFlow(); // infers location from stack when possible
         return <button>Click</button>;
       }
       ```
     - **Manual:** Call `sendEvent({ filePath, line, functionName })` where you know the location (e.g. in a click handler or after a state update).

4. **Ensure port matches:** If you changed `renderflow.port` in VS Code, pass that port to `connect(port)` (e.g. via `process.env.REACT_APP_RENDERFLOW_PORT` or similar).

5. **Run your app** (e.g. `npm start`). Interact with the UI; you should see gutter flashes and Activity Feed entries in the Extension Development Host window.

**Quick test with the sample app:** Open the Render Flow repo in VS Code, press F5, then in the new window open the repo folder. Run “Render Flow: Start”. In a terminal run `cd examples/sample-react && npm install && npm run dev`. Open http://localhost:5173 and click the button; the extension’s Activity Feed and gutter should update (open `examples/sample-react/src/App.jsx` in the dev host to see the gutter).

## Adding new event types or views

- **New event fields:** Add optional fields to the JSON sent by the SDK and document them in [PROTOCOL.md](PROTOCOL.md). The extension can read and display them (e.g. in the Activity Feed tree item label or tooltip).
- **New views:** In the extension, add a new view in `package.json` under `contributes.views`, then register a `TreeDataProvider` or `WebviewViewProvider` in `extension.ts` and subscribe to the same event list (or a filtered/aggregated version) as the Activity Feed.
- **Filtering:** Implement in the extension in the handler that processes WebSocket messages: filter by `filePath` (glob), `functionName` (pattern), or minimum interval per line before calling `pushActivityFeedEvent` and `showGutterFlash`.

## Troubleshooting

- **“Render Flow listening on port 8765” but no events in the feed:** Ensure the app is calling `connect(8765)` (or the port you set) and that `sendEvent` or `useRenderFlow` is actually invoked (e.g. component is rendering). Check the browser console for WebSocket errors.
- **Gutter doesn’t flash:** The extension resolves `filePath` against the first workspace folder. Use a path relative to the workspace root (e.g. `src/App.tsx`) and ensure that file is inside the opened folder.
- **Port in use:** Change `renderflow.port` in VS Code settings and use the same value in `connect(port)` in the app.

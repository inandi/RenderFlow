# How to Run and Test Render Flow

Quick steps to run the extension and sample app and verify everything works.

## Prerequisites

- **Node.js 18+**
- **VS Code** (this repo opened as the workspace)

---

## 1. Build the extension

From the repo root:

```bash
npm install
npm run compile
```

You should see no errors and an `out/` folder with compiled JS.

---

## 2. Run the extension (Extension Development Host)

1. Open this repo in VS Code (the RenderFlow folder as the root).
2. Press **F5** (or **Run > Start Debugging**).
3. A new VS Code window opens titled **Extension Development Host**.
4. **If the new window has no folder or a different folder:** the extension only sees events for files in the opened workspace, so the workspace must be the RenderFlow repo. Use **File > Open…** (or **File > Open Folder…**), then in the file picker go to your RenderFlow repo (e.g. `Documents/nerd/RenderFlow`) and select the **RenderFlow** folder. On macOS you can also use **File > Open Recent** if the repo is listed. (Often the Extension Development Host already has the same folder open—then skip this step.)
5. Open the Command Palette: **Ctrl+Shift+P** (Windows/Linux) or **Cmd+Shift+P** (macOS).
6. Run **“Render Flow: Start”**.
7. You should see a message: **“Render Flow listening on port 8765.”**
8. In the Activity Bar (left side), click the **pulse icon** (Render Flow). Expand **Activity Feed**. It may be empty until the app sends events.

**Important:** Start the extension *before* opening the sample app in the browser, so the WebSocket connects. If you opened the app first, use the **Reconnect** button in the sample app after starting the extension.

---

## 3. Run the sample React app

In a **terminal** (outside the Extension Development Host), either:

**From repo root:**
```bash
npm run sample
```

**Or from the sample app folder:**
```bash
cd examples/sample-react
npm install
npm run dev
```

The SDK builds automatically on `npm install` (via its `prepare` script). If you changed the SDK source, run `cd packages/renderflow-sdk && npm run build` first.

Open **http://localhost:5173** in your browser. You should see a page with a “Count” and an “Increment” button. If port 5173 is in use, Vite will try the next available port and print it in the terminal.

---

## 4. Verify the integration

1. In the **Extension Development Host** window, open the file **`examples/sample-react/src/App.jsx`** (so the editor is showing that file).
2. In the **browser**, click the **“Increment”** button several times.
3. In the Extension Development Host you should see:
   - **Activity Feed:** New entries appear (e.g. `App.jsx:14 — handleClick` or similar). Clicking an entry opens the file at that line.
   - **Gutter:** A short blue highlight (flash) on the relevant line in `App.jsx` when an event is received (around line 14). The highlight disappears after about 1.5 seconds (configurable in settings).

If both the feed and the gutter update when you interact with the sample app, the run and test flow is working.

---

## 5. Stop when done

- **Sample app:** In the terminal where `npm run dev` is running, press **Ctrl+C**.
- **Extension:** In the Extension Development Host, run **“Render Flow: Stop”** from the Command Palette, then close that window.

---

## Optional: Change port

- **Extension:** File > Preferences > Settings, search for `renderflow.port`, set a number (e.g. `8766`).
- **Sample app:** Edit `examples/sample-react/src/main.jsx` and change `connect(8765)` to `connect(8766)` (or the same value you set in settings). Restart the extension (“Render Flow: Stop” then “Render Flow: Start”) and refresh the browser.

---

## Troubleshooting

| Problem | What to check |
|--------|----------------|
| No “Render Flow listening” message | Run “Render Flow: Start” in the **Extension Development Host** window (not the main VS Code window). |
| Activity Feed stays empty when clicking the button | 1) Run **"Render Flow: Start"** in the Extension Development Host (Command Palette). 2) In the sample app, check the status—if it says **Disconnected**, click **Reconnect**. 3) Ensure the Extension Development Host has the **RenderFlow repo folder** open. 4) Click Increment again. |
| Gutter doesn’t flash | Open `examples/sample-react/src/App.jsx` in the Extension Development Host. The extension only decorates visible editors for the event’s file. |
| Empty white screen | Open DevTools (F12) → Console for errors. Run `cd examples/sample-react && npm install && npm run build && npx vite preview` to test the production build. Hard refresh (Ctrl+Shift+R). |
| Port already in use | Change `renderflow.port` in VS Code settings and use the same port in `connect(port)` in the sample app’s `main.jsx`. |
| localhost not starting | Run `npm run sample` from the repo root (not `npm run dev`—that starts the extension watch). Or `cd examples/sample-react && npm run dev`. Ensure port 5173 is free; Vite will try the next port if it’s taken. |

For more detail (SDK API, using in your own app, adding views), see [DEVELOPMENT.md](DEVELOPMENT.md).

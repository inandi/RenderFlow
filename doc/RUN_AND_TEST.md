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
4. In that window, open the **same repo folder** (File > Open Folder → choose the RenderFlow directory). The extension only sees events for files in the opened workspace.
5. Open the Command Palette: **Ctrl+Shift+P** (Windows/Linux) or **Cmd+Shift+P** (macOS).
6. Run **“Render Flow: Start”**.
7. You should see a message: **“Render Flow listening on port 8765.”**
8. In the Activity Bar (left side), click the **pulse icon** (Render Flow). Expand **Activity Feed**. It may be empty until the app sends events.

---

## 3. Run the sample React app

In a **terminal** (outside the Extension Development Host):

```bash
cd examples/sample-react
npm install
npm run dev
```

Open **http://localhost:5173** in your browser. You should see a page with a “Count” and an “Increment” button.

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
| Activity Feed stays empty when clicking the button | Ensure the **Extension Development Host** has the **RenderFlow repo folder** open (not a different project). Ensure the sample app is running and you opened http://localhost:5173. Check the browser console (F12) for WebSocket errors. |
| Gutter doesn’t flash | Open `examples/sample-react/src/App.jsx` in the Extension Development Host. The extension only decorates visible editors for the event’s file. |
| Port already in use | Change `renderflow.port` in VS Code settings and use the same port in `connect(port)` in the sample app’s `main.jsx`. |

For more detail (SDK API, using in your own app, adding views), see [DEVELOPMENT.md](DEVELOPMENT.md).

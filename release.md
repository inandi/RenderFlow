## New Features

- VS Code extension with WebSocket server (default port 8765, localhost only)
- Activity Feed sidebar listing recent render events (file:line and function name); click to open location
- Gutter line flash when events are received (configurable duration)
- `renderflow-sdk` npm package: `connect()`, `sendEvent()`, `useRenderFlow()`, `reportRender()`
- React support via SDK; optional `useRenderFlow()` hook for automatic render reporting
- Sample React + Vite app demonstrating the integration
- Configuration: `renderflow.port`, `renderflow.activityFeedMaxItems`, `renderflow.gutterFlashDurationMs`
- Commands: Render Flow: Start, Stop, Clear Activity Feed

# Release v1.1.2 - 2026-02-28

## New Features

- PHP support: per-language event handlers; `packages/renderflow-php` client (`RenderFlowClient::sendEvent()`); Activity Feed and gutter for PHP (`.php` or `framework: 'php'`).
- JavaScript support: vanilla JS / Node events via `framework: 'javascript'` or `'js'`, or `.mjs`/`.cjs`; dedicated handler and icon in Activity Feed.
- Per-language handlers (React, PHP, JavaScript) in separate TypeScript files; `EventDispatcher` routes by framework or file extension.
- Sample PHP script: `examples/sample-php/example.php` sending an event to the extension.
- Extension icon: `media/logo.png`; publisher set to iNandi.
- Sample React app: connection status (Connected/Disconnected) and Reconnect button.

## Improvements

- README and documentation updated for PHP client, JavaScript support, and repo layout.
- Protocol doc updated with `framework` field and inference rules for React, PHP, and JavaScript.
- Release notes and package.json aligned with reference (icon, publisher).

---

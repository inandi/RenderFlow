# Release v2.1.1 - 2026-04-07

## New Features
- Release workflow now supports publishing to both Visual Studio Marketplace and Open VSX Registry.

## Improvements
- Release script now validates the release version against `package.json` before publishing.
- Publishing flow includes stronger handling for missing `.publish-secrets` tokens and clearer warning messages.
- Extension metadata updated to include preview release mode in `package.json`, with lockfile metadata kept in sync.

---

# Release v1.1.3 - 2026-02-28

## Improvements
- .vscodeignore updated: exclude node_modules, examples, and packages from the extension bundle for cleaner packaging.
- Code documentation: JSDoc added across extension main module, activity feed, and event handler modules (author, since, version, copyright; @param, @returns for key functions).
- Package dependencies aligned with VS Code engine 1.74.0 for broader compatibility.

---

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

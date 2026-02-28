# Render Flow PHP

Send render/call events from your PHP application to the Render Flow VS Code extension.

## Requirements

- PHP 7.4+ (or 8.x)
- Render Flow VS Code extension running with "Render Flow: Start" (default port 8765)

## Installation

Copy `src/RenderFlowClient.php` into your project, or use Composer (if published).

## Usage

```php
<?php
require_once __DIR__ . '/path/to/RenderFlowClient.php';

use RenderFlow\RenderFlowClient;

$client = new RenderFlowClient('127.0.0.1', 8765);

// Send an event when a function is called
$client->sendEvent([
    'filePath' => 'src/Controllers/UserController.php',
    'line' => 42,
    'functionName' => 'index',
    'kind' => 'call',
    'framework' => 'php',
]);

// Optional: disconnect when done (e.g. end of request)
$client->disconnect();
```

## Event payload

| Key           | Required | Description                                      |
|---------------|----------|--------------------------------------------------|
| `filePath`    | Yes      | Path to the file (relative to workspace or absolute) |
| `line`        | Yes      | 1-based line number                             |
| `column`      | No       | 0-based column                                  |
| `functionName`| No       | Function or method name                         |
| `kind`        | No       | e.g. `call`, `render`                           |
| `framework`   | No       | Set to `'php'` for PHP-specific handling        |

## Manual instrumentation

Call `sendEvent()` from your code where you want to report (e.g. at the start of important functions or controllers). The extension will show the event in the Activity Feed and flash the gutter at that location.

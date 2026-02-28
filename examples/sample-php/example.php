<?php
/**
 * Example: send a PHP event to the Render Flow extension.
 * Run "Render Flow: Start" in VS Code, then: php example.php
 */

require_once __DIR__ . '/../../packages/renderflow-php/src/RenderFlowClient.php';

use RenderFlow\RenderFlowClient;

$client = new RenderFlowClient('127.0.0.1', 8765);

// Simulate a controller action
$client->sendEvent([
    'filePath' => 'examples/sample-php/example.php',
    'line' => 22,
    'functionName' => 'main',
    'kind' => 'call',
    'framework' => 'php',
]);

echo "Event sent. Check the Activity Feed in VS Code.\n";

$client->disconnect();

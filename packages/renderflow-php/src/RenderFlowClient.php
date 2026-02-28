<?php

namespace RenderFlow;

/**
 * PHP client for the Render Flow VS Code extension.
 * Sends events over WebSocket (RFC 6455) to the extension's server.
 */
class RenderFlowClient
{
    private string $host;
    private int $port;
    private $socket = null;

    public function __construct(string $host = '127.0.0.1', int $port = 8765)
    {
        $this->host = $host;
        $this->port = $port;
    }

    /**
     * Send an event to the Render Flow extension.
     *
     * @param array{filePath: string, line: int, column?: int, functionName?: string, kind?: string, framework?: string} $event
     */
    public function sendEvent(array $event): bool
    {
        if (!isset($event['filePath'], $event['line']) || !is_numeric($event['line'])) {
            return false;
        }
        $payload = json_encode($event);
        if ($payload === false) {
            return false;
        }
        return $this->send($payload);
    }

    /**
     * Connect to the extension's WebSocket server and send a text message.
     */
    private function send(string $text): bool
    {
        if (!$this->connect()) {
            return false;
        }
        $frame = $this->encodeTextFrame($text);
        $written = @fwrite($this->socket, $frame);
        return $written !== false && $written === strlen($frame);
    }

    public function disconnect(): void
    {
        if ($this->socket !== null) {
            @fclose($this->socket);
            $this->socket = null;
        }
    }

    private function connect(): bool
    {
        if ($this->socket !== null) {
            return true;
        }
        $errno = 0;
        $errstr = '';
        $this->socket = @stream_socket_client(
            "tcp://{$this->host}:{$this->port}",
            $errno,
            $errstr,
            2,
            STREAM_CLIENT_CONNECT
        );
        if ($this->socket === false) {
            return false;
        }
        $key = base64_encode(random_bytes(16));
        $request = "GET / HTTP/1.1\r\n"
            . "Host: {$this->host}:{$this->port}\r\n"
            . "Upgrade: websocket\r\n"
            . "Connection: Upgrade\r\n"
            . "Sec-WebSocket-Key: {$key}\r\n"
            . "Sec-WebSocket-Version: 13\r\n"
            . "\r\n";
        if (@fwrite($this->socket, $request) === false) {
            $this->disconnect();
            return false;
        }
        $response = '';
        while (($line = @fgets($this->socket)) !== false && $line !== "\r\n") {
            $response .= $line;
        }
        if (strpos($response, '101') === false && strpos($response, '101 Switching Protocols') === false) {
            $this->disconnect();
            return false;
        }
        return true;
    }

    private function encodeTextFrame(string $payload): string
    {
        $len = strlen($payload);
        $mask = random_bytes(4);
        $masked = '';
        for ($i = 0; $i < $len; $i++) {
            $masked .= $payload[$i] ^ $mask[$i % 4];
        }
        $first = "\x81";
        if ($len <= 125) {
            $second = chr(0x80 | $len);
            return $first . $second . $mask . $masked;
        }
        if ($len <= 0xFFFF) {
            $second = chr(0x80 | 126);
            return $first . $second . pack('n', $len) . $mask . $masked;
        }
        $second = chr(0x80 | 127);
        return $first . $second . pack('J', $len) . $mask . $masked;
    }

    public function __destruct()
    {
        $this->disconnect();
    }
}

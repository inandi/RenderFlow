import { useState, useEffect } from 'react';
import { sendEvent, isConnected, connect } from 'renderflow-sdk';

export default function App() {
  const [count, setCount] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const check = () => setConnected(isConnected());
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, []);

  const handleClick = () => {
    setCount((c) => c + 1);
    sendEvent({
      filePath: 'examples/sample-react/src/App.jsx',
      line: 17,
      functionName: 'handleClick',
      kind: 'click',
    });
  };

  const handleReconnect = () => {
    connect(8765);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Render Flow sample</h1>
      <p style={{ marginBottom: 8 }}>
        Status: <strong style={{ color: connected ? '#0a0' : '#c00' }}>{connected ? 'Connected' : 'Disconnected'}</strong>
        {!connected && (
          <button onClick={handleReconnect} style={{ marginLeft: 8, padding: '2px 8px' }}>Reconnect</button>
        )}
      </p>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <p style={{ marginTop: 20, fontSize: 12, color: '#666' }}>
        {connected
          ? 'Click Increment — the Activity Feed in VS Code should update.'
          : 'Run &quot;Render Flow: Start&quot; in the Extension Development Host, then click Reconnect above.'}
      </p>
    </div>
  );
}

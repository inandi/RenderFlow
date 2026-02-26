import { useState } from 'react';
import { useRenderFlow, sendEvent } from 'renderflow-sdk';

export default function App() {
  const [count, setCount] = useState(0);
  useRenderFlow({ functionName: 'App' });

  const handleClick = () => {
    setCount((c) => c + 1);
    sendEvent({
      filePath: 'examples/sample-react/src/App.jsx',
      line: 14,
      functionName: 'handleClick',
      kind: 'click',
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Render Flow sample</h1>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
      <p style={{ marginTop: 20, fontSize: 12, color: '#666' }}>
        Open this folder in VS Code, run &quot;Render Flow: Start&quot;, then click the button.
        The gutter and Activity Feed should update.
      </p>
    </div>
  );
}

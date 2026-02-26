import * as vscode from 'vscode';
import {
  ActivityFeedTreeProvider,
  clearActivityFeedEvents,
  pushActivityFeedEvent,
  resolveFileUri,
  type RenderEvent,
} from './activityFeed';

type WsServer = InstanceType<typeof import('ws')['WebSocketServer']>;
let wsServer: WsServer | undefined;
let decorationType: vscode.TextEditorDecorationType | undefined;
let activityFeedProvider: ActivityFeedTreeProvider | undefined;

export function activate(context: vscode.ExtensionContext): void {
  activityFeedProvider = new ActivityFeedTreeProvider();
  const treeView = vscode.window.createTreeView('renderflow.activityFeed', {
    treeDataProvider: activityFeedProvider,
    showCollapseAll: false,
  });
  context.subscriptions.push(treeView);

  context.subscriptions.push(
    vscode.commands.registerCommand('renderflow.start', () => startServer(context)),
    vscode.commands.registerCommand('renderflow.stop', () => stopServer()),
    vscode.commands.registerCommand('renderflow.clearFeed', () => {
      clearActivityFeedEvents();
      activityFeedProvider?.refresh();
    }),
    vscode.commands.registerCommand('renderflow.openAtEvent', (event: RenderEvent) => {
      const uri = resolveFileUri(event.filePath);
      if (uri) {
        vscode.window.showTextDocument(uri, {
          selection: new vscode.Range(Math.max(0, event.line - 1), event.column ?? 0, Math.max(0, event.line - 1), event.column ?? 0),
        });
      }
    })
  );
}

export function deactivate(): void {
  stopServer();
  decorationType?.dispose();
}

function startServer(context: vscode.ExtensionContext): void {
  if (wsServer) {
    vscode.window.showInformationMessage('Render Flow is already running.');
    return;
  }
  const port = vscode.workspace.getConfiguration('renderflow').get<number>('port', 8765);
  import('ws').then((wsModule) => {
    const Ws = wsModule.default as { WebSocketServer: new (opts: { port: number; host: string }) => WsServer };
    const server = new Ws.WebSocketServer({ port, host: '127.0.0.1' });
    wsServer = server;
    server.on('connection', (socket) => handleConnection(socket));
    vscode.window.showInformationMessage(`Render Flow listening on port ${port}.`);
  }).catch(() => {
    vscode.window.showErrorMessage('Render Flow: install optional dependency "ws" for WebSocket support.');
  });
}

function stopServer(): void {
  if (wsServer) {
    wsServer.close();
    wsServer = undefined;
    vscode.window.showInformationMessage('Render Flow stopped.');
  }
}

function handleConnection(socket: import('ws').WebSocket): void {
  socket.on('message', (data) => {
    try {
      const payload = JSON.parse(data.toString());
      if (payload.filePath != null && typeof payload.line === 'number') {
        handleRenderEvent(payload as RenderEvent);
      }
    } catch {
      // ignore invalid JSON
    }
  });
}

function handleRenderEvent(event: RenderEvent): void {
  pushActivityFeedEvent(event);
  activityFeedProvider?.refresh();
  showGutterFlash(event);
}

function showGutterFlash(event: RenderEvent): void {
  const uri = resolveFileUri(event.filePath);
  if (!uri) return;
  const line = Math.max(0, event.line - 1);
  const range = new vscode.Range(line, 0, line, 0);
  if (!decorationType) {
    decorationType = vscode.window.createTextEditorDecorationType({
      gutterIconSize: 'contain',
      isWholeLine: true,
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
      light: { backgroundColor: 'rgba(100, 149, 237, 0.25)' },
      dark: { backgroundColor: 'rgba(100, 149, 237, 0.25)' },
    });
  }
  for (const editor of vscode.window.visibleTextEditors) {
    if (editor.document.uri.toString() === uri.toString()) {
      editor.setDecorations(decorationType, [range]);
      const duration = vscode.workspace.getConfiguration('renderflow').get<number>('gutterFlashDurationMs', 1500);
      setTimeout(() => {
        editor.setDecorations(decorationType!, []);
      }, duration);
      break;
    }
  }
}

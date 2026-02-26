import * as path from 'path';
import * as vscode from 'vscode';

export interface RenderEvent {
  filePath: string;
  line: number;
  column?: number;
  functionName?: string;
  kind?: string;
}

const activityFeedEvents: RenderEvent[] = [];

export function getActivityFeedEvents(): RenderEvent[] {
  return [...activityFeedEvents];
}

export function pushActivityFeedEvent(event: RenderEvent): void {
  activityFeedEvents.unshift(event);
  const max = vscode.workspace.getConfiguration('renderflow').get<number>('activityFeedMaxItems', 100);
  while (activityFeedEvents.length > max) {
    activityFeedEvents.pop();
  }
}

export function clearActivityFeedEvents(): void {
  activityFeedEvents.length = 0;
}

class FeedItem extends vscode.TreeItem {
  constructor(
    public readonly event: RenderEvent,
    public readonly index: number
  ) {
    const label = event.functionName
      ? `${path.basename(event.filePath)}:${event.line} — ${event.functionName}`
      : `${path.basename(event.filePath)}:${event.line}`;
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = `${event.filePath}:${event.line}`;
    this.command = {
      command: 'renderflow.openAtEvent',
      title: 'Open',
      arguments: [event],
    };
    this.iconPath = new vscode.ThemeIcon('pulse');
  }
}

export class ActivityFeedTreeProvider implements vscode.TreeDataProvider<FeedItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: FeedItem): vscode.TreeItem {
    return element;
  }

  getChildren(): FeedItem[] {
    return getActivityFeedEvents().map((e, i) => new FeedItem(e, i));
  }
}

export function resolveFileUri(filePath: string): vscode.Uri | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders?.length) return undefined;
  if (path.isAbsolute(filePath)) {
    return vscode.Uri.file(filePath);
  }
  return vscode.Uri.joinPath(workspaceFolders[0].uri, filePath);
}

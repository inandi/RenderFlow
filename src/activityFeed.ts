/**
 * Activity Feed Module
 *
 * In-memory store and tree view for Render Flow events. Provides list of recent events,
 * tree items for the sidebar, and workspace path resolution for opening files.
 *
 * @author Gobinda Nandi <gobinda.nandi.public@gmail.com>
 * @since 1.1.1 [28-02-2026]
 * @version 1.1.1
 * @copyright (c) 2026 Gobinda Nandi
 */

import * as path from 'path';
import * as vscode from 'vscode';
import type { RenderEvent } from './handlers/types';

export type { RenderEvent } from './handlers/types';

const activityFeedEvents: RenderEvent[] = [];

/**
 * Returns a copy of the current activity feed events (newest first).
 *
 * @returns {RenderEvent[]} List of render events
 * @version 1.1.1
 */
export function getActivityFeedEvents(): RenderEvent[] {
  return [...activityFeedEvents];
}

/**
 * Appends an event to the feed and trims to the configured max size.
 *
 * @param {RenderEvent} event - Normalized render event to add
 * @returns {void}
 * @version 1.1.1
 */
export function pushActivityFeedEvent(event: RenderEvent): void {
  activityFeedEvents.unshift(event);
  const max = vscode.workspace.getConfiguration('renderflow').get<number>('activityFeedMaxItems', 100);
  while (activityFeedEvents.length > max) {
    activityFeedEvents.pop();
  }
}

/**
 * Clears all events from the activity feed.
 *
 * @returns {void}
 * @version 1.1.1
 */
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
    this.tooltip = event.framework ? `[${event.framework}] ${event.filePath}:${event.line}` : `${event.filePath}:${event.line}`;
    this.command = {
      command: 'renderflow.openAtEvent',
      title: 'Open',
      arguments: [event],
    };
    const icon = event.framework === 'php' ? 'file-code' : event.framework === 'javascript' ? 'symbol-misc' : 'pulse';
    this.iconPath = new vscode.ThemeIcon(icon);
  }
}

/**
 * Tree data provider for the Render Flow Activity Feed view.
 *
 * @version 1.1.1
 */
export class ActivityFeedTreeProvider implements vscode.TreeDataProvider<FeedItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  /**
   * Refreshes the tree view so new events are shown.
   *
   * @returns {void}
   * @version 1.1.1
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  /** @param {FeedItem} element - Tree item
   *  @returns {vscode.TreeItem}
   *  @version 1.1.1 */
  getTreeItem(element: FeedItem): vscode.TreeItem {
    return element;
  }

  /** @returns {FeedItem[]} All feed items (newest first)
   *  @version 1.1.1 */
  getChildren(): FeedItem[] {
    return getActivityFeedEvents().map((e, i) => new FeedItem(e, i));
  }
}

/**
 * Resolves a file path (relative or absolute) to a workspace URI.
 *
 * @param {string} filePath - Path relative to workspace root or absolute
 * @returns {vscode.Uri | undefined} URI for the file, or undefined if no workspace
 * @version 1.1.1
 */
export function resolveFileUri(filePath: string): vscode.Uri | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders?.length) return undefined;
  if (path.isAbsolute(filePath)) {
    return vscode.Uri.file(filePath);
  }
  return vscode.Uri.joinPath(workspaceFolders[0].uri, filePath);
}

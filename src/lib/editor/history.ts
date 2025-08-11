import { EDITOR_BEHAVIOR } from './behavior';

export interface HistoryAction {
  type: string;
  timestamp: number;
  shouldSnapshot: boolean;
}

export interface HistoryManager {
  addAction(actionType: string): void;
  shouldCreateSnapshot(actionType: string): boolean;
  getRecentActions(): HistoryAction[];
  clearActions(): void;
}

/**
 * Smart history manager that prevents history flooding
 */
export class SmartHistoryManager implements HistoryManager {
  private actions: HistoryAction[] = [];
  private lastSnapshotTime = 0;
  private debounceTimer: NodeJS.Timeout | null = null;

  /**
   * Add an action to the history
   */
  addAction(actionType: string): void {
    const action: HistoryAction = {
      type: actionType,
      timestamp: Date.now(),
      shouldSnapshot: this.shouldCreateSnapshot(actionType),
    };

    this.actions.push(action);

    // Clean up old actions (keep last 100)
    if (this.actions.length > 100) {
      this.actions = this.actions.slice(-100);
    }

    // Handle debounced snapshot creation
    if (action.shouldSnapshot) {
      this.handleSnapshotAction(action);
    }
  }

  /**
   * Check if an action should create a snapshot
   */
  shouldCreateSnapshot(actionType: string): boolean {
    // Actions that should NOT create snapshots
    if ((EDITOR_BEHAVIOR.history.noSnapshot as readonly string[]).includes(actionType)) {
      return false;
    }

    // Actions that SHOULD create snapshots
    if ((EDITOR_BEHAVIOR.history.createSnapshot as readonly string[]).includes(actionType)) {
      return true;
    }

    // Default: no snapshot
    return false;
  }

  /**
   * Handle snapshot action with debouncing
   */
  private handleSnapshotAction(action: HistoryAction): void {
    // Clear existing debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Set new debounce timer
    this.debounceTimer = setTimeout(() => {
      this.createSnapshot(action);
    }, EDITOR_BEHAVIOR.history.debounceDelay);
  }

  /**
   * Create a snapshot (this would trigger Redux action)
   */
  private createSnapshot(action: HistoryAction): void {
    this.lastSnapshotTime = action.timestamp;

    // Here you would dispatch the commitSnapshot action
    // dispatch(commitSnapshot());

    console.log(`Creating snapshot for action: ${action.type}`);
  }

  /**
   * Get recent actions for debugging
   */
  getRecentActions(): HistoryAction[] {
    return this.actions.slice(-20); // Last 20 actions
  }

  /**
   * Clear all actions
   */
  clearActions(): void {
    this.actions = [];
    this.lastSnapshotTime = 0;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  /**
   * Get action statistics
   */
  getStats(): {
    totalActions: number;
    snapshotActions: number;
    noSnapshotActions: number;
    lastSnapshotAge: number;
  } {
    const snapshotActions = this.actions.filter((a) => a.shouldSnapshot).length;
    const noSnapshotActions = this.actions.filter((a) => !a.shouldSnapshot).length;
    const lastSnapshotAge = this.lastSnapshotTime ? Date.now() - this.lastSnapshotTime : 0;

    return {
      totalActions: this.actions.length,
      snapshotActions,
      noSnapshotActions,
      lastSnapshotAge,
    };
  }

  /**
   * Check if we're in a rapid action sequence
   */
  isRapidSequence(): boolean {
    if (this.actions.length < 3) return false;

    const recentActions = this.actions.slice(-3);
    const timeSpan =
      recentActions[recentActions.length - 1]!.timestamp - recentActions[0]!.timestamp;

    // Consider rapid if 3+ actions within 500ms
    return timeSpan < 500;
  }
}

/**
 * Create a smart history manager instance
 */
export function createSmartHistoryManager(): SmartHistoryManager {
  return new SmartHistoryManager();
}

/**
 * Utility function to check if action should create snapshot
 */
export function shouldCreateSnapshotForAction(actionType: string): boolean {
  return (EDITOR_BEHAVIOR.history.createSnapshot as readonly string[]).includes(actionType);
}

/**
 * Utility function to check if action should NOT create snapshot
 */
export function shouldNotCreateSnapshotForAction(actionType: string): boolean {
  return (EDITOR_BEHAVIOR.history.noSnapshot as readonly string[]).includes(actionType);
}

import { EDITOR_BEHAVIOR } from './behavior';

export interface KeyboardEvent {
  key: string;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  preventDefault: () => void;
}

export interface NudgeResult {
  x: number;
  y: number;
  preventDefault: boolean;
}

/**
 * Handle keyboard shortcuts and nudge controls
 */
export class KeyboardManager {
  private isStageFocused = false;

  /**
   * Set stage focus state
   */
  setFocusState(focused: boolean): void {
    this.isStageFocused = focused;
  }

  /**
   * Check if stage is focused
   */
  isFocused(): boolean {
    return this.isStageFocused;
  }

  /**
   * Handle keyboard events
   */
  handleKeyDown(
    event: KeyboardEvent,
    onNudge?: (deltaX: number, deltaY: number) => void,
    onUndo?: () => void,
    onRedo?: () => void,
  ): NudgeResult {
    // Only handle keys when stage is focused
    if (!this.isStageFocused) {
      return { x: 0, y: 0, preventDefault: false };
    }

    const { key, shiftKey, ctrlKey, metaKey } = event;
    let deltaX = 0;
    let deltaY = 0;
    let preventDefault = false;

    // Handle arrow key nudging
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      const nudgeAmount = shiftKey
        ? EDITOR_BEHAVIOR.keyboard.nudge.large
        : EDITOR_BEHAVIOR.keyboard.nudge.small;

      switch (key) {
        case 'ArrowUp':
          deltaY = -nudgeAmount;
          break;
        case 'ArrowDown':
          deltaY = nudgeAmount;
          break;
        case 'ArrowLeft':
          deltaX = -nudgeAmount;
          break;
        case 'ArrowRight':
          deltaX = nudgeAmount;
          break;
      }

      preventDefault = true;

      // Call nudge callback if provided
      if (onNudge && (deltaX !== 0 || deltaY !== 0)) {
        onNudge(deltaX, deltaY);
      }
    }

    // Handle undo/redo shortcuts
    if (this.isUndoShortcut(key, ctrlKey, metaKey, shiftKey)) {
      if (onUndo) onUndo();
      preventDefault = true;
    } else if (this.isRedoShortcut(key, ctrlKey, metaKey, shiftKey)) {
      if (onRedo) onRedo();
      preventDefault = true;
    }

    return { x: deltaX, y: deltaY, preventDefault };
  }

  /**
   * Check if key combination is undo shortcut
   */
  private isUndoShortcut(
    key: string,
    ctrlKey: boolean,
    metaKey: boolean,
    shiftKey: boolean,
  ): boolean {
    return (key === 'z' || key === 'Z') && (ctrlKey || metaKey) && !shiftKey;
  }

  /**
   * Check if key combination is redo shortcut
   */
  private isRedoShortcut(
    key: string,
    ctrlKey: boolean,
    metaKey: boolean,
    shiftKey: boolean,
  ): boolean {
    return (key === 'z' || key === 'Z') && (ctrlKey || metaKey) && shiftKey;
  }

  /**
   * Get nudge amount for a key
   */
  getNudgeAmount(key: string, shiftKey: boolean): { x: number; y: number } {
    const amount = shiftKey
      ? EDITOR_BEHAVIOR.keyboard.nudge.large
      : EDITOR_BEHAVIOR.keyboard.nudge.small;

    switch (key) {
      case 'ArrowUp':
        return { x: 0, y: -amount };
      case 'ArrowDown':
        return { x: 0, y: amount };
      case 'ArrowLeft':
        return { x: -amount, y: 0 };
      case 'ArrowRight':
        return { x: amount, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  }

  /**
   * Check if a key combination should prevent default behavior
   */
  shouldPreventDefault(
    key: string,
    ctrlKey: boolean,
    metaKey: boolean,
    shiftKey: boolean,
  ): boolean {
    // Prevent default for arrow keys when stage is focused
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      return this.isStageFocused;
    }

    // Prevent default for undo/redo shortcuts
    if (
      this.isUndoShortcut(key, ctrlKey, metaKey, shiftKey) ||
      this.isRedoShortcut(key, ctrlKey, metaKey, shiftKey)
    ) {
      return true;
    }

    return false;
  }
}

/**
 * Create a keyboard manager instance
 */
export function createKeyboardManager(): KeyboardManager {
  return new KeyboardManager();
}

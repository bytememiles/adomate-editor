// Export behavior configuration
export { EDITOR_BEHAVIOR } from './behavior';

// Export snapping system
export {
  calculateSnapping,
  createGuideLines,
  getStageCenter,
  isNearStageCenter,
  type SnapGuide,
  type SnapResult,
} from './snapping';

// Export keyboard management
export { createKeyboardManager, type KeyboardEvent, type NudgeResult } from './keyboard';

// Export smart history management
export {
  createSmartHistoryManager,
  shouldCreateSnapshotForAction,
  shouldNotCreateSnapshotForAction,
  type HistoryAction,
  type HistoryManager,
} from './history';

// Export display utilities
export {
  computeDisplayFit,
  computeViewportFit,
  needsScaling,
  type DisplayFit,
} from './display';

// Editor behavior configuration
export const EDITOR_BEHAVIOR = {
  // Transformer styling
  transformer: {
    border: {
      color: '#3b82f6', // blue-500
      width: 2,
    },
    anchors: {
      fill: '#ffffff', // white
      stroke: '#ffffff', // white
      size: 10,
      strokeWidth: 1,
    },
  },

  // Snapping behavior
  snapping: {
    threshold: 6, // pixels from center to snap
    guides: {
      color: '#3b82f6', // blue-500
      dash: [5, 5],
      width: 1,
      opacity: 0.6,
    },
  },

  // Keyboard shortcuts
  keyboard: {
    nudge: {
      small: 1, // pixels for arrow keys
      large: 10, // pixels for Shift+Arrow
    },
    shortcuts: {
      undo: ['Control+z', 'Meta+z'],
      redo: ['Control+Shift+z', 'Meta+Shift+z'],
    },
  },

  // History management
  history: {
    // Actions that should NOT create snapshots
    noSnapshot: ['dragMove', 'transform', 'keyboardNudge'] as const,
    // Actions that SHOULD create snapshots
    createSnapshot: ['dragEnd', 'transformEnd', 'inputBlur', 'inputApply'] as const,
    // Debounce delay for rapid actions (ms)
    debounceDelay: 100,
  },

  // Focus management
  focus: {
    stageWrapper: {
      tabIndex: 0, // Make stage wrapper focusable
      outline: 'none', // Remove default focus outline
    },
  },
} as const;

// Helper functions
export const isSnapDistance = (distance: number): boolean => {
  return Math.abs(distance) <= EDITOR_BEHAVIOR.snapping.threshold;
};

export const shouldCreateSnapshot = (actionType: string): boolean => {
  return (EDITOR_BEHAVIOR.history.createSnapshot as readonly string[]).includes(actionType);
};

export const shouldNotCreateSnapshot = (actionType: string): boolean => {
  return (EDITOR_BEHAVIOR.history.noSnapshot as readonly string[]).includes(actionType);
};

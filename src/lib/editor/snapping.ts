import type { Vector2d } from 'konva/lib/types';
import { EDITOR_BEHAVIOR } from './behavior';

export interface SnapGuide {
  x?: number;
  y?: number;
  type: 'vertical' | 'horizontal';
}

export interface SnapResult {
  position: Vector2d;
  guides: SnapGuide[];
  snapped: boolean;
}

/**
 * Calculate snapping position and guides for an element
 */
export function calculateSnapping(
  elementCenter: Vector2d,
  stageCenter: Vector2d,
  elementSize: { width: number; height: number },
): SnapResult {
  const guides: SnapGuide[] = [];
  let snapped = false;

  // Calculate distances from stage center
  const distanceX = elementCenter.x - stageCenter.x;
  const distanceY = elementCenter.y - stageCenter.y;

  // Check if element should snap to center
  const shouldSnapX = Math.abs(distanceX) <= EDITOR_BEHAVIOR.snapping.threshold;
  const shouldSnapY = Math.abs(distanceY) <= EDITOR_BEHAVIOR.snapping.threshold;

  // Calculate final position
  const finalX = shouldSnapX ? stageCenter.x : elementCenter.x;
  const finalY = shouldSnapY ? stageCenter.y : elementCenter.y;

  // Add guides for snapped axes
  if (shouldSnapX) {
    guides.push({
      x: stageCenter.x,
      type: 'vertical',
    });
    snapped = true;
  }

  if (shouldSnapY) {
    guides.push({
      y: stageCenter.y,
      type: 'horizontal',
    });
    snapped = true;
  }

  return {
    position: { x: finalX, y: finalY },
    guides,
    snapped,
  };
}

/**
 * Create Konva guide lines from snap result
 */
export function createGuideLines(
  guides: SnapGuide[],
  stageSize: { width: number; height: number },
) {
  return guides
    .map((guide) => {
      if (guide.type === 'vertical' && guide.x !== undefined) {
        return {
          x: guide.x,
          y: 0,
          points: [0, 0, 0, stageSize.height],
          stroke: EDITOR_BEHAVIOR.snapping.guides.color,
          strokeWidth: EDITOR_BEHAVIOR.snapping.guides.width,
          dash: EDITOR_BEHAVIOR.snapping.guides.dash,
          opacity: EDITOR_BEHAVIOR.snapping.guides.opacity,
        };
      } else if (guide.type === 'horizontal' && guide.y !== undefined) {
        return {
          x: 0,
          y: guide.y,
          points: [0, 0, stageSize.width, 0],
          stroke: EDITOR_BEHAVIOR.snapping.guides.color,
          strokeWidth: EDITOR_BEHAVIOR.snapping.guides.width,
          dash: EDITOR_BEHAVIOR.snapping.guides.dash,
          opacity: EDITOR_BEHAVIOR.snapping.guides.opacity,
        };
      }
      return null;
    })
    .filter(Boolean);
}

/**
 * Get stage center coordinates
 */
export function getStageCenter(stageSize: { width: number; height: number }): Vector2d {
  return {
    x: stageSize.width / 2,
    y: stageSize.height / 2,
  };
}

/**
 * Check if a position is within snap threshold of stage center
 */
export function isNearStageCenter(position: Vector2d, stageCenter: Vector2d): boolean {
  const distanceX = Math.abs(position.x - stageCenter.x);
  const distanceY = Math.abs(position.y - stageCenter.y);

  return (
    distanceX <= EDITOR_BEHAVIOR.snapping.threshold &&
    distanceY <= EDITOR_BEHAVIOR.snapping.threshold
  );
}

// Redux action interfaces
import type { Background, TextLayer, Doc } from './data';

export interface SetBackgroundAction {
  type: 'editor/setBackground';
  payload: Background;
}

export interface AddTextLayerAction {
  type: 'editor/addTextLayer';
  payload?: Partial<Omit<TextLayer, 'id'>>;
}

export interface UpdateLayerAction {
  type: 'editor/updateLayer';
  payload: {
    id: string;
    patch: Partial<Omit<TextLayer, 'id'>>;
  };
}

export interface ReorderLayerAction {
  type: 'editor/reorderLayer';
  payload: {
    id: string;
    direction: 'up' | 'down' | 'top' | 'bottom';
  };
}

export interface DeleteLayerAction {
  type: 'editor/deleteLayer';
  payload: string; // id
}

export interface SelectLayersAction {
  type: 'editor/selectLayers';
  payload: string[]; // ids
}

export interface CommitSnapshotAction {
  type: 'editor/commitSnapshot';
}

export interface UndoAction {
  type: 'editor/undo';
}

export interface RedoAction {
  type: 'editor/redo';
}

export interface RestoreSnapshotAction {
  type: 'editor/restoreSnapshot';
  payload: Doc;
}

// Union type for all actions
export type EditorAction =
  | SetBackgroundAction
  | AddTextLayerAction
  | UpdateLayerAction
  | ReorderLayerAction
  | DeleteLayerAction
  | SelectLayersAction
  | CommitSnapshotAction
  | UndoAction
  | RedoAction
  | RestoreSnapshotAction;

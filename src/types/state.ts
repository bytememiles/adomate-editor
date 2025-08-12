// Redux state interfaces
import type { PresetState } from '@/store/slices/presetSlice';
import type { SelectedLayerState } from '@/store/slices/selectedLayerSlice';
import type { Doc } from './data';

export interface HistoryState {
  past: Doc[];
  present: Doc;
  future: Doc[];
}

export interface RootState {
  editor: HistoryState;
  selectedLayer: SelectedLayerState;
  preset: PresetState;
}

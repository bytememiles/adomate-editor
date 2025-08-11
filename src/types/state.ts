// Redux state interfaces
import type { Doc } from './data';

export interface HistoryState {
  past: Doc[];
  present: Doc;
  future: Doc[];
}

export interface RootState {
  editor: HistoryState;
  // Add other slices here as needed
}

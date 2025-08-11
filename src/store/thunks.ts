import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Doc } from '@/types';
import { restoreSnapshot } from './slices/editorSlice';

// Thunk to restore editor state from localStorage
export const restoreFromStorage = createAsyncThunk(
  'editor/restoreFromStorage',
  async (_, { dispatch }) => {
    try {
      const stored = localStorage.getItem('editor:state');
      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored);

      // Validate the parsed data has the expected structure
      if (parsed && typeof parsed === 'object' && 'layers' in parsed) {
        dispatch(restoreSnapshot(parsed as Doc));
        return parsed;
      }

      return null;
    } catch (error) {
      console.warn('Failed to restore from storage:', error);
      return null;
    }
  },
);

// Thunk to clear storage and reset to empty state
export const resetEditor = createAsyncThunk('editor/resetEditor', async (_, { dispatch }) => {
  try {
    localStorage.removeItem('editor:state');
    // The editor slice already has empty initial state
    return true;
  } catch (error) {
    console.warn('Failed to clear storage:', error);
    return false;
  }
});

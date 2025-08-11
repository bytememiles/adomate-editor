import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import editorReducer from './slices/editorSlice';
import type { RootState as StoreRootState } from '@/types';

// Create listener middleware for autosave
const listenerMiddleware = createListenerMiddleware();

// Start listening for actions that should trigger autosave
listenerMiddleware.startListening({
  predicate: (action) => [
    'editor/setBackground',
    'editor/addTextLayer', 
    'editor/updateLayer',
    'editor/reorderLayer',
    'editor/deleteLayer',
    'editor/undo',
    'editor/redo'
  ].includes(action.type),
  effect: async (action, listenerApi) => {
    // Debounce autosave by 300ms
    listenerApi.unsubscribe();
    await listenerApi.delay(300);
    
    const state = listenerApi.getState() as RootState;
    const documentState = state.editor.present;
    
    // Persist to localStorage
    try {
      localStorage.setItem('editor:state', JSON.stringify(documentState));
    } catch (error) {
      console.warn('Failed to autosave:', error);
    }
    
    // Re-subscribe for future actions
    listenerApi.subscribe();
  },
});

const rootReducer = {
  editor: editorReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).prepend(listenerMiddleware.middleware),
});

// Use the RootState from types, but extend it with the actual store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './slices/editorSlice';

// Root reducer
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
    }),
});

// Use the RootState from types, but extend it with the actual store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

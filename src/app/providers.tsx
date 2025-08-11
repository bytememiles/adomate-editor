'use client';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from '@/store';
import { restoreFromStorage } from '@/store';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps): React.JSX.Element {
  useEffect(() => {
    // Restore editor state from localStorage on app initialization
    store.dispatch(restoreFromStorage());
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

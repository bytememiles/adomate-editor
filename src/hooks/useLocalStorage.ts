import { useState, useEffect } from 'react';

// Helper function to revive Date objects from localStorage
function reviveDates(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(reviveDates);
  }

  if (obj.uploadedAt && typeof obj.uploadedAt === 'string') {
    // Check if this looks like an UploadedFile object with a date
    return {
      ...obj,
      uploadedAt: new Date(obj.uploadedAt),
    };
  }

  // Recursively process nested objects
  const revived: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      revived[key] = reviveDates(obj[key]);
    }
  }

  return revived;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Revive Date objects if they exist
        return reviveDates(parsed);
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

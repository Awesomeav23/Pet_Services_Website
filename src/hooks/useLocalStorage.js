import { useCallback, useEffect, useState } from 'react';

/**
 * useState backed by localStorage.
 *
 * Used so a half-completed booking survives an accidental refresh. Reads and
 * writes are wrapped in try/catch because localStorage throws in private
 * browsing modes and when the origin quota is exhausted — in those cases the
 * hook quietly degrades to ordinary component state rather than breaking the
 * form.
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage unavailable — keep going with in-memory state only.
    }
  }, [key, value]);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Nothing to clean up if storage was never writable.
    }
    setValue(initialValue);
  }, [key, initialValue]);

  return [value, setValue, clear];
}

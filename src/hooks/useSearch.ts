import { useState, useMemo, useCallback, useRef } from 'react';
import { searchParts } from '../utils/search';
import type { NormalizedPart } from '../utils/search';

const DEBOUNCE_MS = 200;

/**
 * Custom hook for debounced search.
 */
export function useSearch(initialDebounceMs = DEBOUNCE_MS) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateQuery = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      if (timeoutId.current) clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => {
        setDebouncedQuery(newQuery);
      }, initialDebounceMs);
    },
    [initialDebounceMs]
  );

  const results = useMemo((): (NormalizedPart & { score?: number; matches?: any })[] => {
    return searchParts(debouncedQuery);
  }, [debouncedQuery]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    if (timeoutId.current) clearTimeout(timeoutId.current);
  }, []);

  return { query, updateQuery, results, clearSearch };
}

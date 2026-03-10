import { useState, useMemo, useCallback } from 'react';
import { searchParts } from '../utils/search';

/**
 * Custom hook for debounced search.
 */
export function useSearch(debounceMs = 200) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);

  const updateQuery = useCallback(
    (newQuery) => {
      setQuery(newQuery);
      if (timeoutId) clearTimeout(timeoutId);
      const id = setTimeout(() => {
        setDebouncedQuery(newQuery);
      }, debounceMs);
      setTimeoutId(id);
    },
    [debounceMs, timeoutId]
  );

  const results = useMemo(() => {
    return searchParts(debouncedQuery);
  }, [debouncedQuery]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    if (timeoutId) clearTimeout(timeoutId);
  }, [timeoutId]);

  return { query, updateQuery, results, clearSearch };
}

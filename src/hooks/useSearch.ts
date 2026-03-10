import { useState, useMemo, useCallback, useRef } from 'react'
import type Fuse from 'fuse.js'
import { buildSearchIndex } from '@/utils/fuseConfig'
import type { Part } from '@/types'

const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 200

interface UseSearchReturn {
    query: string
    setQuery: (q: string) => void
    results: Part[]
    isSearching: boolean
}

/**
 * useSearch — fuzzy search hook powered by Fuse.js.
 *
 * - Builds the Fuse index once from the provided parts array.
 * - Debounces input by 200ms before running the search.
 * - Returns an empty array (not an error) when query < 2 chars.
 */
export function useSearch(parts: Part[]): UseSearchReturn {
    const [query, setQueryRaw] = useState('')
    const [results, setResults] = useState<Part[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Build index once; rebuild only if the parts array reference changes
    const index: Fuse<Part> = useMemo(() => buildSearchIndex(parts), [parts])

    const setQuery = useCallback(
        (q: string) => {
            setQueryRaw(q)

            if (debounceTimer.current) clearTimeout(debounceTimer.current)

            if (q.length < MIN_QUERY_LENGTH) {
                setResults([])
                setIsSearching(false)
                return
            }

            setIsSearching(true)
            debounceTimer.current = setTimeout(() => {
                const fuseResults = index.search(q)
                setResults(fuseResults.map(r => r.item))
                setIsSearching(false)
            }, DEBOUNCE_MS)
        },
        [index]
    )

    return { query, setQuery, results, isSearching }
}

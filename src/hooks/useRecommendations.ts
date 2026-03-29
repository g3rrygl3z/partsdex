import { useState, useEffect, useRef } from 'react'
import { getLinkedParts, getProTip } from '../utils/recommendationService'
import type { LinkedPart } from '../types'

export interface UseRecommendationsResult {
    linkedParts: LinkedPart[]
    proTip: string | null
    isLoading: boolean
    error: string | null
}

/**
 * Hook that fetches part recommendations (hard-linked + AI pro tip)
 * for a given part ID. Caches results per part to avoid duplicate API calls.
 */
export function useRecommendations(
    partId: string | undefined,
    partName?: string,
    partDescription?: string
): UseRecommendationsResult {
    const [linkedParts, setLinkedParts] = useState<LinkedPart[]>([])
    const [proTip, setProTip] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Cache pro tips to avoid redundant API calls
    const cache = useRef<Record<string, string | null>>({})

    useEffect(() => {
        if (!partId) {
            setLinkedParts([])
            setProTip(null)
            return
        }

        // 1. Instantly get hard-linked parts (synchronous, from JSON)
        const linked = getLinkedParts(partId)
        setLinkedParts(linked)
        setError(null)

        // 2. Check cache for pro tip
        if (cache.current[partId] !== undefined) {
            setProTip(cache.current[partId])
            return
        }

        // 3. Fetch AI pro tip (async)
        if (!partName || !partDescription) {
            setProTip(null)
            return
        }

        let cancelled = false
        setIsLoading(true)

        getProTip(partName, partDescription, linked)
            .then(tip => {
                if (!cancelled) {
                    cache.current[partId] = tip
                    setProTip(tip)
                }
            })
            .catch(err => {
                if (!cancelled) {
                    console.error('[useRecommendations]', err)
                    setError('Could not load Pro Tip')
                    cache.current[partId] = null
                    setProTip(null)
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false)
            })

        return () => { cancelled = true }
    }, [partId, partName, partDescription])

    return { linkedParts, proTip, isLoading, error }
}

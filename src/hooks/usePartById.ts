import { useMemo } from 'react'
import { getPartById } from '@/utils/dataHelpers'
import type { Part } from '@/types'

/**
 * usePartById — look up a single part by its slug ID.
 * Returns the Part if found, or undefined if the ID doesn't exist in the dataset.
 */
export function usePartById(parts: Part[], id: string | undefined): Part | undefined {
    return useMemo(
        () => (id ? getPartById(parts, id) : undefined),
        [parts, id]
    )
}

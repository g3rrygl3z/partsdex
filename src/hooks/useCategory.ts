import { useMemo } from 'react'
import {
    getPartsByVertical,
    getPartsBySubCategory,
    filterByMaterial,
    sortByName,
} from '@/utils/dataHelpers'
import type { Part, Vertical } from '@/types'

interface CategoryFilters {
    vertical: Vertical | null
    subCategory?: string | null
    material?: string | null
}

interface UseCategoryReturn {
    parts: Part[]
    totalCount: number
}

/**
 * useCategory — filters and returns a subset of parts based on
 * vertical, sub-category, and/or material. Results are sorted A–Z by name.
 *
 * Pass null for vertical to get all parts unfiltered.
 */
export function useCategory(allParts: Part[], filters: CategoryFilters): UseCategoryReturn {
    const parts = useMemo(() => {
        let result = allParts

        if (filters.vertical) {
            result = getPartsByVertical(result, filters.vertical)
        }

        if (filters.vertical && filters.subCategory) {
            result = getPartsBySubCategory(result, filters.vertical, filters.subCategory)
        }

        if (filters.material) {
            result = filterByMaterial(result, filters.material)
        }

        return sortByName(result)
    }, [allParts, filters.vertical, filters.subCategory, filters.material])

    return { parts, totalCount: parts.length }
}

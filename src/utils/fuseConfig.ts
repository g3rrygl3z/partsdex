import Fuse, { type IFuseOptions } from 'fuse.js'
import type { Part } from '@/types'

/**
 * Fuse.js configuration for PartsDex search.
 * Keys are weighted so primary name and aliases rank highest,
 * followed by tags and overview text.
 */
export const fuseOptions: IFuseOptions<Part> = {
    // Score threshold: 0.0 = perfect match only, 1.0 = match anything.
    // 0.35 gives good fuzzy tolerance without too many false positives.
    threshold: 0.35,

    // Minimum characters of the pattern that must match (0 = no minimum)
    minMatchCharLength: 2,

    // Return match score so we can sort by relevance
    includeScore: true,

    // Fields to search, with relative weights
    keys: [
        { name: 'primaryName', weight: 0.35 },
        { name: 'aliases', weight: 0.30 },
        { name: 'tags', weight: 0.20 },
        { name: 'overview', weight: 0.10 },
        { name: 'subCategory', weight: 0.05 },
    ],
}

/**
 * Build and return a Fuse index from the parts dataset.
 * Call once at app init, then reuse the instance for all searches.
 */
export function buildSearchIndex(parts: Part[]): Fuse<Part> {
    return new Fuse(parts, fuseOptions)
}

import type { Part, Vertical } from '@/types'

/** Look up a single part by its slug ID. Returns undefined if not found. */
export function getPartById(parts: Part[], id: string): Part | undefined {
    return parts.find(p => p.id === id)
}

/** Filter parts to those belonging to a specific industry vertical. */
export function getPartsByVertical(parts: Part[], vertical: Vertical): Part[] {
    return parts.filter(p => p.category === vertical)
}

/** Filter parts to those belonging to a specific sub-category (within a vertical). */
export function getPartsBySubCategory(
    parts: Part[],
    vertical: Vertical,
    subCategory: string
): Part[] {
    return parts.filter(p => p.category === vertical && p.subCategory === subCategory)
}

/** Filter parts by one or more materials (case-insensitive, partial match). */
export function filterByMaterial(parts: Part[], material: string): Part[] {
    const lower = material.toLowerCase()
    return parts.filter(p =>
        p.materials.some(m => m.toLowerCase().includes(lower))
    )
}

/**
 * Given a part, return all parts it is compatible with,
 * looked up from the full parts list.
 */
export function getCompatibleParts(parts: Part[], part: Part): Part[] {
    return part.compatibleWith
        .map(id => getPartById(parts, id))
        .filter((p): p is Part => p !== undefined)
}

/** Sort an array of parts alphabetically by primary name. */
export function sortByName(parts: Part[]): Part[] {
    return [...parts].sort((a, b) => a.primaryName.localeCompare(b.primaryName))
}

/**
 * Build the flat alias list used by the Glossary page.
 * Returns every alias from every part as { alias, partId, vertical }.
 * Sorted A–Z by alias.
 */
export function buildAliasList(
    parts: Part[]
): { alias: string; partId: string; primaryName: string; vertical: Vertical }[] {
    const entries = parts.flatMap(p =>
        p.aliases.map(alias => ({
            alias,
            partId: p.id,
            primaryName: p.primaryName,
            vertical: p.category,
        }))
    )
    return entries.sort((a, b) => a.alias.localeCompare(b.alias))
}

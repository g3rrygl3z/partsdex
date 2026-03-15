import Fuse from 'fuse.js';
import rawPartsData from '../data/parts.json';
import type { Part, Vertical } from '../types';

// The data in parts.json follows the 'Part' interface defined in types/index.ts
// We'll normalize it for the UI to use 'name', 'vertical', 'description' if needed.

export interface NormalizedPart extends Part {
  name: string;        // alias for primaryName
  vertical: Vertical;  // alias for category
  description: string; // alias for overview
  subcategory: string; // alias for subCategory (lowercase)
  modelNumber?: string;
  applications?: string[];
  connectionType?: string;
}

const partsData: NormalizedPart[] = (rawPartsData as any[]).map(part => ({
  ...part,
  name: part.primaryName,
  vertical: part.category,
  description: part.overview,
  subcategory: part.subCategory,
  manufacturer: part.manufacturer,
  images: part.images,
  modelNumber: part.modelNumber,
  applications: part.applications,
  connectionType: part.connectionType
}));

const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.35 },
    { name: 'aliases', weight: 0.25 },
    { name: 'manufacturer', weight: 0.20 },
    { name: 'description', weight: 0.15 },
    { name: 'subcategory', weight: 0.1 },
    { name: 'vertical', weight: 0.05 },
    { name: 'materials', weight: 0.05 },
    { name: 'tags', weight: 0.05 },
  ],
  threshold: 0.35,
  distance: 200,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
};

const fuse = new Fuse(partsData, fuseOptions);

/**
 * Search parts using fuzzy matching.
 */
export function searchParts(query: string, limit: number = 20): (NormalizedPart & { score?: number; matches?: any })[] {
  if (!query || query.trim().length < 2) return [];
  const results = fuse.search(query.trim(), { limit });
  return results.map((result) => ({
    ...result.item,
    score: result.score,
    matches: result.matches,
  }));
}

/**
 * Get a single part by its ID.
 */
export function getPartById(id: string | undefined): NormalizedPart | undefined {
  if (!id) return undefined;
  return partsData.find((part) => part.id === id);
}

/**
 * Get all parts for a specific vertical.
 */
export function getPartsByVertical(verticalId: Vertical): NormalizedPart[] {
  return partsData.filter((part) => part.vertical === verticalId);
}

/**
 * Get parts filtered by vertical and subcategory.
 */
export function getPartsBySubcategory(verticalId: Vertical, subcategoryId: string): NormalizedPart[] {
  return partsData.filter(
    (part) => part.vertical === verticalId && part.subcategory === subcategoryId
  );
}

/**
 * Get the count of parts per vertical.
 */
export function getPartCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  partsData.forEach((part) => {
    counts[part.vertical] = (counts[part.vertical] || 0) + 1;
  });
  return counts;
}

/**
 * Get all parts.
 */
export function getAllParts(): NormalizedPart[] {
  return partsData;
}

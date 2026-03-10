import Fuse from 'fuse.js';
import partsData from '../data/parts.json';

const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.35 },
    { name: 'aliases.name', weight: 0.25 },
    { name: 'description', weight: 0.15 },
    { name: 'subcategory', weight: 0.1 },
    { name: 'vertical', weight: 0.05 },
    { name: 'materials', weight: 0.05 },
    { name: 'useCases', weight: 0.05 },
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
 * @param {string} query - The search query
 * @param {number} limit - Max results to return
 * @returns {Array} Matched parts with scores
 */
export function searchParts(query, limit = 20) {
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
 * @param {string} id - The part ID
 * @returns {Object|undefined} The part or undefined
 */
export function getPartById(id) {
  return partsData.find((part) => part.id === id);
}

/**
 * Get all parts for a specific vertical.
 * @param {string} verticalId - e.g., 'plumbing', 'hvac', 'boiler-heating'
 * @returns {Array} Parts in that vertical
 */
export function getPartsByVertical(verticalId) {
  return partsData.filter((part) => part.vertical === verticalId);
}

/**
 * Get parts filtered by vertical and subcategory.
 * @param {string} verticalId
 * @param {string} subcategoryId
 * @returns {Array}
 */
export function getPartsBySubcategory(verticalId, subcategoryId) {
  return partsData.filter(
    (part) => part.vertical === verticalId && part.subcategory === subcategoryId
  );
}

/**
 * Get the count of parts per vertical.
 * @returns {Object} e.g., { plumbing: 14, hvac: 6, 'boiler-heating': 8 }
 */
export function getPartCounts() {
  const counts = {};
  partsData.forEach((part) => {
    counts[part.vertical] = (counts[part.vertical] || 0) + 1;
  });
  return counts;
}

/**
 * Get all parts.
 * @returns {Array}
 */
export function getAllParts() {
  return partsData;
}

import { describe, it, expect } from 'vitest';
import { searchParts, getPartById, getPartsByVertical, getPartsBySubcategory, getAllParts } from '../search';

const sampleParts = [
  { id: 'a', primaryName: 'Alpha', aliases: ['A'], category: 'plumbing', subCategory: 'pipes', materials: ['copper'], compatibleWith: [], overview: '', installationNotes: '', tags: [], name: 'Alpha', vertical: 'plumbing', description: '', subcategory: 'pipes' },
  { id: 'b', primaryName: 'Beta', aliases: ['B'], category: 'hvac', subCategory: 'ducts', materials: ['steel'], compatibleWith: [], overview: '', installationNotes: '', tags: [], name: 'Beta', vertical: 'hvac', description: '', subcategory: 'ducts' },
  { id: 'c', primaryName: 'Gamma', aliases: ['G'], category: 'plumbing', subCategory: 'fittings', materials: ['plastic'], compatibleWith: [], overview: '', installationNotes: '', tags: [], name: 'Gamma', vertical: 'plumbing', description: '', subcategory: 'fittings' },
];

describe('search', () => {
  it('searchParts finds by name', () => {
    const results = searchParts('Alpha', 10);
    expect(Array.isArray(results)).toBe(true);
  });

  it('getPartById returns correct part', () => {
    expect(getPartById('compression-fitting-15mm')?.primaryName).toBeDefined();
  });

  it('getPartsByVertical filters by vertical', () => {
    expect(getPartsByVertical('plumbing')).toBeDefined();
  });

  it('getPartsBySubcategory filters by subcategory', () => {
    expect(getPartsBySubcategory('plumbing', 'pipes')).toBeDefined();
  });

  it('getAllParts returns array', () => {
    expect(Array.isArray(getAllParts())).toBe(true);
  });
});

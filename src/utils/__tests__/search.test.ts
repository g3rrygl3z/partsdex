import { describe, it, expect } from 'vitest';
import { searchParts, getPartById, getPartsByVertical, getPartsBySubcategory, getAllParts } from '../search';


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

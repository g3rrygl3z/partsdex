import { describe, it, expect } from 'vitest';
import { getPartById, getPartsByVertical, getPartsBySubCategory, filterByMaterial, sortByName, buildAliasList } from '../dataHelpers';

import type { Vertical } from '../../types';
const sampleParts = [
  { id: 'a', primaryName: 'Alpha', aliases: ['A'], category: 'plumbing' as Vertical, subCategory: 'pipes', materials: ['copper'], compatibleWith: [], overview: '', installationNotes: '', tags: [], diagramUrl: '' },
  { id: 'b', primaryName: 'Beta', aliases: ['B'], category: 'hvac' as Vertical, subCategory: 'ducts', materials: ['steel'], compatibleWith: [], overview: '', installationNotes: '', tags: [], diagramUrl: '' },
  { id: 'c', primaryName: 'Gamma', aliases: ['G'], category: 'plumbing' as Vertical, subCategory: 'fittings', materials: ['plastic'], compatibleWith: [], overview: '', installationNotes: '', tags: [], diagramUrl: '' },
];

describe('dataHelpers', () => {
  it('getPartById returns correct part', () => {
    expect(getPartById(sampleParts, 'a')?.primaryName).toBe('Alpha');
    expect(getPartById(sampleParts, 'z')).toBeUndefined();
  });

  it('getPartsByVertical filters by category', () => {
    expect(getPartsByVertical(sampleParts, 'plumbing')).toHaveLength(2);
    expect(getPartsByVertical(sampleParts, 'hvac')).toHaveLength(1);
  });

  it('getPartsBySubCategory filters by subcategory', () => {
    expect(getPartsBySubCategory(sampleParts, 'plumbing', 'pipes')).toHaveLength(1);
    expect(getPartsBySubCategory(sampleParts, 'plumbing', 'fittings')).toHaveLength(1);
  });

  it('filterByMaterial filters by material', () => {
    expect(filterByMaterial(sampleParts, 'copper')).toHaveLength(1);
    expect(filterByMaterial(sampleParts, 'steel')).toHaveLength(1);
    expect(filterByMaterial(sampleParts, 'plastic')).toHaveLength(1);
    expect(filterByMaterial(sampleParts, 'brass')).toHaveLength(0);
  });

  it('sortByName sorts alphabetically', () => {
    const sorted = sortByName(sampleParts);
    expect(sorted[0].primaryName).toBe('Alpha');
    expect(sorted[2].primaryName).toBe('Gamma');
  });

  it('buildAliasList returns all aliases', () => {
    const aliases = buildAliasList(sampleParts);
    expect(aliases).toHaveLength(3);
    expect(aliases[0].alias).toBe('A');
  });
});

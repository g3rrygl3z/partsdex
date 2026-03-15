import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPartsByVertical, getPartsBySubcategory, getAllParts } from '../utils/search';
import categoriesData from '../data/categories.json';
import PartCard from '../components/PartCard';
import { getVerticalDisplayName } from '../utils/helpers';
import type { Vertical } from '../types';
import { useMemo, useEffect, useRef } from 'react';

export default function BrowseVertical() {
  const { verticalId } = useParams<{ verticalId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubcategory = searchParams.get('sub');
  const material = searchParams.get('material') || '';
  const prevSubcategory = useRef(activeSubcategory);

  // Auto-reset material filter if subcategory changes
  useEffect(() => {
    if (prevSubcategory.current !== activeSubcategory) {
      const params: any = {};
      if (activeSubcategory) params.sub = activeSubcategory;
      setSearchParams(params);
      prevSubcategory.current = activeSubcategory;
    }
  }, [activeSubcategory, setSearchParams]);

  const vertical = (categoriesData as any).find((v: any) => v.id === verticalId);
                   
  // Get all parts for this vertical and subcategory
  let filteredParts = activeSubcategory
    ? getPartsBySubcategory(verticalId as Vertical, activeSubcategory)
    : getPartsByVertical(verticalId as Vertical);

  // Get all unique materials for this vertical (and subcategory if set)
  const allParts = getAllParts();
  const materialOptions = useMemo(() => {
    let pool = allParts.filter(p => p.vertical === verticalId);
    if (activeSubcategory) pool = pool.filter(p => p.subcategory === activeSubcategory);
    const set = new Set<string>();
    pool.forEach(p => p.materials?.forEach(m => set.add(m)));
    return Array.from(set).sort();
  }, [allParts, verticalId, activeSubcategory]);

  // Filter by material if set
  if (material) {
    filteredParts = filteredParts.filter(p => p.materials && p.materials.some(m => m === material));
  }

  if (!vertical) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="heading-lg">Vertical not found</h2>
        <p className="text-subtle mb-6">The category you are trying to browse is not currently available.</p>
        <Link to="/browse" className="btn-primary inline-flex">
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>
      </div>
    );
  }

  const subcategories = vertical.subCategories || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-4">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All
          </Link>
          <div className="space-y-1">
            <h1 className="heading-xl">{getVerticalDisplayName(verticalId as Vertical)}</h1>
            <p className="text-subtle font-medium">{filteredParts.length} components identified in library</p>
          </div>
        </div>
      </div>

      {/* Subcategory Filters - Premium Horizontal Scroll */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 relative">
        {/* Horizontal scroll fade indicator */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-slate-950/80 to-transparent z-10" aria-hidden="true" />
        <button
          onClick={() => setSearchParams({})}
          className={`shrink-0 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
            !activeSubcategory
              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
              : 'bg-slate-900/60 text-slate-500 border-white/5 hover:text-white hover:border-white/20'
          }`}
          aria-label="Show all components"
        >
          All Components
        </button>
        {subcategories.map((sub: any) => (
          <button
            key={sub.id}
            onClick={() => setSearchParams({ sub: sub.id })}
            className={`shrink-0 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              activeSubcategory === sub.id
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                : 'bg-slate-900/60 text-slate-500 border-white/5 hover:text-white hover:border-white/20'
            }`}
            aria-label={`Filter by ${sub.label || sub.name}`}
          >
            {sub.label || sub.name}
          </button>
        ))}
        {/* Material Filter Dropdown */}
        {materialOptions.length > 0 && (
          <select
            value={material}
            onChange={e => {
              const val = e.target.value;
              const params: any = {};
              if (activeSubcategory) params.sub = activeSubcategory;
              if (val) params.material = val;
              setSearchParams(params);
            }}
            className="ml-4 px-4 py-2 rounded-xl border border-white/10 bg-slate-900/60 text-white text-xs font-bold uppercase tracking-wider focus:border-primary focus:ring-1 focus:ring-primary"
            style={{ minWidth: 120 }}
            aria-label="Filter by material"
          >
            <option value="">All Materials</option>
            {materialOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
      </div>

      {/* Parts Grid */}
      {filteredParts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center bg-slate-900/20">
          <p className="text-slate-500 font-medium">No components found for the selected filters.</p>
        </div>
      )}
    </div>
  );
}

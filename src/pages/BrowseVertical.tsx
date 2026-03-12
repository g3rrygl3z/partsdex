import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPartsByVertical, getPartsBySubcategory } from '../utils/search';
import categoriesData from '../data/categories.json';
import PartCard from '../components/PartCard';
import { getVerticalDisplayName } from '../utils/helpers';
import type { Vertical } from '../types';

export default function BrowseVertical() {
  const { verticalId } = useParams<{ verticalId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubcategory = searchParams.get('sub');

  const vertical = (categoriesData as any).verticals?.find((v: any) => v.id === verticalId) || 
                   (categoriesData as any).find((v: any) => v.id === verticalId);
                   
  const parts = activeSubcategory
    ? getPartsBySubcategory(verticalId as Vertical, activeSubcategory)
    : getPartsByVertical(verticalId as Vertical);

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

  const subcategories = vertical.subcategories || vertical.subCategories || [];

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
            <p className="text-subtle font-medium">{parts.length} components identified in library</p>
          </div>
        </div>
      </div>

      {/* Subcategory Filters - Premium Horizontal Scroll */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setSearchParams({})}
          className={`shrink-0 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
            !activeSubcategory
              ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
              : 'bg-slate-900/60 text-slate-500 border-white/5 hover:text-white hover:border-white/20'
          }`}
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
          >
            {sub.label || sub.name}
          </button>
        ))}
      </div>

      {/* Parts Grid */}
      {parts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {parts.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center bg-slate-900/20">
          <p className="text-slate-500 font-medium">No components found in this sub-category yet.</p>
        </div>
      )}
    </div>
  );
}

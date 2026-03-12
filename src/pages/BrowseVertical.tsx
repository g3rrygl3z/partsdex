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
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-400">Vertical not found.</p>
        <Link to="/browse" className="text-blue-400 mt-2 inline-block">← Back to Browse</Link>
      </div>
    );
  }

  const subcategories = vertical.subcategories || vertical.subCategories || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/browse"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{getVerticalDisplayName(verticalId as Vertical)}</h1>
          <p className="text-slate-400 text-sm">{parts.length} parts</p>
        </div>
      </div>

      {/* Subcategory Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setSearchParams({})}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !activeSubcategory
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
          }`}
        >
          All
        </button>
        {subcategories.map((sub: any) => (
          <button
            key={sub.id}
            onClick={() => setSearchParams({ sub: sub.id })}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeSubcategory === sub.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
            }`}
          >
            {sub.label || sub.name}
          </button>
        ))}
      </div>

      {/* Parts Grid */}
      {parts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {parts.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400">No parts found in this category yet.</p>
        </div>
      )}
    </div>
  );
}

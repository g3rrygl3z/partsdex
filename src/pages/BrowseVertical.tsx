import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CornerDownRight, GitBranch, BetweenHorizontalEnd, Settings2, Minus, Shuffle, Link2, Disc, Layers, Pipette, Droplets, ArrowUpRight } from 'lucide-react';
import { getPartsByVertical, getPartsBySubcategory, getAllParts } from '../utils/search';
import categoriesData from '../data/categories.json';
import PartCard from '../components/PartCard';
import { getVerticalDisplayName } from '../utils/helpers';
import type { Vertical } from '../types';
import { useEffect, useRef } from 'react';

export default function BrowseVertical() {
  const { verticalId } = useParams<{ verticalId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubcategory = searchParams.get('sub');
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

  // Filter by material removed for this grouped view logic
  const allParts = getAllParts();

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

  // Group helpers
  const getSubcategoryCount = (subId: string) => {
    return allParts.filter(p => p.vertical === verticalId && p.subCategory === subId).length;
  };

  const GroupIcon = ({ id, className }: { id: string, className?: string }) => {
    const icons: Record<string, any> = {
      elbows: CornerDownRight,
      tees: GitBranch,
      couplings: BetweenHorizontalEnd,
      valves: Settings2,
      nipples: Minus,
      adapters: Shuffle,
      unions: Link2,
      caps: Disc,
      pipes: Layers,
      fixtures: Pipette,
      drainage: Droplets,
      supply: ArrowUpRight,
      fittings: Layers
    };
    const Comp = icons[id] || Layers;
    return <Comp className={className} />;
  };

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
            <p className="text-subtle font-medium">
              {activeSubcategory 
                ? `${filteredParts.length} components found in ${subcategories.find((s:any) => s.id === activeSubcategory)?.label || activeSubcategory}`
                : `${allParts.filter(p => p.vertical === verticalId).length} total components organized into ${subcategories.length} groups`}
            </p>
          </div>
        </div>
      </div>

      {/* Subcategory Navigation / Selection */}
      {!activeSubcategory ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {subcategories.map((sub: any) => {
            const count = getSubcategoryCount(sub.id);
            if (count === 0 && verticalId === 'plumbing') return null; // Hide empty groups for plumbing
            
            return (
              <button
                key={sub.id}
                onClick={() => setSearchParams({ sub: sub.id })}
                className="group relative flex flex-col items-center justify-center p-6 glass-card glass-card-hover text-center gap-4 border border-white/5"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                  <GroupIcon id={sub.id} className="w-7 h-7 text-primary-light" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white group-hover:text-primary-light transition-colors">
                    {sub.label || sub.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {count} Parts
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-3 h-3 text-primary-light" />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Subcategory Filters - Compact version when inside a category */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 relative mb-4">
            <button
              onClick={() => setSearchParams({})}
              className="shrink-0 px-4 py-2 rounded-xl bg-slate-900/60 text-slate-500 border border-white/5 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
            >
              ← Back to Groups
            </button>
            {subcategories.map((sub: any) => (
              <button
                key={sub.id}
                onClick={() => setSearchParams({ sub: sub.id })}
                className={`shrink-0 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeSubcategory === sub.id
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                    : 'bg-slate-900/60 text-slate-500 border-white/5 hover:text-white'
                }`}
              >
                {sub.label || sub.name}
              </button>
            ))}
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
              <button onClick={() => setSearchParams({})} className="mt-4 text-primary text-sm font-bold">Show all groups</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

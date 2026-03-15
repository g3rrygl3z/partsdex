import { useSearchParams } from 'react-router-dom';
import { useSmartSearch } from '../hooks/useSmartSearch';
import PartCard from '../components/PartCard';
import { Search, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const { 
    query, 
    setQuery, 
    results, 
    isAiLoading, 
    aiExplanation, 
    aiConfidence, 
    aiError,
    mode,
    hasResults
  } = useSmartSearch();

  // Sync URL with query
  useEffect(() => {
    if (initialQuery && !query) {
      setQuery(initialQuery);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams(query ? { q: query } : {}, { replace: true });
    }, 500);
    return () => clearTimeout(timer);
  }, [query, setSearchParams]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, alias, trade slang..."
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
          {isAiLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-[10px] font-bold text-primary-light uppercase tracking-widest animate-pulse">AI Thinking</span>
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
          )}
        </div>

        {/* AI Insight Banner */}
        {mode === 'ai' && aiExplanation && (
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
            <Sparkles className="w-5 h-5 text-primary-light shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-white flex items-center gap-2">
                AI Match Insights
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md uppercase ${aiConfidence === 'high' ? 'bg-success/20 text-success' : 'bg-amber-500/20 text-amber-400'}`}>
                  {aiConfidence} confidence
                </span>
              </p>
              <p className="text-xs text-blue-200/70 leading-relaxed italic">
                "{aiExplanation}"
              </p>
            </div>
          </div>
        )}

        {/* AI Error */}
        {aiError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-[11px] text-red-400">
            <AlertCircle className="w-4 h-4" />
            {aiError}
          </div>
        )}

        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {mode === 'ai' ? 'Smart AI Matches' : 'Local Search Results'}
          </h2>
          <span className="text-xs font-medium text-slate-500">{results.length} found</span>
        </div>

        {hasResults ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((part) => (
              <PartCard key={part.id} part={part} />
            ))}
          </div>
        ) : (
          !isAiLoading && query.trim().length > 1 && (
            <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-white/5">
              <p className="text-slate-500 font-medium">No direct matches found.</p>
              <p className="text-xs text-slate-600 mt-1">Try a different term or natural language description.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

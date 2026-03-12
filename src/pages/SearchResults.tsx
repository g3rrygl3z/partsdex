import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { Search } from 'lucide-react';
import { searchParts, getAllParts } from '../utils/search';
import PartCard from '../components/PartCard';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return searchParts(query);
  }, [query]);

  // Show all parts if no query
  const allParts = getAllParts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">
            {query ? `Results for "${query}"` : 'All Parts'}
          </h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          {query
            ? `${results.length} part${results.length !== 1 ? 's' : ''} found`
            : `${allParts.length} parts in the database`}
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {(query ? results : allParts).map((part) => (
          <PartCard key={part.id} part={part} />
        ))}
      </div>

      {query && results.length === 0 && (
        <div className="text-center py-12 space-y-3">
          <p className="text-slate-400 text-lg">No parts match "{query}"</p>
          <p className="text-slate-500 text-sm">Try searching by a different name, alias, or keyword</p>
        </div>
      )}
    </div>
  );
}

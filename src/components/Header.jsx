import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, Wrench } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { getVerticalBadgeClass } from '../utils/helpers';

export default function Header() {
  const { query, updateQuery, results, clearSearch } = useSearch();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim().length >= 2) {
      setIsFocused(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleResultClick() {
    setIsFocused(false);
    clearSearch();
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Logo + Search Row */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white hidden sm:block">PartsDex</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Search by name, alias, or part number..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {isFocused && results.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-80 overflow-y-auto z-50"
              >
                {results.slice(0, 8).map((part) => (
                  <Link
                    key={part.id}
                    to={`/part/${part.id}`}
                    onClick={handleResultClick}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50 last:border-0"
                  >
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{part.name}</p>
                      <p className="text-xs text-slate-400 truncate">{part.description?.slice(0, 60)}...</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${getVerticalBadgeClass(part.vertical)}`}>
                      {part.vertical === 'boiler-heating' ? 'Boiler' : part.vertical.toUpperCase()}
                    </span>
                  </Link>
                ))}
                {results.length > 8 && (
                  <button
                    onClick={() => {
                      setIsFocused(false);
                      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                    }}
                    className="w-full px-4 py-3 text-center text-sm text-blue-400 hover:bg-slate-700/50 transition-colors"
                  >
                    View all {results.length} results →
                  </button>
                )}
              </div>
            )}

            {/* No results state */}
            {isFocused && query.length >= 2 && results.length === 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 text-center z-50"
              >
                <p className="text-slate-400 text-sm">No parts found for "{query}"</p>
                <p className="text-slate-500 text-xs mt-1">Try a different name, alias, or keyword</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </header>
  );
}

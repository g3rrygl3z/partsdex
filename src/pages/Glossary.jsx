import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Filter } from 'lucide-react';
import aliasesData from '../data/aliases.json';
import { getVerticalBadgeClass, getVerticalDisplayName } from '../utils/helpers';

export default function Glossary() {
  const [filter, setFilter] = useState('all');
  const [letterFilter, setLetterFilter] = useState(null);

  // Get unique first letters
  const letters = useMemo(() => {
    const set = new Set(aliasesData.map((a) => a.alias[0].toUpperCase()));
    return Array.from(set).sort();
  }, []);

  // Filter aliases
  const filtered = useMemo(() => {
    let result = aliasesData;
    if (filter !== 'all') {
      result = result.filter((a) => a.vertical === filter);
    }
    if (letterFilter) {
      result = result.filter((a) => a.alias[0].toUpperCase() === letterFilter);
    }
    return result;
  }, [filter, letterFilter]);

  // Group by letter
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((alias) => {
      const letter = alias.alias[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(alias);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Terminology Glossary</h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          All known aliases and trade terms — tap any to see the full part profile
        </p>
      </div>

      {/* Vertical Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {[
          { id: 'all', label: 'All' },
          { id: 'plumbing', label: 'Plumbing' },
          { id: 'hvac', label: 'HVAC' },
          { id: 'boiler-heating', label: 'Boiler & Heating' },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setFilter(v.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === v.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Letter Jump */}
      <div className="flex gap-1 flex-wrap">
        <button
          onClick={() => setLetterFilter(null)}
          className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors flex items-center justify-center ${
            !letterFilter ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All
        </button>
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => setLetterFilter(letterFilter === letter ? null : letter)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors flex items-center justify-center ${
              letterFilter === letter ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Glossary List */}
      <div className="space-y-6">
        {Object.keys(grouped)
          .sort()
          .map((letter) => (
            <div key={letter}>
              <h2 className="text-lg font-bold text-blue-400 mb-2 sticky top-16 bg-slate-950 py-1 z-10">
                {letter}
              </h2>
              <div className="space-y-1">
                {grouped[letter].map((alias, i) => (
                  <Link
                    key={`${alias.alias}-${i}`}
                    to={`/part/${alias.canonicalPartId}`}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:bg-slate-800 hover:border-slate-600 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                        {alias.alias}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        → {alias.canonicalPartId.replace(/-/g, ' ')}
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ml-2 ${getVerticalBadgeClass(alias.vertical)}`}>
                      {getVerticalDisplayName(alias.vertical)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No terms found for this filter.</p>
        </div>
      )}

      <p className="text-slate-600 text-xs text-center pb-4">
        {filtered.length} terms across {Object.keys(grouped).length} letters
      </p>
    </div>
  );
}

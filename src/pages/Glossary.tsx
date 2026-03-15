import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, ArrowRight } from 'lucide-react';
import aliasesData from '../data/aliases.json';
import { getVerticalBadgeClass, getVerticalDisplayName } from '../utils/helpers';
import { getAllParts } from '../utils/search';
import type { Vertical } from '../types';

export default function Glossary() {
  const [filter, setFilter] = useState<Vertical | 'all'>('all');
  const [letterFilter, setLetterFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const allParts = getAllParts();

  // Map generic ID to the first specific ID found in parts.json
  const resolvePartId = (genericId: string) => {
    const match = allParts.find(p => p.id === genericId || p.id.startsWith(`${genericId}-`));
    return match ? match.id : genericId;
  };

  // Get unique first letters
  const letters = useMemo(() => {
    const set = new Set(aliasesData.map((a) => a.alias[0].toUpperCase()));
    return Array.from(set).sort();
  }, []);

  // Filter aliases
  const filtered = useMemo(() => {
    let result = aliasesData as any[];
    if (filter !== 'all') {
      result = result.filter((a) => a.vertical === filter);
    }
    if (letterFilter) {
      result = result.filter((a) => a.alias[0].toUpperCase() === letterFilter);
    }
    if (searchTerm) {
      result = result.filter((a) => a.alias.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return result;
  }, [filter, letterFilter, searchTerm]);

  // Group by letter
  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filtered.forEach((alias) => {
      const letter = alias.alias[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(alias);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/15 rounded-2xl flex items-center justify-center border border-primary/20">
            <BookOpen className="w-6 h-6 text-primary-light" />
          </div>
          <div>
            <h1 className="heading-xl text-2xl !sm:text-3xl">Trade Glossary</h1>
            <p className="text-subtle">Alphabetical reference for all known aliases and technical terms</p>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
           {/* In-page search */}
           <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
             <input 
               type="text" 
               placeholder="Filter glossary terms..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
             />
           </div>

           {/* Vertical Filter */}
           <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {[
                { id: 'all', label: 'All' },
                { id: 'plumbing', label: 'Plumbing' },
                { id: 'hvac', label: 'HVAC' },
                { id: 'boiler-heating', label: 'Boilers' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setFilter(v.id as any)}
                  className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    filter === v.id
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                      : 'bg-slate-900/40 text-slate-500 border-white/5 hover:text-white hover:border-white/20'
                  }`}
                >
                  {v.label}
                </button>
              ))}
           </div>
        </div>

        {/* Letter Jump */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setLetterFilter(null)}
            className={`px-3 h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              !letterFilter ? 'bg-primary text-white' : 'bg-slate-900/40 text-slate-500 border border-white/5 hover:text-white'
            }`}
          >
            All
          </button>
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() => setLetterFilter(letterFilter === letter ? null : letter)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                letterFilter === letter ? 'bg-primary text-white' : 'bg-slate-900/40 text-slate-500 border border-white/5 hover:text-white'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary List */}
      <div className="space-y-12 pb-10">
        {Object.keys(grouped)
          .sort()
          .map((letter) => (
            <div key={letter} className="relative">
              <div className="flex items-center gap-4 mb-6 sticky top-20 bg-slate-950/80 backdrop-blur-md py-4 z-20">
                <h2 className="text-3xl font-black text-primary-light/40">{letter}</h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {grouped[letter].map((alias, i) => (
                  <Link
                    key={`${alias.alias}-${i}`}
                    to={`/part/${resolvePartId(alias.canonicalPartId)}`}
                    className="flex items-center justify-between p-4 glass-card glass-card-hover group border-white/5"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-bold text-white group-hover:text-primary-light transition-colors truncate">
                        {alias.alias}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tight">Referencing</span>
                         <p className="text-[11px] text-slate-400 truncate opacity-60 group-hover:opacity-100 transition-opacity">
                            {alias.canonicalPartId.replace(/-/g, ' ')}
                         </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={getVerticalBadgeClass(alias.vertical)}>
                        {getVerticalDisplayName(alias.vertical)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 glass-card bg-slate-900/20">
          <p className="text-slate-400 font-medium">No terminology matches your current filters.</p>
        </div>
      )}

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
         <div className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-2xl border border-white/10">
           {filtered.length} Indexed Terms
         </div>
      </div>
    </div>
  );
}

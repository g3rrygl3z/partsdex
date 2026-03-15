import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Search } from 'lucide-react';
import SmartSearch from './SmartSearch/SmartSearch';
import SearchOverlay from './SmartSearch/SearchOverlay';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Logo + Search Row */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white hidden sm:block">PartsDex</span>
          </Link>

          {/* Desktop Smart Search */}
          <div className="hidden sm:block flex-1 max-w-xl">
            <SmartSearch />
          </div>

          {/* Mobile Search Trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden flex-1 flex items-center gap-3 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 text-sm text-left transition-all active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>Search parts...</span>
          </button>
        </div>
      </div>

      {/* Global Search Overlay (Mobile) */}
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </header>
  );
}

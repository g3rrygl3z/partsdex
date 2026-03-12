import { Link } from 'react-router-dom';
import { Droplets, Wind, Flame, ChevronRight } from 'lucide-react';
import type { Vertical } from '../types';

const verticals: { id: Vertical; name: string; icon: any; color: string; count?: number }[] = [
  { id: 'plumbing', name: 'Plumbing', icon: Droplets, color: 'text-blue-400' },
  { id: 'hvac', name: 'HVAC', icon: Wind, color: 'text-emerald-400' },
  { id: 'boiler-heating', name: 'Boiler & Heating', icon: Flame, color: 'text-amber-400' },
];

export default function Browse() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Browse Library</h1>
        <p className="text-slate-400 text-sm mt-1">Select an industry to explore parts and components</p>
      </div>

      <div className="grid gap-4">
        {verticals.map((v) => {
          const Icon = v.icon;
          return (
            <Link
              key={v.id}
              to={`/browse/${v.id}`}
              className="flex items-center justify-between p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${v.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {v.name}
                  </h3>
                  <p className="text-slate-500 text-xs">Explore all {v.name.toLowerCase()} parts</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

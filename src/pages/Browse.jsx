import { Link } from 'react-router-dom';
import { Droplets, Wind, Flame, ArrowRight } from 'lucide-react';
import { getPartCounts } from '../utils/search';
import categoriesData from '../data/categories.json';

const verticalIcons = {
  plumbing: Droplets,
  hvac: Wind,
  'boiler-heating': Flame,
};

const verticalStyles = {
  plumbing: {
    gradient: 'from-blue-600/20 to-blue-800/10',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    badge: 'bg-blue-500/15 text-blue-400',
  },
  hvac: {
    gradient: 'from-emerald-600/20 to-emerald-800/10',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-400',
  },
  'boiler-heating': {
    gradient: 'from-amber-600/20 to-amber-800/10',
    border: 'border-amber-500/30',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    badge: 'bg-amber-500/15 text-amber-400',
  },
};

export default function Browse() {
  const counts = getPartCounts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Browse Parts</h1>
        <p className="text-slate-400 text-sm mt-1">Explore by industry vertical and part category</p>
      </div>

      <div className="space-y-6">
        {categoriesData.verticals.map((vertical) => {
          const Icon = verticalIcons[vertical.id];
          const style = verticalStyles[vertical.id];
          return (
            <div key={vertical.id} className="space-y-3">
              {/* Vertical Header */}
              <Link
                to={`/browse/${vertical.id}`}
                className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${style.gradient} border ${style.border} hover:brightness-110 transition-all group`}
              >
                <div className={`w-12 h-12 ${style.iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${style.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h2 className="text-white font-semibold text-lg">{vertical.name}</h2>
                  <p className="text-slate-400 text-xs mt-0.5">{vertical.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-sm">{counts[vertical.id] || 0}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </Link>

              {/* Subcategories */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-2">
                {vertical.subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/browse/${vertical.id}?sub=${sub.id}`}
                    className="flex items-center gap-2 px-3 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-all"
                  >
                    <span className={`w-2 h-2 rounded-full ${style.iconBg}`}></span>
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

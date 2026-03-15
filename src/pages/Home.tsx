import { Link } from 'react-router-dom';
import { Droplets, Wind, Flame, ArrowRight, Wrench, Search } from 'lucide-react';
import { getPartCounts, getAllParts } from '../utils/search';
import PartCard from '../components/PartCard';
import type { Vertical } from '../types';

const verticalIcons: Record<Vertical, any> = {
  plumbing: Droplets,
  hvac: Wind,
  'boiler-heating': Flame,
};

const verticalConfig: {
  id: Vertical;
  name: string;
  description: string;
  gradient: string;
  border: string;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    description: 'Pipes, fittings, valves, fixtures & drainage',
    gradient: 'from-blue-600 to-blue-800',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    id: 'hvac',
    name: 'HVAC',
    description: 'Ductwork, air handlers & refrigerant',
    gradient: 'from-emerald-600 to-emerald-800',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    id: 'boiler-heating',
    name: 'Boiler & Heating',
    description: 'Boilers, expanson tanks & circulators',
    gradient: 'from-amber-600 to-amber-800',
    border: 'border-amber-500/30',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
  },
];

export default function Home() {
  const counts = getPartCounts();
  const allParts = getAllParts();
  // Show a few popular parts
  const featuredParts = allParts.slice(0, 6);

  return (
    <div className="space-y-12 pb-10 animate-in fade-in duration-1000">
      <div style={{color: 'lime', background: 'black', padding: 8, fontWeight: 'bold'}}>DEBUG: Home component rendered</div>
      {/* Hero Section */}
      <section className="text-center space-y-6 py-10 relative">
        {/* Abstract background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -z-10" />
        
        <div className="w-20 h-20 bg-primary/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto border border-primary/30 shadow-2xl shadow-primary/20 active:scale-95 transition-transform duration-300">
          <Wrench className="w-10 h-10 text-primary-light" />
        </div>
        
        <div className="space-y-2">
          <h1 className="heading-xl">
            Parts<span className="text-primary-light">Dex</span>
          </h1>
          <p className="max-w-md mx-auto text-subtle font-medium text-slate-300">
            The on-the-job reference for trade professionals. Identify parts, learn aliases, and find what you need — <span className="text-primary-light">fast.</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/search" className="btn-primary w-full sm:w-auto px-10">
            <Search className="w-5 h-5" />
            Search Library
          </Link>
          <Link to="/browse" className="w-full sm:w-auto px-10 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-bold text-white flex items-center justify-center gap-2">
            Browse All
          </Link>
        </div>
      </section>

      {/* Industry Verticals */}
      <section className="space-y-6">
        <h2 className="heading-lg text-lg sm:text-xl">Browse by Industry</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {verticalConfig.map((v) => {
            const Icon = verticalIcons[v.id];
            return (
              <Link
                key={v.id}
                to={`/browse/${v.id}`}
                className="group flex flex-col p-6 glass-card glass-card-hover relative overflow-hidden"
              >
                {/* Subtle side accent color */}
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${v.gradient} opacity-50`} />
                
                <div className={`w-12 h-12 ${v.iconBg} rounded-xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  <Icon className={`w-6 h-6 ${v.iconColor}`} />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-white font-bold text-base flex items-center justify-between">
                    {v.name}
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight line-clamp-2">
                    {v.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Database</span>
                   <span className="text-xs font-black text-white">{counts[v.id] || 0} Parts</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Parts */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="heading-lg text-lg sm:text-xl">Common Site Components</h2>
          <Link to="/browse" className="text-primary-light text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">
            View full library →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredParts.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      </section>
    </div>
  );
}

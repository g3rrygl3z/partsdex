import { Link } from 'react-router-dom';
import { Droplets, Wind, Flame, ChevronRight } from 'lucide-react';
import type { Vertical } from '../types';

const verticals: { id: Vertical; name: string; icon: any; color: string; desc: string }[] = [
  { 
    id: 'plumbing', 
    name: 'Plumbing', 
    icon: Droplets, 
    color: 'text-blue-400',
    desc: 'Pipes, fittings, drainage, valves and water supply components.'
  },
  { 
    id: 'hvac', 
    name: 'HVAC', 
    icon: Wind, 
    color: 'text-emerald-400',
    desc: 'Air handling, ductwork, heating, cooling and ventilation.'
  },
  { 
    id: 'boiler-heating', 
    name: 'Boiler & Heating', 
    icon: Flame, 
    color: 'text-amber-400',
    desc: 'Boiler components, expansion tanks, pumps and radiators.'
  },
];

export default function Browse() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="space-y-2">
        <h1 className="heading-xl">Library Browser</h1>
        <p className="text-subtle">Explore our database of trade components organized by industry vertical</p>
      </div>

      <div className="grid gap-4">
        {verticals.map((v) => {
          const Icon = v.icon;
          return (
            <Link
              key={v.id}
              to={`/browse/${v.id}`}
              className="flex items-center justify-between p-6 glass-card glass-card-hover group relative overflow-hidden"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-colors" />

              <div className="flex items-center gap-6 relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                  <Icon className={`w-8 h-8 ${v.color}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-light transition-colors">
                    {v.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium max-w-sm">
                    {v.desc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hidden sm:inline">Explore</span>
                 <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

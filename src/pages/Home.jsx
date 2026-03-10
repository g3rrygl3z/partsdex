import { Link } from 'react-router-dom';
import { Droplets, Wind, Flame, ArrowRight, Wrench, Search } from 'lucide-react';
import { getPartCounts } from '../utils/search';
import PartCard from '../components/PartCard';
import { getAllParts } from '../utils/search';

const verticalIcons = {
  plumbing: Droplets,
  hvac: Wind,
  'boiler-heating': Flame,
};

const verticalConfig = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    description: 'Pipes, fittings, valves, fixtures, drainage & supply',
    gradient: 'from-blue-600 to-blue-800',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    id: 'hvac',
    name: 'HVAC',
    description: 'Ductwork, air handlers, refrigerant, controls & filters',
    gradient: 'from-emerald-600 to-emerald-800',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    id: 'boiler-heating',
    name: 'Boiler & Heating',
    description: 'Boiler components, expansion, circulators & radiators',
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
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-6">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-600/25">
          <Wrench className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Parts<span className="text-blue-400">Dex</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          The on-the-job reference for trade professionals. Identify parts, learn aliases, and find what you need — fast.
        </p>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-600/25"
        >
          <Search className="w-4 h-4" />
          Search Parts
        </Link>
      </section>

      {/* Industry Verticals */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">Browse by Industry</h2>
        <div className="grid gap-3">
          {verticalConfig.map((v) => {
            const Icon = verticalIcons[v.id];
            return (
              <Link
                key={v.id}
                to={`/browse/${v.id}`}
                className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${v.gradient}/10 border ${v.border} hover:bg-gradient-to-r hover:${v.gradient}/20 transition-all group`}
              >
                <div className={`w-12 h-12 ${v.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`w-6 h-6 ${v.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base">{v.name}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">{v.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-500 text-sm font-medium">{counts[v.id] || 0} parts</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Parts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Popular Parts</h2>
          <Link to="/browse" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {featuredParts.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      </section>
    </div>
  );
}

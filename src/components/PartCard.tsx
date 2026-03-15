import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { getVerticalBadgeClass, getVerticalDisplayName } from '../utils/helpers';
import type { NormalizedPart } from '../utils/search';

interface PartCardProps {
  part: NormalizedPart;
}

/**
 * PartCard — Uniform grid card for parts.
 * Updated for Monday's UI Polish with glassmorphism and consistent layout tokens.
 */
export default function PartCard({ part }: PartCardProps) {
  return (
    <Link
      to={`/part/${part.id}`}
      className="group flex flex-col glass-card glass-card-hover h-full overflow-hidden"
    >
      {/* Thumbnail / Visual Area */}
      <div className="aspect-[4/3] bg-slate-800/20 flex items-center justify-center relative overflow-hidden">
        {/* Subtle background glow on hover */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
        
        {(part.images && part.images.length > 0) ? (
          <img
            src={part.images[0]}
            alt={part.name}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : part.diagramUrl ? (
          <img
            src={part.diagramUrl}
            alt={part.name}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <Wrench className="w-10 h-10 text-slate-500 group-hover:text-primary/60 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
        )}
        
        {/* Industry badge overlay */}
        <div className="absolute top-2 left-2 z-10">
          <span className={getVerticalBadgeClass(part.vertical)}>
            {getVerticalDisplayName(part.vertical)}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-primary-light transition-colors duration-300">
          {part.name}
        </h3>
        
        <p className="text-[12px] text-slate-400 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
          {part.description}
        </p>

        {/* Footer info/tags if needed, currently kept minimal for uniform grid */}
        <div className="mt-auto pt-2 flex items-center gap-2">
           <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">
             {part.subcategory}
           </span>
        </div>
      </div>
    </Link>
  );
}

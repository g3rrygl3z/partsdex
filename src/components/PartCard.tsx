import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { getVerticalBadgeClass, getVerticalDisplayName } from '../utils/helpers';
import type { NormalizedPart } from '../utils/search';

interface PartCardProps {
  part: NormalizedPart;
}

export default function PartCard({ part }: PartCardProps) {
  return (
    <Link
      to={`/part/${part.id}`}
      className="group flex flex-col bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600 hover:bg-slate-800 transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="aspect-square bg-slate-700/40 flex items-center justify-center overflow-hidden">
        {part.images && part.images.length > 0 ? (
          <img
            src={part.images[0]}
            alt={part.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <Wrench className="w-10 h-10 text-slate-500 group-hover:text-slate-400 transition-colors" />
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover:text-blue-300 transition-colors">
            {part.name}
          </h3>
        </div>
        <span className={`self-start text-[10px] px-2 py-0.5 rounded-full font-medium ${getVerticalBadgeClass(part.vertical)}`}>
          {getVerticalDisplayName(part.vertical)}
        </span>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {part.description}
        </p>
      </div>
    </Link>
  );
}

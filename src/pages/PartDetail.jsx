import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wrench, Tag, Layers, CheckCircle2, Lightbulb, Info, BookOpen, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPartById } from '../utils/search';
import { getVerticalBadgeClass, getVerticalDisplayName } from '../utils/helpers';

export default function PartDetail() {
  const { partId } = useParams();
  const part = getPartById(partId);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!part) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-400 text-lg">Part not found.</p>
        <Link to="/browse" className="text-blue-400 mt-2 inline-block hover:text-blue-300">
          ← Back to Browse
        </Link>
      </div>
    );
  }

  const hasImages = part.images && part.images.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <Link
        to={-1}
        onClick={(e) => {
          e.preventDefault();
          window.history.back();
        }}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      {/* Hero */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        {/* Image Gallery / Placeholder */}
        {hasImages ? (
          <div className="relative">
            {/* Main Image */}
            <div className="aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
              <img
                src={part.images[selectedImage]}
                alt={`${part.name} — view ${selectedImage + 1}`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Image Navigation Arrows */}
            {part.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === 0 ? part.images.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === part.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <Camera className="w-3 h-3 text-white/70" />
              <span className="text-xs text-white/70">{selectedImage + 1} / {part.images.length}</span>
            </div>

            {/* Thumbnail Strip */}
            {part.images.length > 1 && (
              <div className="flex gap-1 p-2 bg-slate-800/80 overflow-x-auto">
                {part.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage
                        ? 'border-blue-400 opacity-100'
                        : 'border-transparent opacity-50 hover:opacity-80'
                      }`}
                  >
                    <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video bg-slate-700/30 flex items-center justify-center">
            <div className="text-center space-y-2">
              <Wrench className="w-16 h-16 text-slate-500 mx-auto" />
              <p className="text-slate-500 text-xs">Technical diagram coming soon</p>
            </div>
          </div>
        )}

        {/* Title area */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-white leading-tight">{part.name}</h1>
            <span className={`shrink-0 text-xs px-3 py-1 rounded-full font-medium ${getVerticalBadgeClass(part.vertical)}`}>
              {getVerticalDisplayName(part.vertical)}
            </span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{part.description}</p>
        </div>
      </div>

      {/* Aliases Table */}
      {part.aliases && part.aliases.length > 0 && (
        <Section icon={Tag} title="Also Known As" subtitle="Names and aliases used across the trade">
          <div className="divide-y divide-slate-700/50">
            {/* Primary name */}
            <div className="flex items-center justify-between py-3 px-1">
              <span className="text-white font-medium text-sm">{part.name}</span>
              <span className="text-xs text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full">Primary name</span>
            </div>
            {part.aliases.map((alias, i) => (
              <div key={i} className="flex items-center justify-between py-3 px-1 gap-3">
                <span className="text-slate-200 text-sm">{alias.name}</span>
                <span className="text-slate-500 text-xs text-right shrink-0 max-w-[50%]">{alias.context}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Materials & Sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {part.materials && (
          <Section icon={Layers} title="Materials">
            <div className="flex flex-wrap gap-2">
              {part.materials.map((mat, i) => (
                <span key={i} className="text-xs bg-slate-700/60 text-slate-300 px-3 py-1.5 rounded-lg">
                  {mat}
                </span>
              ))}
            </div>
          </Section>
        )}
        {part.sizes && (
          <Section icon={Info} title="Available Sizes">
            <div className="flex flex-wrap gap-2">
              {part.sizes.map((size, i) => (
                <span key={i} className="text-xs bg-slate-700/60 text-slate-300 px-3 py-1.5 rounded-lg">
                  {size}
                </span>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Connection Type */}
      {part.connectionType && (
        <Section icon={Layers} title="Connection Type">
          <p className="text-slate-300 text-sm">{part.connectionType}</p>
        </Section>
      )}

      {/* Compatibility */}
      {part.compatibility && part.compatibility.length > 0 && (
        <Section icon={CheckCircle2} title="Compatible With">
          <ul className="space-y-2">
            {part.compatibility.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Use Cases */}
      {part.useCases && part.useCases.length > 0 && (
        <Section icon={Lightbulb} title="Common Use Cases">
          <ul className="space-y-2">
            {part.useCases.map((uc, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                {uc}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Installation Notes */}
      {part.installationNotes && (
        <Section icon={BookOpen} title="Installation Notes">
          <p className="text-slate-300 text-sm leading-relaxed">{part.installationNotes}</p>
        </Section>
      )}
    </div>
  );
}

/** Reusable section wrapper */
function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-400" />
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>
      {subtitle && <p className="text-slate-500 text-xs -mt-1">{subtitle}</p>}
      {children}
    </div>
  );
}

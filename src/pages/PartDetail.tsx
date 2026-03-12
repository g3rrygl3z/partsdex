import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, Tag, Layers, CheckCircle2, Info, BookOpen } from 'lucide-react';
import { getPartById } from '../utils/search';
import { getVerticalBadgeClass, getVerticalDisplayName } from '../utils/helpers';
import React from 'react';

export default function PartDetail() {
  const { partId } = useParams<{ partId: string }>();
  const navigate = useNavigate();
  const part = getPartById(partId);

  if (!part) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-400 text-lg">Part not found.</p>
        <button 
          onClick={() => navigate('/')} 
          className="text-blue-400 mt-2 inline-block hover:text-blue-300"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Hero */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        {/* Diagram placeholder */}
        <div className="aspect-video bg-slate-700/30 flex items-center justify-center">
          <div className="text-center space-y-2">
            <Wrench className="w-16 h-16 text-slate-500 mx-auto" />
            <p className="text-slate-500 text-xs">Technical diagram coming soon</p>
          </div>
        </div>

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
            {part.aliases.map((alias: string, i: number) => (
              <div key={i} className="flex items-center justify-between py-3 px-1 gap-3">
                <span className="text-slate-200 text-sm">{alias}</span>
                <span className="text-slate-500 text-xs text-right shrink-0 max-w-[50%]">General trade term</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Materials & Sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {part.materials && part.materials.length > 0 && (
          <Section icon={Layers} title="Materials">
            <div className="flex flex-wrap gap-2">
              {part.materials.map((mat: string, i: number) => (
                <span key={i} className="text-xs bg-slate-700/60 text-slate-300 px-3 py-1.5 rounded-lg">
                  {mat}
                </span>
              ))}
            </div>
          </Section>
        )}
        {(part as any).sizes && (part as any).sizes.length > 0 && (
          <Section icon={Info} title="Available Sizes">
            <div className="flex flex-wrap gap-2">
              {(part as any).sizes.map((size: string, i: number) => (
                <span key={i} className="text-xs bg-slate-700/60 text-slate-300 px-3 py-1.5 rounded-lg">
                  {size}
                </span>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Compatibility */}
      {part.compatibleWith && part.compatibleWith.length > 0 && (
        <Section icon={CheckCircle2} title="Compatible With">
          <ul className="space-y-2">
            {part.compatibleWith.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                {item}
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
interface SectionProps {
  icon: any;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function Section({ icon: Icon, title, subtitle, children }: SectionProps) {
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

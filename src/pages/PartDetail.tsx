
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, CheckCircle2, Info, BookOpen, Activity, Droplets, Zap } from 'lucide-react';
import { getPartById } from '../utils/search';
import { getVerticalBadgeClass, getVerticalDisplayName } from '../utils/helpers';
import DiagramViewer from '../components/DiagramViewer';
import React, { useState, useEffect } from 'react';
import { fetchNanoBananaVisualizationData, type VisualizationData } from '../utils/nanoBananaService';
import Recommendations from '../components/Recommendations/Recommendations';

export default function PartDetail() {
  const { partId } = useParams<{ partId: string }>();
  const navigate = useNavigate();
  const part = getPartById(partId);

  const [aiData, setAiData] = useState<VisualizationData | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (part) {
      const loadAiData = async () => {
        setLoadingAi(true);
        try {
          const data = await fetchNanoBananaVisualizationData(part.name);
          setAiData(data);
        } catch (err) {
          console.error("Failed to load AI visualization:", err);
        } finally {
          setLoadingAi(false);
        }
      };
      loadAiData();
    } else {
      setAiData(null);
    }
  }, [partId, part]);

  if (!part) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="heading-lg">Part not found</h2>
        <p className="text-subtle mb-6">The part ID you are looking for does not exist in our library.</p>
        <button 
          onClick={() => navigate('/')} 
          className="btn-primary inline-flex"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section - Diagram & Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Diagram */}
        <DiagramViewer 
          url={(part.images && part.images.length > 0) ? part.images[0] : part.diagramUrl} 
          name={part.name} 
        />
        {/* Right: Core Identity */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={getVerticalBadgeClass(part.vertical)}>
                {getVerticalDisplayName(part.vertical)}
              </span>
              <span className="text-[10px] bg-white/10 text-white/50 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                {part.subcategory}
              </span>
            </div>
            <h1 className="heading-xl leading-tight">{part.name}</h1>
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
              <p className="text-sm text-blue-200/80 leading-relaxed font-medium">
                {part.description}
              </p>
            </div>
          </div>
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 glass-card bg-slate-800/20">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Materials</p>
              <p className="text-xs text-white font-medium">{part.materials.join(', ')}</p>
            </div>
            <div className="p-3 glass-card bg-slate-800/20">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Part ID</p>
              <p className="text-xs text-white font-mono opacity-60">{part.id}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Detailed Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Center: Also Known As (Aliases) & AI Visualization */}
        <div className="lg:col-span-2 space-y-8">
          {/* AI-Generated Visualization Insights (Experimental) */}
          {aiData && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-primary/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-12 h-12 text-primary-light" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary-light animate-pulse" />
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">AI Visualization Insights</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Internal Flow Logic</p>
                    <div className="flex items-center gap-2 text-primary-light">
                      <Droplets className="w-4 h-4" />
                      <span className="text-sm font-semibold capitalize">{aiData.flowDirection} flow pattern</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Visual Rendering Hints</p>
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      "{aiData.visualizationNotes}"
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Critical Connection Points</p>
                  <div className="flex flex-wrap gap-2">
                    {aiData.criticalConnections.map((conn, i) => (
                      <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-slate-300 font-medium">
                        {conn}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {loadingAi && (
            <div className="p-12 glass-card bg-slate-900/20 flex flex-col items-center justify-center gap-3 border-dashed border-white/10">
              <Activity className="w-6 h-6 text-primary-light animate-spin" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Generating Technical Model...</p>
            </div>
          )}
          {part.aliases && part.aliases.length > 0 && (
            <Section icon={Tag} title="Trade Terminology & Aliases" subtitle="Regional names used by professionals on the job">
              <div className="divide-y divide-white/5 bg-slate-900/40 rounded-2xl overflow-hidden border border-white/5">
                {/* Primary name row */}
                <div className="flex items-center justify-between p-4 bg-primary/5">
                  <span className="text-white font-bold text-sm">{part.name}</span>
                  <span className="text-[10px] text-primary-light font-bold uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                    Primary Name
                  </span>
                </div>
                {/* Alias rows */}
                {part.aliases.map((alias: any, i: number) => {
                  const aliasName = typeof alias === 'string' ? alias : alias?.name || String(alias);
                  const aliasContext = typeof alias === 'object' && alias?.context ? alias.context : 'General Alias';
                  return (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                      <span className="text-slate-300 text-sm font-medium">{aliasName}</span>
                      <span className="text-slate-500 text-[10px] font-bold uppercase">{aliasContext}</span>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}
          {/* Installation Notes */}
          {part.installationNotes && (
            <Section icon={BookOpen} title="Installation & Use Context">
              <div className="p-5 glass-card bg-slate-900/60 border-l-4 border-l-primary leading-relaxed">
                <p className="text-slate-300 text-sm">{part.installationNotes}</p>
              </div>
            </Section>
          )}
        </div>
        {/* Sidebar: Compatibility & Extras */}
        <div className="space-y-6">
          {part.compatibleWith && part.compatibleWith.length > 0 && (
            <Section icon={CheckCircle2} title="Compatible With">
              <div className="flex flex-col gap-2">
                {part.compatibleWith.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 glass-card bg-slate-900/60 group">
                    <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    </div>
                    <span className="text-xs text-slate-300 font-semibold group-hover:text-white transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
          <div className="p-6 glass-card bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary-light" />
              Need a Diagram?
            </h4>
            <p className="text-xs text-slate-400 leading-normal">
              Use the search bar or camera (Phase 2) to quickly identify similar components on site.
            </p>
          </div>
        </div>
      </div>

      {/* AI-Powered Recommendations */}
      <Recommendations
        partId={part.id}
        partName={part.name}
        partDescription={part.description}
      />
    </div>
  );
}

interface SectionProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}


// Section component and SectionProps interface
interface SectionProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function Section({ icon: Icon, title, subtitle, children }: SectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary-light" />
          <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
        </div>
        {subtitle && <p className="text-slate-500 text-xs font-medium pl-7">{subtitle}</p>}
      </div>
      <div className="animate-in fade-in slide-in-from-top-2 duration-500">
        {children}
      </div>
    </div>
  );
}

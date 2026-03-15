import React from 'react';
import Tilt from 'react-parallax-tilt';
import { Wrench, Maximize2, Info } from 'lucide-react';

interface DiagramViewerProps {
  url?: string;
  name: string;
  category?: string;
}

/**
 * DiagramViewer — premium technical illustration viewer with 3D tilt effect.
 * Handles fallbacks, scaling for mobile (PWA), and polished styling as per Monday's requirements.
 */
export default function DiagramViewer({ url, name }: DiagramViewerProps) {
  const [hasError, setHasError] = React.useState(false);
    const [imgLoading, setImgLoading] = React.useState(true);

  return (
    <div className="relative group perspective-1000">
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        perspective={1000}
        scale={1.02}
        transitionSpeed={1500}
        className="relative z-10"
      >
        <div className="aspect-[4/3] w-full glass-card overflow-hidden bg-slate-900/60 shadow-2xl relative">
          {/* Animated Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/10 pointer-events-none" />
          
          {/* Image / Fallback Container */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
              {imgLoading && url && !hasError && (
                <div className="text-center animate-pulse text-blue-400">Loading diagram...</div>
              )}
            {!url || hasError ? (
              <div className="text-center space-y-4 animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto border border-white/5 shadow-inner">
                  <Wrench className="w-10 h-10 text-slate-500" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Technical Diagram</p>
                  <p className="text-slate-500 text-xs mt-1 italic">Identification visuals pending for {name}</p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                  <Info className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] text-blue-400 font-medium tracking-wide uppercase">AI Identification Phase 2</span>
                </div>
              </div>
            ) : (
              <img
                src={url}
                alt={`Technical diagram for ${name}`}
                className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105"
                onError={() => setHasError(true)}
                  onLoad={() => setImgLoading(false)}
                  style={{ display: imgLoading ? 'none' : 'block' }}
              />
            )}
          </div>

          {/* Controls Overlay (Bottom Right) */}
          <div className="absolute bottom-4 right-4 flex gap-2">
             <button className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors" title="View Fullscreen">
               <Maximize2 className="w-4 h-4" />
             </button>
          </div>
        </div>
      </Tilt>

      {/* Shadow Base (Reflection effect) */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/40 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

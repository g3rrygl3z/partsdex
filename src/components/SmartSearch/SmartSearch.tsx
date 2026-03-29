import React, { useRef, useEffect, useState } from "react";
import { useNavigate }       from "react-router-dom";
import { Camera }            from "lucide-react";
import { useSmartSearch }    from "../../hooks/useSmartSearch";
import PhotoIdentify         from "../PhotoIdentify/PhotoIdentify";
import type { NormalizedPart } from "../../utils/search";
import styles                from "./SmartSearch.module.css";

// -- Sub-components ------------------------------------------------------------

interface CategoryBadgeProps {
  category: string;
  subCategory: string;
}

function CategoryBadge({ category, subCategory }: CategoryBadgeProps) {
  const map: Record<string, { label: string; cls: string }> = {
    plumbing:       { label: "Plumbing",  cls: "badgePlumbing"  },
    "boiler-heating":{ label: "Heating",  cls: "badgeHeating"   },
    hvac:           { label: "HVAC",      cls: "badgeHvac"      },
  };
  const subMap: Record<string, string> = {
    valves:             "Valve",
    fittings:           "Fitting",
    "expansion-tanks":  "Exp. Tank",
    gauges:             "Gauge",
    packages:           "Package",
    "flexible connectors": "Flex",
    accessories:        "Accessory",
  };
  const cat = map[category] || { label: category, cls: "badgePlumbing" };
  const sub = subMap[subCategory] || subCategory;
  return (
    <span className={`${styles.badge} ${styles[cat.cls as keyof typeof styles]}`}>
      {cat.label} · {sub}
    </span>
  );
}

function ConfidenceDot({ confidence }: { confidence: string | null }) {
  if (!confidence) return null;
  const cls = {
    high:   styles.dotHigh,
    medium: styles.dotMed,
    low:    styles.dotLow,
  }[confidence as 'high' | 'medium' | 'low'] || styles.dotMed;
  return <span className={`${styles.dot} ${cls}`} title={`AI confidence: ${confidence}`} />;
}

interface PartRowProps {
  part: NormalizedPart;
  onSelect: (part: NormalizedPart) => void;
  isAi: boolean;
}

function PartRow({ part, onSelect, isAi }: PartRowProps) {
  return (
    <button className={styles.partRow} onClick={() => onSelect(part)}>
      <div className={styles.partRowImg}>
        <img
          src={part.images?.[0] || part.diagramUrl || `/images/parts/${part.id}.jpg`}
          alt={part.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const fallback = target.nextSibling as HTMLDivElement;
            if (fallback) fallback.style.display = "flex";
          }}
        />
        <div className={styles.partRowImgFallback} style={{ display: "none" }}>
          <PartIcon subCategory={part.subcategory} />
        </div>
      </div>

      <div className={styles.partRowBody}>
        <div className={styles.partRowTop}>
          <span className={styles.partRowName}>{part.name}</span>
          {isAi && <span className={styles.aiTag}>AI</span>}
        </div>
        <div className={styles.partRowMeta}>
          {part.modelNumber && <code className={styles.sku}>{part.modelNumber}</code>}
          <CategoryBadge category={part.vertical} subCategory={part.subcategory} />
          {part.aliases?.slice(0, 2).map((alias: any, idx: number) => {
            const aliasText = typeof alias === 'string' ? alias : alias?.name || String(alias);
            return <span key={idx} className={styles.alias}>{aliasText}</span>;
          })}
        </div>
      </div>

      <div className={styles.partRowArrow}>›</div>
    </button>
  );
}

function PartIcon({ subCategory }: { subCategory: string }) {
  const icons: Record<string, React.ReactNode> = {
    fittings: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="10" width="18" height="4" rx="2"/>
        <rect x="8" y="8" width="3" height="8" rx="1"/>
        <rect x="13" y="8" width="3" height="8" rx="1"/>
      </svg>
    ),
    valves: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="10" width="7" height="4" rx="1"/>
        <rect x="14" y="10" width="7" height="4" rx="1"/>
        <circle cx="12" cy="12" r="3"/>
        <line x1="12" y1="5" x2="12" y2="9"/>
        <line x1="10" y1="5" x2="14" y2="5"/>
      </svg>
    ),
    "expansion-tanks": (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="7" y="4" width="10" height="16" rx="5"/>
        <line x1="12" y1="2" x2="12" y2="4"/>
        <line x1="10" y1="12" x2="14" y2="12"/>
      </svg>
    ),
    gauges: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="8"/>
        <line x1="12" y1="12" x2="16" y2="8"/>
        <circle cx="12" cy="12" r="1" fill="currentColor"/>
      </svg>
    ),
    default: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9"/>
        <line x1="12" y1="8" x2="12" y2="13"/>
        <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
      </svg>
    ),
  };
  return icons[subCategory] || icons.default;
}

interface AiExplanationBarProps {
  explanation: string;
  confidence: string | null;
  isLoading: boolean;
}

function AiExplanationBar({ explanation, confidence, isLoading }: AiExplanationBarProps) {
  if (isLoading) {
    return (
      <div className={styles.aiBar}>
        <div className={styles.aiBarPulse} />
        <span className={styles.aiBarText}>Searching with AI…</span>
      </div>
    );
  }
  if (!explanation) return null;
  return (
    <div className={styles.aiBar}>
      <ConfidenceDot confidence={confidence} />
      <span className={styles.aiBarText}>{explanation}</span>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
          <circle cx="11" cy="11" r="7"/>
          <line x1="16.5" y1="16.5" x2="21" y2="21"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </div>
      <p className={styles.emptyTitle}>No parts found for "{query}"</p>
      <p className={styles.emptyHint}>
        Try a trade name, alias, or describe what it looks like — e.g. "brass elbow push fit" or "grey heating tank"
      </p>
    </div>
  );
}

// -- Main component ------------------------------------------------------------

interface SmartSearchProps {
  autoFocus?: boolean;
  onClose?: () => void;
}

export default function SmartSearch({ autoFocus = false, onClose }: SmartSearchProps) {
  const navigate = useNavigate();
  const inputRef  = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isPhotoIdOpen, setIsPhotoIdOpen] = useState(false);

  const {
    query, setQuery,
    results,
    isAiLoading,
    aiExplanation,
    aiConfidence,
    aiError,
    mode,
    clear,
    hasResults,
    isEmpty,
  } = useSmartSearch();

  // Auto-focus on mount if requested (e.g. search overlay)
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Listen for custom search events (e.g. from hint pills)
  useEffect(() => {
    const handler = (e: any) => {
      setQuery(e.detail || "");
      inputRef.current?.focus();
    };
    window.addEventListener("partsdex:search", handler);
    return () => window.removeEventListener("partsdex:search", handler);
  }, [setQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        if (onClose) onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      clear();
      if (onClose) onClose();
    }
  };

  const handleSelect = (part: NormalizedPart) => {
    clear();
    navigate(`/part/${part.id}`);
    if (onClose) onClose();
  };

  const showDropdown = query.trim().length > 0;

  return (
    <div className={styles.root}>
      {/* Search input */}
      <div className={styles.inputWrap}>
        <span className={styles.searchIcon}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
            <circle cx="9" cy="9" r="6"/>
            <line x1="13.5" y1="13.5" x2="18" y2="18"/>
          </svg>
        </span>

        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="Search by name, SKU, alias, or describe the part…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck="false"
        />

        {/* Camera trigger */}
        {!query && (
          <button 
            className={styles.cameraBtn} 
            onClick={() => setIsPhotoIdOpen(true)}
            title="Identify part by photo"
            aria-label="Toggle photo identification"
          >
            <Camera className="w-5 h-5" />
          </button>
        )}

        {/* AI loading spinner */}
        {isAiLoading && (
          <span className={styles.spinner} aria-label="AI searching">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </span>
        )}

        {/* Mode badge — shows when AI is active */}
        {mode === "ai" && !isAiLoading && query && (
          <span className={styles.modeBadge}>AI</span>
        )}

        {/* Clear button */}
        {query && (
          <button className={styles.clearBtn} onClick={clear} aria-label="Clear search">
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className={styles.dropdown} ref={dropdownRef}>

          {/* AI explanation bar */}
          {(isAiLoading || aiExplanation) && (
            <AiExplanationBar
              explanation={aiExplanation}
              confidence={aiConfidence}
              isLoading={isAiLoading}
            />
          )}

          {/* Error fallback */}
          {aiError && (
            <div className={styles.errorBar}>{aiError}</div>
          )}

          {/* Results */}
          {hasResults && results.map((part) => (
            <PartRow
              key={part.id}
              part={part}
              onSelect={handleSelect}
              isAi={mode === "ai"}
            />
          ))}

          {/* Empty state */}
          {isEmpty && !isAiLoading && <EmptyState query={query} />}

          {/* Footer hint */}
          {hasResults && (
            <div className={styles.dropdownFooter}>
              {results.length} result{results.length !== 1 ? "s" : ""} ·{" "}
              {mode === "ai" ? "AI-powered search" : "local search"} ·{" "}
              <kbd>Esc</kbd> to close
            </div>
          )}
        </div>
      )}

      {/* Photo ID Modal Overlay */}
      {isPhotoIdOpen && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setIsPhotoIdOpen(false)}>
          <div className={styles.overlayInner}>
            <PhotoIdentify onClose={() => setIsPhotoIdOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
